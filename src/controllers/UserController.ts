import {
  JsonController,
  Body,
  Get,
  Post,
  Res,
  UseBefore,
  Authorized,
  HeaderParam,
} from 'routing-controllers';
import { getRepository } from 'typeorm';
import { isEmpty } from 'lodash';
import { hash, compare } from 'bcryptjs';

import Token from './Token';
import { User } from '../entity';
import urlencodedParser from '../utils/bodyParser';
import sendAccountConfirmationRequest from '../services/mailers';
import { validateSignUp, validateSignIn } from '../validators/user';
import {
  API_SIGN_UP,
  API_SIGN_IN,
  API_IS_AUTHORIZED,
  API_CONFIRM_ACCOUNT,
  API_GET_CURRENT_USER,
} from '../constants/routes';
import {
  internalServerErrors,
  emailErrors,
  passwordErrors,
  defaultErrors,
} from '../constants/errors';
import { accountSuccesses } from '../constants/successes';
import { EXPIRE_24_H } from '../constants/expirations';

@JsonController()
export class UserController {
  userRepository = getRepository(User);

  // @description create user
  // @full route: /api/user/sign-up
  // @access public
  @Post(API_SIGN_UP)
  @UseBefore(urlencodedParser)
  async createUser(@Body() body: any, @Res() res: any) {
    const { email, password, firstName, lastName } = body;
    const { isValid, errors } = validateSignUp(email, password, firstName, lastName);

    try {
      const existingUser = await this.userRepository.find({ email });
      if (!isEmpty(existingUser))
        return res.status(400).json({ errors: { email: emailErrors.emailTaken } });

      if (!isValid) return res.status(400).json({ errors });

      const hashedPassword = await hash(password, 10);

      const token = Token.create({ email }, EXPIRE_24_H);

      const newUser = new User();

      await this.userRepository.save({
        ...newUser,
        password: hashedPassword,
        confirmationAccountToken: token,
        isVerified: false,
        isFamilyHead: false,
        hasFamily: false,
        firstName,
        lastName,
        email,
      });

      // sendAccountConfirmationRequest(email, firstName, token);

      return res.status(200).json({ account: accountSuccesses.created });
    } catch (err) {
      return res.status(400).json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // TODO: THINK ABOUT AND EVENTUALLY MOVE TOKEN TO HEADERS!
  // @description confirm user account
  // @full route: /api/user/confirm-account
  // @access public
  @Post(API_CONFIRM_ACCOUNT)
  @UseBefore(urlencodedParser)
  async confirmAccount(@Body() body: any, @Res() res: any) {
    const { confirmationAccountToken } = body;

    if (isEmpty(confirmationAccountToken))
      return res.status(400).json({ errors: { token: defaultErrors.isRequired } });

    const { email } = await Token.decode(confirmationAccountToken);

    const user = await this.userRepository.findOne({ email });

    if (isEmpty(user)) return res.status(400).json({ errors: { email: emailErrors.notExist } });

    await this.userRepository.save({ ...user, isVerified: true, confirmationAccountToken: null });

    return res.status(200).json({ account: accountSuccesses.confirmed });
  }

  // @description create user
  // @full route: /api/user/sign-in
  // @access public
  @Post(API_SIGN_IN)
  @UseBefore(urlencodedParser)
  async signInUser(@Body() body: any, @Res() res: any) {
    const { email, password } = body;
    const { isValid, errors } = validateSignIn(email, password);

    if (!isValid) return res.status(400).json({ errors });

    const user = await this.userRepository.findOne({ email });

    if (isEmpty(user)) return res.status(400).json({ errors: { email: emailErrors.notExist } });

    if (!user.isVerified)
      return res.status(400).json({ errors: { email: emailErrors.notVerified } });

    const isMatch = await compare(password, user.password);

    if (!isMatch) return res.status(400).json({ errors: { password: passwordErrors.notValid } });

    const token = Token.create({ email: user.email });

    user.token = token;

    await this.userRepository.save(user);

    return res.status(200).json({ isAuthorized: true, token });
  }

  // @description get current user
  // @full route: /api/user/get-current-user
  // @access private
  @Authorized()
  @Get(API_GET_CURRENT_USER)
  async getCurrentUser(@HeaderParam('authorization') token: string, @Res() res: any) {
    const { email: emailDecoded } = await Token.decode(token);

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
  }

  // @description check if user is authorize
  // @full route: /api/user/is-authorized
  // @access private
  @Authorized()
  @Get(API_IS_AUTHORIZED)
  isAuthorized(@Body() body: any, @Res() res: any) {
    return res.status(200).json({ isAuthorized: true });
  }
}
