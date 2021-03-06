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
import { isEmpty, find, isArray } from 'lodash';

import {
  RES_SUCCESS,
  RES_BAD_REQUEST,
  RES_INTERNAL_ERROR,
  RES_NOT_FOUND,
  RES_CONFLICT,
} from '../constants/resStatuses';
import { internalServerErrors, defaultErrors, shoppingListErrors } from '../constants/errors';
import { API_SHOPPING_LISTS, API_SHOPPING_LIST } from '../constants/routes';
import { shoppingListsSuccesses } from '../constants/successes';
import { allowedUpadteShoppingListKeys } from '../constants/allowedPayloadKeys';
import { UserShortDataTypes, UserRoleDataTypes } from '../constants/sharedDataTypes';
import urlencodedParser, { jsonParser } from '../utils/bodyParser';
import { validateUserPermissions } from '../validators/user';
import { checkIsProperUpdatePayload } from '../helpers/validators';
import { familyItemWithAuthorExecutorUpdaterQuery } from '../helpers/dbQueries';
import { User, Family, ShoppingList } from '../entity';
import { Token } from '.';

const prepareShoppingList = shoppingList => ({
  ...shoppingList,
  items: JSON.parse(shoppingList.items),
});

const prepareShoppingLists = shoppingLists => shoppingLists.map(prepareShoppingList);

interface ShoppingListTypes {
  title: string;
  deadline?: string;
  items: string;
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
      .select(familyItemWithAuthorExecutorUpdaterQuery('shoppingLists'))
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

      if (isEmpty(title))
        return res.status(RES_BAD_REQUEST).json({ errors: { title: defaultErrors.isRequired } });

      const user = await this.getCurrentUser(req);

      const { isValid, errors, status } = validateUserPermissions(user, {
        checkIsVerified: true,
        checkHasFamily: true,
      });

      if (!isValid) return res.status(status).json({ errors });

      const upcomingItems: string[] = items.filter(item => !item.isDone);

      if (isEmpty(upcomingItems))
        return res
          .status(RES_BAD_REQUEST)
          .json({ errors: { items: shoppingListErrors.emptyUpcomingItems } });

      const family = await this.familyWithShoppingListQuery(user.family.id);

      const newShoppingList = new ShoppingList();

      const shoppingListData: ShoppingListTypes = {
        title,
        items: JSON.stringify(items),
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

      return res
        .status(RES_SUCCESS)
        .json({ shoppingLists: prepareShoppingLists(family.shoppingLists) });
    } catch (err) {
      return res
        .status(RES_INTERNAL_ERROR)
        .json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // @description: delete all shoppingLists
  // @full route: /api/shopping-lists
  // @access: private
  @Delete(API_SHOPPING_LISTS)
  @Authorized()
  async deleteAllFamilyShoppingLists(@Req() req: any, @Res() res: any) {
    try {
      const user = await this.getCurrentUser(req);

      const { isValid, errors, status } = validateUserPermissions(user, {
        checkIsVerified: true,
        checkHasFamily: true,
        checkIsFamilyHead: true,
      });

      if (!isValid) return res.status(status).json({ errors });

      const { shoppingLists } = await this.familyWithShoppingListQuery(user.family.id);

      if (isEmpty(shoppingLists))
        return res
          .status(RES_CONFLICT)
          .json({ errors: { shoppingLists: shoppingListErrors.alreadyEmpty } });

      const { id } = user.family;

      await this.shoppingListRepository
        .createQueryBuilder('shoppingLists')
        .leftJoinAndSelect('shoppingLists.family', 'family')
        .delete()
        .where('family.id = :id', { id })
        .execute();

      return res
        .status(RES_SUCCESS)
        .json({ shoppingLists: shoppingListsSuccesses.shoppingListsDeleted });
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

      const foundShoppingList = find(
        shoppingLists,
        shoppingList => shoppingList.id === Number(shoppingListId)
      );

      if (isEmpty(foundShoppingList))
        return res.status(RES_NOT_FOUND).json({ errors: { shoppingList: defaultErrors.notFound } });

      return res.status(RES_SUCCESS).json({ shoppingList: prepareShoppingList(foundShoppingList) });
    } catch (err) {
      return res
        .status(RES_INTERNAL_ERROR)
        .json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // @description: update shoppingList
  // @full route: /api/shopping-list/:shoppingListId
  // @access: private
  @Patch(API_SHOPPING_LIST().base)
  @Authorized()
  @UseBefore(urlencodedParser)
  @UseBefore(jsonParser)
  async updateShoppingList(@Req() req: any, @Res() res: any) {
    try {
      const {
        body,
        params: { shoppingListId },
      } = req;

      if (!checkIsProperUpdatePayload(body, allowedUpadteShoppingListKeys))
        return res.status(400).json({ errors: { payload: defaultErrors.notAllowedValue } });

      const user = await this.getCurrentUser(req);

      const { isValid, errors, status } = validateUserPermissions(user, {
        checkIsVerified: true,
        checkHasFamily: true,
      });

      if (!isValid) return res.status(status).json({ errors });

      const { shoppingLists } = await this.familyWithShoppingListQuery(user.family.id);

      const foundShoppingList = find(
        shoppingLists,
        shoppingList => shoppingList.id === Number(shoppingListId)
      );

      if (isEmpty(foundShoppingList))
        return res.status(RES_NOT_FOUND).json({ errors: { shoppingList: defaultErrors.notFound } });

      const items = !isArray(body.items) ? [] : body.items;

      const upcomingItems: string[] = items.filter(item => !item.isDone);

      const isShoppingListDone = (!isEmpty(body.items) && isEmpty(upcomingItems)) || body.isDone;

      const payload = {
        ...body,
        isDone: isShoppingListDone,
      };

      if (!isEmpty(body.items)) payload.items = JSON.stringify(body.items);

      const userShortData: UserShortDataTypes = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      const userRoleData: UserRoleDataTypes = {
        updater: userShortData,
        executor: null,
      };

      if (isShoppingListDone) userRoleData.executor = userShortData;

      const updatedShoppingList = await this.shoppingListRepository.save({
        ...foundShoppingList,
        ...payload,
        ...userRoleData,
      });

      return res
        .status(RES_SUCCESS)
        .json({ updatedShoppingList: prepareShoppingList(updatedShoppingList) });
    } catch (err) {
      return res
        .status(RES_INTERNAL_ERROR)
        .json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // @description: delete todo
  // @full route: /api/todos/:todoId
  // @access: private
  @Delete(API_SHOPPING_LIST().base)
  @Authorized()
  async deleteShoppingList(@Req() req: any, @Res() res: any) {
    try {
      const user = await this.getCurrentUser(req);

      const { isValid, errors, status } = validateUserPermissions(user, {
        checkIsVerified: true,
        checkHasFamily: true,
      });

      if (!isValid) return res.status(status).json({ errors });

      const { shoppingLists } = await this.familyWithShoppingListQuery(user.family.id);

      const { shoppingListId } = req.params;

      const foundShoppingList = find(
        shoppingLists,
        shoppingList => shoppingList.id === Number(shoppingListId)
      );

      if (isEmpty(foundShoppingList))
        return res.status(RES_NOT_FOUND).json({ errors: { shoppingList: defaultErrors.notFound } });

      await this.shoppingListRepository.remove(foundShoppingList);

      return res.status(RES_SUCCESS).json({ shoppingList: prepareShoppingList(foundShoppingList) });
    } catch (err) {
      return res
        .status(RES_INTERNAL_ERROR)
        .json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }
}
