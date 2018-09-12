import { JsonController, Body, Get, Post, Req, Res, UseBefore } from 'routing-controllers';
import { getRepository } from 'typeorm';

import { User } from '../entity/User';
import urlencodedParser from '../utils/bodyParser';

@JsonController()
export class UserController {
  @Get('/hello')
  getAll(@Req() req: any, @Res() res: any) {
    return res.status(200).json({ hello: 'hello' });
  }

  @Post('/test')
  @UseBefore(urlencodedParser)
  putSomething(@Body() data: any, @Res() res: any) {
    const userRepository = getRepository(User);
    const user = new User();
    user.firstname = 'tescik';

    return userRepository
      .save(user)
      .then(arg => res.status(200).json(arg))
      .catch(err => console.log(err));
  }
}
