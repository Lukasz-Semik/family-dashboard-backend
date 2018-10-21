import {
  JsonController,
  Body,
  Get,
  Post,
  Res,
  UseBefore,
  Authorized,
  HeaderParam,
  Req,
  Patch,
  Delete,
} from 'routing-controllers';
import { getRepository } from 'typeorm';
import { isEmpty, get } from 'lodash';
import { hash, compare } from 'bcryptjs';

import { Token } from '.';
import { User, Family } from '../entity';
import urlencodedParser from '../utils/bodyParser';
import { sendAccountConfirmationEmail, sendInvitationEmail } from '../services/mailers';
import {
  validateSignUp,
  validateSignIn,
  validateInvite,
  validateConfirmationInvited,
  checkIsProperUpdateUserPayload,
} from '../validators/user';
import {
  API_USER_SIGN_UP,
  API_USER_SIGN_IN,
  API_USER_UPDATE,
  API_USER_DELETE,
  API_USER_IS_AUTHORIZED,
  API_USER_CONFIRM,
  API_USER_GET_CURRENT,
  API_USER_INVITE,
  API_USER_CONFIRM_INVITED,
} from '../constants/routes';
import {
  internalServerErrors,
  emailErrors,
  userErrors,
  passwordErrors,
  defaultErrors,
} from '../constants/errors';
import { accountSuccesses } from '../constants/successes';
import { EXPIRE_24_H } from '../constants/expirations';

@JsonController()
export class UserController {
  userRepository = getRepository(User);
  familyRepository = getRepository(Family);

  // @description: create user
  // @full route: /api/user/sign-up
  // @access: public
  @Post(API_USER_SIGN_UP)
  @UseBefore(urlencodedParser)
  async createUser(@Body() body: any, @Res() res: any) {
    const { email, password, firstName, lastName, gender, age } = body;
    const { isValid, errors } = validateSignUp(email, password, firstName, lastName, gender, age);

    if (!isValid) return res.status(400).json({ errors });

    try {
      const existingUser = await this.userRepository.find({ email });

      if (!isEmpty(existingUser))
        return res.status(400).json({ errors: { email: emailErrors.emailTaken } });

      const hashedPassword = await hash(password, 10);

      const token = Token.create({ email }, EXPIRE_24_H);

      const newUser = new User();

      await this.userRepository.save({
        ...newUser,
        password: hashedPassword,
        isVerified: false,
        isFamilyHead: false,
        hasFamily: false,
        firstName,
        lastName,
        email,
        gender,
        age,
      });

      // TODO: allow e-mails
      sendAccountConfirmationEmail(email, firstName, token);

      return res.status(200).json({ account: accountSuccesses.created });
    } catch (err) {
      return res.status(500).json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // @description: confirm user account
  // @full route: /api/user/confirm
  // @access: public
  @Post(API_USER_CONFIRM)
  @UseBefore(urlencodedParser)
  async confirmAccount(@Body() body: any, @Res() res: any) {
    const { confirmationAccountToken } = body;

    if (isEmpty(confirmationAccountToken))
      return res.status(400).json({ errors: { token: defaultErrors.isRequired } });

    try {
      const { email } = await Token.decode(confirmationAccountToken);

      const user = await this.userRepository.findOne({ email });

      if (isEmpty(user)) return res.status(400).json({ errors: { email: emailErrors.notExist } });

      await this.userRepository.save({ ...user, isVerified: true });

      return res.status(200).json({ account: accountSuccesses.confirmed });
    } catch (err) {
      return res.status(500).json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // @description: create user
  // @full route: /api/user/sign-in
  // @access: public
  @Post(API_USER_SIGN_IN)
  @UseBefore(urlencodedParser)
  async signInUser(@Body() body: any, @Res() res: any) {
    const { email, password } = body;
    const { isValid, errors } = validateSignIn(email, password);

    if (!isValid) return res.status(400).json({ errors });

    try {
      const user = await this.userRepository.findOne({ email });

      if (isEmpty(user)) return res.status(400).json({ errors: { email: emailErrors.notExist } });

      if (!user.isVerified)
        return res.status(400).json({ errors: { email: emailErrors.notVerified } });

      const isMatch = await compare(password, user.password);

      if (!isMatch) return res.status(400).json({ errors: { password: passwordErrors.notValid } });

      const token = Token.create({ email: user.email });

      return res.status(200).json({ isAuthorized: true, token });
    } catch (err) {
      return res.status(500).json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // @description: edit/update user
  // @full route /api/user/update
  // @access: private
  @Authorized()
  @Patch(API_USER_UPDATE)
  @UseBefore(urlencodedParser)
  async editUser(@Req() req: any, @Res() res: any) {
    try {
      if (isEmpty(req.body))
        return res.status(400).json({ errors: { payload: defaultErrors.emptyPayload } });

      const { email: emailDecoded } = await Token.decode(req.headers.authorization);

      if (!checkIsProperUpdateUserPayload(req.body))
        return res.status(400).json({ errors: { payload: defaultErrors.notAllowedValue } });

      const currentUser = await this.userRepository.findOne({ email: emailDecoded });

      const updatedUser = await this.userRepository.save({
        ...currentUser,
        ...req.body,
      });

      return res.status(200).json({ user: updatedUser });
    } catch (err) {
      return res.status(500).json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // @description: delete user
  // @full route: /api/usere/delete
  // @access: private
  @Authorized()
  @Delete(API_USER_DELETE)
  async deleteUser(@HeaderParam('authorization') token: string, @Res() res: any) {
    try {
      const { email: emailDecoded } = await Token.decode(token);

      const user = await this.userRepository.findOne(
        { email: emailDecoded },
        { relations: ['family'] }
      );

      const { family } = user;

      if (!isEmpty(family)) {
        const foundFamily = await this.familyRepository
          .createQueryBuilder('family')
          .leftJoinAndSelect('family.users', 'users')
          .where('family.id = :id', { id: family.id })
          // tslint:disable-next-line semicolon
          .getOne();

        if (get(foundFamily, 'users.length') === 1) {
          await this.userRepository.remove(user);

          await this.familyRepository.remove(foundFamily);

          return res.status(200).json({
            removedEmail: user.email,
            removedFamily: foundFamily.name,
          });
        }

        if (user.isFamilyHead)
          return res.status(400).json({ errors: { email: userErrors.familyHeadNotRemovable } });
      }

      await this.userRepository.remove(user);

      return res.status(200).json({
        removedEmail: user.email,
      });
    } catch (err) {
      return res.status(500).json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // @description: invite user
  // @full route: /api/user/invite
  // @access: private
  @Authorized()
  @Post(API_USER_INVITE)
  @UseBefore(urlencodedParser)
  async inviteUser(@Req() req: any, @Res() res: any) {
    try {
      const { email: emailDecoded } = await Token.decode(req.headers.authorization);

      const currentUser = await this.userRepository.findOne(
        { email: emailDecoded },
        { relations: ['family'] }
      );

      if (!currentUser.hasFamily)
        return res.status(400).json({
          errors: {
            email: userErrors.hasNoFamily,
          },
        });

      const { email, firstName, lastName, gender, age } = req.body;
      const { isValid, errors } = validateInvite(email, firstName, lastName, gender, age);

      const foundUser = await this.userRepository.findOne({ email });

      if (!isEmpty(foundUser))
        return res.status(400).json({ errors: { email: emailErrors.emailTaken } });

      if (!isValid) return res.status(400).json({ errors });

      const token = Token.create({ email }, EXPIRE_24_H);

      const newUser = new User();

      const createdUser = await this.userRepository.save({
        ...newUser,
        isVerified: false,
        isFamilyHead: false,
        hasFamily: true,
        firstName,
        lastName,
        email,
        gender,
        age,
      });

      const { id: familyId } = currentUser.family;
      const family = await this.familyRepository.findOne(
        { id: familyId },
        { relations: ['users'] }
      );

      family.users.push(createdUser);

      await this.familyRepository.save(family);

      // TODO: allow e-mails
      sendInvitationEmail(email, firstName, currentUser.firstName, family.name, token);

      return res.status(200).json({ account: accountSuccesses.invited });
    } catch (err) {
      return res.status(500).json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // @description: confirm invite user
  // @full route: /api/user/confirm-invited
  // @access: public
  @Post(API_USER_CONFIRM_INVITED)
  @UseBefore(urlencodedParser)
  async confirmInvitedUser(@Body() body: any, @Res() res: any) {
    const { password, invitationToken } = body;
    const { isValid, errors } = validateConfirmationInvited(password, invitationToken);

    if (!isValid) return res.status(400).json({ errors });

    try {
      const { email: emailDecoded } = await Token.decode(invitationToken);

      const user = await this.userRepository.findOne({ email: emailDecoded });

      if (isEmpty(user)) return res.status(404).json({ errors: { email: emailErrors.notExist } });

      const hashedPassword = await hash(password, 10);

      await this.userRepository.save({
        ...user,
        password: hashedPassword,
        isVerified: true,
      });

      return res.status(200).json({ account: accountSuccesses.confirmed });
    } catch (err) {
      return res.status(500).json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // @description: get current user
  // @full route: /api/user/current
  // @access: private
  @Authorized()
  @Get(API_USER_GET_CURRENT)
  async getCurrentUser(@HeaderParam('authorization') token: string, @Res() res: any) {
    const { email: emailDecoded } = await Token.decode(token);

    try {
      const user = await this.userRepository.findOne({ email: emailDecoded });

      const { id: userId, email, isFamilyHead, hasFamily, firstName, lastName, age, gender } = user;

      return res.status(200).json({
        currentUser: {
          userId,
          email,
          isFamilyHead,
          hasFamily,
          firstName,
          lastName,
          age,
          gender,
        },
      });
    } catch (err) {
      return res.status(500).json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // @description: check if user is authorize
  // @full route: /api/user/is-authorized
  // @access: private
  @Authorized()
  @Get(API_USER_IS_AUTHORIZED)
  isAuthorized(@Body() body: any, @Res() res: any) {
    return res.status(200).json({ isAuthorized: true });
  }
}
