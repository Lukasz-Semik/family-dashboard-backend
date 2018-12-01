import {
  JsonController,
  UseBefore,
  Authorized,
  Get,
  Post,
  Patch,
  Delete,
  Req,
  Res,
} from 'routing-controllers';
import { getRepository } from 'typeorm';
import { isEmpty } from 'lodash';

import { RES_BAD_REQUEST } from '../constants/resStatuses';
import { internalServerErrors, defaultErrors } from '../constants/errors';
import urlencodedParser from '../utils/bodyParser';
import { validateUserPermissions } from '../validators/user';
import { API_SHOPPING_LISTS } from '../constants/routes';
import { User } from '../entity';
import { Token } from '.';

@JsonController()
export class ShoppingListController {
  userRepository = getRepository(User);

  getCurrentUser = async req => {
    const { id: idDecoded } = await Token.decode(req.headers.authorization);

    const user = await this.userRepository.findOne({ id: idDecoded }, { relations: ['family'] });

    return user;
    // tslint:disable-next-line semicolon
  };

  // @description: post todo
  // @full route: /api/todos
  // @access: private
  @Post(API_SHOPPING_LISTS)
  @UseBefore(urlencodedParser)
  @Authorized()
  async createShoppingList(@Req() req: any, @Res() res: any) {
    const { title } = req.body;

    if (isEmpty(title))
      return res.status(RES_BAD_REQUEST).json({ errors: { title: defaultErrors.isRequired } });

    const user = await this.getCurrentUser(req);

    const { isValid, errors, status } = validateUserPermissions(user, {
      checkIsVerified: true,
      checkHasFamily: true,
    });

    if (!isValid) return res.status(status).json({ errors });
  }
}
