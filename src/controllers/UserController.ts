import { JsonController, Body, Get, Post, Res, UseBefore, Authorized } from 'routing-controllers';
import { getRepository } from 'typeorm';
import { isEmpty } from 'lodash';
import { hash, compare } from 'bcryptjs';

import Token from './Token';
import { User } from '../entity/User';
import urlencodedParser from '../utils/bodyParser';
import sendAccountConfirmationRequest from '../services/mailers';
import { validateSignUp, validateSignIn } from '../validators/user';
import {
  API_SIGN_UP,
  API_SIGN_IN,
  API_IS_AUTHORIZED,
  API_CONFIRM_ACCOUNT,
} from '../constants/routes';
import {
  internalServerErrors,
  emailErrors,
  passwordErrors,
  defaultErrors,
} from '../constants/errors';
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

      const user = new User();

      const savedUser = await this.userRepository.save({
        ...user,
        password: hashedPassword,
        verificationAccountToken: token,
        isVerified: false,
        email,
        firstName,
        lastName,
      });

      sendAccountConfirmationRequest(email, firstName, token);

      return res.status(200).json(savedUser);
    } catch (err) {
      return res.status(400).json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // @description confirm user account
  // @full route: /api/user/confirm-account
  // @access public
  @Post(API_CONFIRM_ACCOUNT)
  @UseBefore(urlencodedParser)
  async confirmAccount(@Body() body: any, @Res() res: any) {
    const { verificationAccountToken } = body;

    if (isEmpty(verificationAccountToken))
      return res.status(400).json({ errors: { token: defaultErrors.isRequired } });

    const { email } = await Token.decode(verificationAccountToken);

    const user = await this.userRepository.findOne({ email });

    if (isEmpty(user)) return res.status(400).json({ errors: { email: emailErrors.notExist } });

    await this.userRepository.save({ ...user, isVerified: true, verificationAccountToken: null });

    return res.status(200).json({ user });
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

    return res.status(200).json({ user });
  }

  // @description check if user is authorize
  // @full route: /api/user/is-authorized
  // @access private
  @Authorized()
  @Get(API_IS_AUTHORIZED)
  tescik(@Body() body: any, @Res() res: any) {
    return res.status(200).json({ isAuthorized: true });
  }
}
