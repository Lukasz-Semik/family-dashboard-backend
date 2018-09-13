import { JsonController, Body, Post, Res, UseBefore } from 'routing-controllers';
import { getRepository } from 'typeorm';

import { User } from '../entity/User';
import urlencodedParser from '../utils/bodyParser';
import { API_SIGN_UP } from '../constants/routes';
import { internalServerErrors } from '../constants/errors';
import { validateSignIn } from '../validators/user';

@JsonController()
export class UserController {
  userRepository = getRepository(User);

  // @create user
  // @full route: /api/sign-up
  // @access public
  @Post(API_SIGN_UP)
  @UseBefore(urlencodedParser)
  putSomething(@Body() body: any, @Res() res: any) {
    const { email, password, firstName, lastName } = body;
    const { isValid, errors } = validateSignIn(email, password);

    if (!isValid) return res.status(400).json({ errors });

    const user = new User();
    user.email = email;
    user.password = password;
    user.firstName = firstName;
    user.lastName = lastName;

    return this.userRepository
      .save(user)
      .then(arg => res.status(200).json(arg))
      .catch(err => res.status(400).json({ error: internalServerErrors.sthWrong }));
  }
}
