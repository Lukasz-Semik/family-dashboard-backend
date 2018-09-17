import { JsonController, Body, Post, Res, UseBefore } from 'routing-controllers';
import { getRepository } from 'typeorm';
import { isEmpty } from 'lodash';
import { hash, compare } from 'bcryptjs';

import { User } from '../entity/User';
import urlencodedParser from '../utils/bodyParser';
import { API_SIGN_UP, API_SIGN_IN } from '../constants/routes';
import { internalServerErrors, emailErrors, passwordErrors } from '../constants/errors';
import { validateSignUp, validateSignIn } from '../validators/user';

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

      const user = new User();

      const savedUser = await this.userRepository.save({
        ...user,
        password: hashedPassword,
        email,
        firstName,
        lastName,
      });

      return res.status(200).json(savedUser);
    } catch (err) {
      return res.status(400).json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
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

    const isMatch = await compare(password, user.password);

    if (!isMatch) return res.status(400).json({ errors: { password: passwordErrors.notValid } });

    return res.status(200).json({ isAuthorized: true });
  }
}
