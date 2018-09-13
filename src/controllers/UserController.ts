import { JsonController, Body, Post, Res, UseBefore } from 'routing-controllers';
import { getRepository } from 'typeorm';

import { User } from '../entity/User';
import urlencodedParser from '../utils/bodyParser';
import { API_SIGN_UP } from '../constants/routes';
import { internalServerErrors } from '../constants/errors';

@JsonController()
export class UserController {
  // @create user
  // @full route: /api/sign-up
  // @access public
  @Post(API_SIGN_UP)
  @UseBefore(urlencodedParser)
  putSomething(@Body() body: any, @Res() res: any) {
    const userRepository = getRepository(User);

    const user = new User();
    user.email = body.email;
    user.password = body.password;
    user.firstName = body.firstName;
    user.lastName = body.lastName;

    return userRepository
      .save(user)
      .then(arg => res.status(200).json(arg))
      .catch(err => res.status(400).json({ error: internalServerErrors.sthWrong }));
  }
}
