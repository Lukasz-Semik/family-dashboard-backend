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
import { User, Family } from '../entity';
import { Token } from '.';

@JsonController()
export class ShoppingListController {
  userRepository = getRepository(User);
  familyRepository = getRepository(Family);

  familyWithShoppingListQuery = id =>
    this.familyRepository
      .createQueryBuilder('family')
      .leftJoinAndSelect('family.shoppingLists', 'shoppingLists')
      .where('family.id = :id', { id })
      // tslint:disable-next-line semicolon
      .getOne();

  getCurrentUser = async req => {
    const { id: idDecoded } = await Token.decode(req.headers.authorization);

    const user = await this.userRepository.findOne({ id: idDecoded }, { relations: ['family'] });

    return user;
    // tslint:disable-next-line semicolon
  };

  // @description: add shopping list
  // @full route: /api/shopping-lists
  // @access: private
  @Post(API_SHOPPING_LISTS)
  @UseBefore(urlencodedParser)
  @Authorized()
  async createShoppingList(@Req() req: any, @Res() res: any) {
    const { title, items } = req.body;
    console.log(req.body);

    if (isEmpty(title) || isEmpty(items))
      return res.status(RES_BAD_REQUEST).json({ errors: { title: defaultErrors.isRequired } });

    const user = await this.getCurrentUser(req);

    const { isValid, errors, status } = validateUserPermissions(user, {
      checkIsVerified: true,
      checkHasFamily: true,
    });

    if (!isValid) return res.status(status).json({ errors });

    const upcomingItems: string[] = items.filter(item => !item.isDone).map(item => item.name);

    const doneItems: string[] = items.filter(item => item.isDone).map(item => item.name);

    const family = await this.familyWithShoppingListQuery(user.family.id);

    console.log({ family, upcomingItems, doneItems });

    return res.status(200).json({ success: true });
  }
}
