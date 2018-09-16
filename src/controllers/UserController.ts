import { JsonController, Body, Post, Res, UseBefore } from 'routing-controllers';
import { getRepository } from 'typeorm';
import { isEmpty } from 'lodash';

import { User } from '../entity/User';
import urlencodedParser from '../utils/bodyParser';
import { API_SIGN_UP } from '../constants/routes';
import { internalServerErrors, emailErrors } from '../constants/errors';
import { validateSignUp } from '../validators/user';

@JsonController()
export class UserController {
  userRepository = getRepository(User);

  // @create user
  // @full route: /api/sign-up
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

      const user = new User();

      const savedUser = await this.userRepository.save({
        ...user,
        email,
        password,
        firstName,
        lastName,
      });

      return res.status(200).json(savedUser);
    } catch (err) {
      return res.status(400).json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }
}
