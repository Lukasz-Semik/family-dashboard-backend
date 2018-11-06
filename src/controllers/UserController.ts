// TODO: reuse more
import {
  JsonController,
  UseBefore,
  Authorized,
  Body,
  Get,
  Post,
  Patch,
  Req,
  Delete,
  Res,
  HeaderParam,
} from 'routing-controllers';
import { getRepository } from 'typeorm';
import { isEmpty, get, includes } from 'lodash';
import { hash, compare } from 'bcryptjs';

import { Token } from '.';
import { User, Family } from '../entity';
import urlencodedParser from '../utils/bodyParser';
import {
  sendAccountConfirmationEmail,
  sendInvitationEmail,
  sendAddUserToFamilyEmail,
} from '../services/mailers';
import {
  validateSignUp,
  validateSignIn,
  validateInvite,
  validateConfirmationInvited,
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
  API_USER_RESEND_INVITATION,
  API_USER_CONFIRM_INVITED,
  API_USER_ADD_TO_FAMILY,
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
import { allowedUpdateUserPayloadKeys } from '../constants/allowedPayloadKeys';
import {
  RES_BAD_REQUEST,
  RES_CONFLICT,
  RES_SUCCESS,
  RES_INTERNAL_ERROR,
  RES_NOT_FOUND,
  RES_UNPROCESSABLE_ENTITY,
  RES_FORBIDDEN,
} from '../constants/resStatuses';
import { checkIsProperUpdatePayload } from '../helpers/validators';

@JsonController()
export class UserController {
  userRepository = getRepository(User);
  familyRepository = getRepository(Family);

  getCurrentUserWithFamily = async req => {
    const { id: idDecoded } = await Token.decode(req.headers.authorization);

    const currentUser = await this.userRepository.findOne(
      { id: idDecoded },
      { relations: ['family'] }
    );
    return currentUser;
    // tslint:disable-next-line semicolon
  };

  // @description: create user
  // @full route: /api/user/sign-up
  // @access: public
  @Post(API_USER_SIGN_UP)
  @UseBefore(urlencodedParser)
  async createUser(@Body() body: any, @Res() res: any) {
    const { email, password, firstName, lastName, gender, birthDate } = body;
    const { isValid, errors } = validateSignUp(
      email,
      password,
      firstName,
      lastName,
      gender,
      birthDate
    );

    if (!isValid) return res.status(RES_BAD_REQUEST).json({ errors });

    try {
      const existingUser = await this.userRepository.find({ email });

      if (!isEmpty(existingUser))
        return res.status(RES_CONFLICT).json({ errors: { email: emailErrors.emailTaken } });

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
        birthDate,
      });

      sendAccountConfirmationEmail(email, firstName, token);

      return res.status(RES_SUCCESS).json({ account: accountSuccesses.created });
    } catch (err) {
      return res
        .status(RES_INTERNAL_ERROR)
        .json({ error: internalServerErrors.sthWrong, caughtError: err });
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
      return res.status(RES_BAD_REQUEST).json({ errors: { token: defaultErrors.isRequired } });

    try {
      const { email } = await Token.decode(confirmationAccountToken);

      const user = await this.userRepository.findOne({ email });

      if (isEmpty(user))
        return res.status(RES_NOT_FOUND).json({ errors: { email: emailErrors.notExist } });

      await this.userRepository.save({ ...user, isVerified: true });

      return res.status(RES_SUCCESS).json({ account: accountSuccesses.confirmed });
    } catch (err) {
      return res
        .status(RES_INTERNAL_ERROR)
        .json({ error: internalServerErrors.sthWrong, caughtError: err });
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

    if (!isValid) return res.status(RES_BAD_REQUEST).json({ errors });

    try {
      const user = await this.userRepository.findOne({ email });

      if (isEmpty(user))
        return res.status(RES_NOT_FOUND).json({ errors: { email: emailErrors.notExist } });

      if (!user.isVerified)
        return res
          .status(RES_UNPROCESSABLE_ENTITY)
          .json({ errors: { email: emailErrors.notVerified } });

      const isMatch = await compare(password, user.password);

      if (!isMatch)
        return res.status(RES_BAD_REQUEST).json({ errors: { password: passwordErrors.notValid } });

      const token = Token.create({ email: user.email, id: user.id });

      return res.status(RES_SUCCESS).json({ isAuthorized: true, token });
    } catch (err) {
      return res
        .status(RES_INTERNAL_ERROR)
        .json({ error: internalServerErrors.sthWrong, caughtError: err });
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
      if (!checkIsProperUpdatePayload(req.body, allowedUpdateUserPayloadKeys))
        return res
          .status(RES_BAD_REQUEST)
          .json({ errors: { payload: defaultErrors.notAllowedValue } });

      const { id: idDecoded } = await Token.decode(req.headers.authorization);

      const currentUser = await this.userRepository.findOne({ id: idDecoded });

      if (isEmpty(currentUser))
        return res.status(RES_NOT_FOUND).json({ errors: { email: emailErrors.notExist } });

      const updatedUser = await this.userRepository.save({
        ...currentUser,
        ...req.body,
      });

      return res.status(RES_SUCCESS).json({ user: updatedUser });
    } catch (err) {
      return res
        .status(RES_INTERNAL_ERROR)
        .json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // @description: delete user
  // @full route: /api/usere/delete
  // @access: private
  @Authorized()
  @Delete(API_USER_DELETE)
  async deleteUser(@HeaderParam('authorization') token: string, @Res() res: any) {
    try {
      const { id: idDecoded } = await Token.decode(token);

      const user = await this.userRepository.findOne({ id: idDecoded }, { relations: ['family'] });

      if (isEmpty(user))
        return res.status(RES_NOT_FOUND).json({ errors: { email: emailErrors.notExist } });

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

          return res.status(RES_SUCCESS).json({
            removedEmail: user.email,
            removedFamily: foundFamily.name,
          });
        }

        if (user.isFamilyHead)
          return res
            .status(RES_UNPROCESSABLE_ENTITY)
            .json({ errors: { email: userErrors.familyHeadNotRemovable } });
      }

      await this.userRepository.remove(user);

      return res.status(RES_SUCCESS).json({
        removedEmail: user.email,
      });
    } catch (err) {
      return res
        .status(RES_INTERNAL_ERROR)
        .json({ error: internalServerErrors.sthWrong, caughtError: err });
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
      const currentUser = await this.getCurrentUserWithFamily(req);

      if (isEmpty(currentUser))
        return res.status(RES_NOT_FOUND).json({ errors: { email: emailErrors.notExist } });

      if (!currentUser.hasFamily)
        return res.status(RES_UNPROCESSABLE_ENTITY).json({
          errors: {
            email: userErrors.hasNoFamily,
          },
        });

      const { email, firstName, lastName, gender, birthDate } = req.body;
      const { isValid, errors } = validateInvite(email, firstName, lastName, gender, birthDate);

      const foundUser = await this.userRepository.findOne({ email });

      if (!isEmpty(foundUser))
        return res.status(RES_CONFLICT).json({ errors: { email: emailErrors.emailTaken } });

      if (!isValid) return res.status(RES_BAD_REQUEST).json({ errors });

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
        birthDate,
      });

      const { id: familyId } = currentUser.family;
      const family = await this.familyRepository.findOne(
        { id: familyId },
        { relations: ['users'] }
      );

      family.users.push(createdUser);

      await this.familyRepository.save(family);

      sendInvitationEmail(email, firstName, currentUser.firstName, family.name, token);

      return res.status(RES_SUCCESS).json({ account: accountSuccesses.invited });
    } catch (err) {
      return res
        .status(RES_INTERNAL_ERROR)
        .json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // @description: resend invitation user
  // @full route: /api/user/invite
  // @access: private
  @Authorized()
  @Post(API_USER_RESEND_INVITATION)
  @UseBefore(urlencodedParser)
  async resendInvitationUser(@Req() req: any, @Res() res: any) {
    try {
      if (isEmpty(req.body))
        return res.status(RES_BAD_REQUEST).json({ errors: { email: defaultErrors.isRequired } });

      const currentUser = await this.getCurrentUserWithFamily(req);

      if (isEmpty(currentUser))
        return res.status(RES_NOT_FOUND).json({ errors: { email: emailErrors.notExist } });

      if (!currentUser.hasFamily)
        return res.status(RES_UNPROCESSABLE_ENTITY).json({
          errors: {
            email: userErrors.hasNoFamily,
          },
        });

      const { email } = req.body;

      const foundUser = await this.userRepository.findOne({ email });

      if (isEmpty(foundUser))
        return res.status(RES_NOT_FOUND).json({ errors: { email: emailErrors.notExist } });

      if (foundUser.isVerified)
        return res
          .status(RES_UNPROCESSABLE_ENTITY)
          .json({ errors: { email: emailErrors.alreadyVerified } });

      const { id: familyId } = currentUser.family;

      const family = await this.familyRepository.findOne(
        { id: familyId },
        { relations: ['users'] }
      );

      if (!includes(family.users.map(user => Number(user.id)), Number(foundUser.id)))
        return res.status(RES_NOT_FOUND).json({ errors: { user: userErrors.notFromFamily } });

      const token = Token.create({ email }, EXPIRE_24_H);

      sendInvitationEmail(email, foundUser.firstName, currentUser.firstName, family.name, token);

      return res.status(RES_SUCCESS).json({ account: accountSuccesses.invited });
    } catch (err) {
      return res
        .status(RES_INTERNAL_ERROR)
        .json({ error: internalServerErrors.sthWrong, caughtError: err });
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

    if (!isValid) return res.status(RES_BAD_REQUEST).json({ errors });

    try {
      const { email: emailDecoded } = await Token.decode(invitationToken);

      const user = await this.userRepository.findOne({ email: emailDecoded });

      if (isEmpty(user))
        return res.status(RES_NOT_FOUND).json({ errors: { email: emailErrors.notExist } });

      const hashedPassword = await hash(password, 10);

      await this.userRepository.save({
        ...user,
        password: hashedPassword,
        isVerified: true,
      });

      return res.status(RES_SUCCESS).json({ account: accountSuccesses.confirmed });
    } catch (err) {
      return res
        .status(RES_INTERNAL_ERROR)
        .json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // TODO: add tests - due to make a refactor at first

  // @description: add existing user to family
  // @full route: /api/user/add-to-family
  // @access: public
  @Authorized()
  @Post(API_USER_ADD_TO_FAMILY)
  @UseBefore(urlencodedParser)
  async addUserToFamily(@Req() req: any, @Res() res: any) {
    try {
      if (isEmpty(req.body))
        return res.status(RES_BAD_REQUEST).json({ errors: { email: defaultErrors.isRequired } });

      const currentUser = await this.getCurrentUserWithFamily(req);

      if (isEmpty(currentUser))
        return res.status(RES_NOT_FOUND).json({ errors: { email: emailErrors.notExist } });

      if (!currentUser.hasFamily || !currentUser.isFamilyHead)
        return res.status(RES_FORBIDDEN).json({ errors: { user: userErrors.hasNoPermissions } });

      const { email } = req.body;

      const foundUser = await this.userRepository.findOne({ email });

      if (isEmpty(foundUser))
        return res.status(RES_NOT_FOUND).json({ errors: { email: emailErrors.notExist } });

      if (foundUser.hasFamily)
        return res.status(RES_CONFLICT).json({ errors: { user: userErrors.hasFamily } });

      if (!foundUser.isVerified)
        return res.status(RES_CONFLICT).json({ errors: { email: emailErrors.notVerified } });

      const token = Token.create({ email }, EXPIRE_24_H);

      sendAddUserToFamilyEmail(
        foundUser.email,
        foundUser.firstName,
        currentUser.firstName,
        currentUser.family.name,
        token
      );

      return res.status(RES_SUCCESS).json({ account: accountSuccesses.invited });
    } catch (err) {
      return res
        .status(RES_INTERNAL_ERROR)
        .json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // @description: get current user
  // @full route: /api/user/current
  // @access: private
  @Authorized()
  @Get(API_USER_GET_CURRENT)
  async getCurrentUser(@HeaderParam('authorization') token: string, @Res() res: any) {
    const { id: idDecoded } = await Token.decode(token);

    try {
      const user = await this.userRepository.findOne({ id: idDecoded });

      if (isEmpty(user))
        return res.status(RES_NOT_FOUND).json({ errors: { email: emailErrors.notExist } });

      const {
        id: userId,
        email,
        isFamilyHead,
        hasFamily,
        firstName,
        lastName,
        birthDate,
        gender,
      } = user;

      return res.status(RES_SUCCESS).json({
        currentUser: {
          userId,
          email,
          isFamilyHead,
          hasFamily,
          firstName,
          lastName,
          birthDate,
          gender,
        },
      });
    } catch (err) {
      return res
        .status(RES_INTERNAL_ERROR)
        .json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // @description: check if user is authorize
  // @full route: /api/user/is-authorized
  // @access: private
  @Authorized()
  @Get(API_USER_IS_AUTHORIZED)
  isAuthorized(@Body() body: any, @Res() res: any) {
    return res.status(RES_SUCCESS).json({ isAuthorized: true });
  }
}
