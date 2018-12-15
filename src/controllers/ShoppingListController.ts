import { JsonController, UseBefore, Authorized, Get, Post, Req, Res } from 'routing-controllers';
import { getRepository } from 'typeorm';
import { isEmpty, find } from 'lodash';

import {
  RES_SUCCESS,
  RES_BAD_REQUEST,
  RES_INTERNAL_ERROR,
  RES_NOT_FOUND,
} from '../constants/resStatuses';
import { internalServerErrors, defaultErrors, shoppingListErrors } from '../constants/errors';
import urlencodedParser, { jsonParser } from '../utils/bodyParser';
import { validateUserPermissions } from '../validators/user';
import { API_SHOPPING_LISTS, API_SHOPPING_LIST } from '../constants/routes';
import { shoppingListsSuccesses } from '../constants/successes';
import { User, Family, ShoppingList } from '../entity';
import { Token } from '.';

interface ShoppingListTypes {
  title: string;
  deadline?: string;
  upcomingItems: string[];
  doneItems: string[];
}

@JsonController()
export class ShoppingListController {
  userRepository = getRepository(User);
  familyRepository = getRepository(Family);
  shoppingListRepository = getRepository(ShoppingList);

  familyWithShoppingListQuery = id =>
    this.familyRepository
      .createQueryBuilder('family')
      .leftJoin('family.shoppingLists', 'shoppingLists')
      .leftJoin('shoppingLists.author', 'author')
      .leftJoin('shoppingLists.executor', 'executor')
      .leftJoin('shoppingLists.updater', 'updater')
      .select([
        'family',
        'shoppingLists',
        'author.firstName',
        'author.lastName',
        'author.id',
        'executor.id',
        'executor.firstName',
        'executor.lastName',
        'updater.id',
        'updater.firstName',
        'updater.lastName',
      ])
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
  @UseBefore(jsonParser)
  @Authorized()
  async createShoppingList(@Req() req: any, @Res() res: any) {
    try {
      const { title, deadline, items } = req.body;

      console.log('body', req.body);
      if (isEmpty(title) || isEmpty(items))
        return res.status(RES_BAD_REQUEST).json({ errors: { payload: defaultErrors.isRequired } });

      const user = await this.getCurrentUser(req);

      const { isValid, errors, status } = validateUserPermissions(user, {
        checkIsVerified: true,
        checkHasFamily: true,
      });

      if (!isValid) return res.status(status).json({ errors });

      const upcomingItems: string[] = items.filter(item => !item.isDone).map(item => item.name);

      if (isEmpty(upcomingItems))
        return res
          .status(RES_BAD_REQUEST)
          .json({ errors: { payload: shoppingListErrors.emptyUpcomingItems } });

      const doneItems: string[] = items.filter(item => item.isDone).map(item => item.name);

      const family = await this.familyWithShoppingListQuery(user.family.id);

      const newShoppingList = new ShoppingList();

      const shoppingListData: ShoppingListTypes = {
        title,
        upcomingItems,
        doneItems,
      };

      if (!isEmpty(deadline)) shoppingListData.deadline = deadline;

      const shoppingList = await this.shoppingListRepository.save({
        ...newShoppingList,
        ...shoppingListData,
        isDone: false,
        author: user,
      });

      family.shoppingLists.push(shoppingList);

      await this.familyRepository.save(family);

      return res.status(200).json({ shoppingList: shoppingListsSuccesses.shoppingListCreated });
    } catch (err) {
      return res
        .status(RES_INTERNAL_ERROR)
        .json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // @description: get shopping lists
  // @full route: /api/shopping-lists
  // @access: private
  @Get(API_SHOPPING_LISTS)
  @Authorized()
  async getShoppingLists(@Req() req: any, @Res() res: any) {
    try {
      const user = await this.getCurrentUser(req);

      const { isValid, errors, status } = validateUserPermissions(user, {
        checkIsVerified: true,
        checkHasFamily: true,
      });

      if (!isValid) return res.status(status).json({ errors });

      const family = await this.familyWithShoppingListQuery(user.family.id);

      return res.status(RES_SUCCESS).json({ shoppingLists: family.shoppingLists });
    } catch (err) {
      return res
        .status(RES_INTERNAL_ERROR)
        .json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // @description: get specific shopping list
  // @full route: /api/shopping-list/:shoppingListId
  // @access: private
  @Get(API_SHOPPING_LIST().base)
  @Authorized()
  async getShoppingList(@Req() req: any, @Res() res: any) {
    try {
      const user = await this.getCurrentUser(req);

      const { isValid, errors, status } = validateUserPermissions(user, {
        checkIsVerified: true,
        checkHasFamily: true,
      });

      if (!isValid) return res.status(status).json({ errors });

      const { shoppingLists } = await this.familyWithShoppingListQuery(user.family.id);

      const { shoppingListId } = req.params;

      const foundShoppingList = find(shoppingLists, todo => todo.id === Number(shoppingListId));

      if (isEmpty(foundShoppingList))
        return res.status(RES_NOT_FOUND).json({ errors: { shoppingList: defaultErrors.notFound } });

      return res.status(RES_SUCCESS).json({ shoppingList: foundShoppingList });
    } catch (err) {
      return res
        .status(RES_INTERNAL_ERROR)
        .json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }
}
