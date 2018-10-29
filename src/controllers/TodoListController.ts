import {
  JsonController,
  Get,
  Post,
  Res,
  UseBefore,
  Authorized,
  HeaderParam,
  Req,
} from 'routing-controllers';
import { getRepository } from 'typeorm';
import { isEmpty } from 'lodash';

import { internalServerErrors, userErrors, defaultErrors } from '../constants/errors';
import { todoListSuccesses } from '../constants/successes';
import { API_TODOLISTS } from '../constants/routes';
import urlencodedParser from '../utils/bodyParser';
import { Family, User, TodoList } from '../entity';
import { Token } from '.';

interface TodoListDataTypes {
  title: string;
  description?: string;
  deadline?: string;
}

@JsonController()
export class TodoListController {
  userRepository = getRepository(User);
  todoListRepository = getRepository(TodoList);
  familyRepository = getRepository(Family);

  familyWithTodoListsQuery = id =>
    this.familyRepository
      .createQueryBuilder('family')
      .leftJoin('family.todoLists', 'todoLists')
      .leftJoin('todoLists.author', 'author')
      .select(['todoLists', 'family.name', 'author.firstName', 'author.lastName', 'author.id'])
      .where('family.id = :id', { id })
      // tslint:disable-next-line semicolon
      .getOne();

  @Post(API_TODOLISTS)
  @UseBefore(urlencodedParser)
  @Authorized()
  async createTodoList(@Req() req: any, @Res() res: any) {
    try {
      const { title, description, deadline } = req.body;

      if (isEmpty(title))
        return res.status(400).json({ errors: { title: defaultErrors.isRequired } });

      const { id: idDecoded } = await Token.decode(req.headers.authorization);

      const user = await this.userRepository.findOne({ id: idDecoded }, { relations: ['family'] });

      if (!user.isVerified || !user.hasFamily)
        return res.status(400).json({ errors: { user: userErrors.hasNoPermissions } });

      const todoListData: TodoListDataTypes = {
        title,
      };

      if (!isEmpty(description)) todoListData.description = description;

      if (!isEmpty(deadline)) todoListData.deadline = deadline;

      const newTodoList = new TodoList();

      const todoList = await this.todoListRepository.save({
        ...newTodoList,
        ...todoListData,
        author: user,
        isDone: false,
      });

      const family = await this.familyWithTodoListsQuery(user.family.id);

      family.todoLists.push(todoList);

      await this.familyRepository.save(family);

      return res.status(200).json({ todoList: todoListSuccesses.todoListCreated });
    } catch (err) {
      return res.status(500).json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  @Get(API_TODOLISTS)
  @Authorized()
  async getTodoLists(@HeaderParam('authorization') token: string, @Res() res: any) {
    try {
      const { id: idDecoded } = await Token.decode(token);

      const user = await this.userRepository.findOne({ id: idDecoded }, { relations: ['family'] });

      if (!user.isVerified || !user.hasFamily)
        return res.status(400).json({ errors: { user: userErrors.hasNoPermissions } });

      const family = await this.familyWithTodoListsQuery(user.family.id);

      return res.status(200).json({ todoLists: family.todoLists });
    } catch (err) {
      return res.status(500).json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }
}
