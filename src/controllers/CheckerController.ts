import { JsonController, Body, Get, Post, Req, Res, UseBefore } from 'routing-controllers';

import urlencodedParser from '../utils/bodyParser';

@JsonController()
export class UserController {
  @Get('/hello')
  getAll(@Req() req: any, @Res() res: any) {
    return res.status(200).json({ hello: 'hello' });
  }

  @Post('/test')
  @UseBefore(urlencodedParser)
  post(@Body() req: any, @Res() res: any) {
    console.log(req);
    return res.status(200).json({ dd: 'd' });
  }
}
