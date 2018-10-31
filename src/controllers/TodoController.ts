import {
  JsonController,
  Get,
  Post,
  Patch,
  Res,
  UseBefore,
  Authorized,
  HeaderParam,
  Req,
} from 'routing-controllers';
import { getRepository } from 'typeorm';
import { isEmpty, find } from 'lodash';

import { internalServerErrors, userErrors, defaultErrors } from '../constants/errors';
import { todosSuccesses } from '../constants/successes';
import { API_TODOS, API_TODO } from '../constants/routes';
import urlencodedParser from '../utils/bodyParser';
import { Family, User, Todo } from '../entity';
import { Token } from '.';

interface TodoDataTypes {
  title: string;
  description?: string;
  deadline?: string;
}

@JsonController()
export class TodoController {
  userRepository = getRepository(User);
  todoRepository = getRepository(Todo);
  familyRepository = getRepository(Family);

  familyWithTodosQuery = id =>
    this.familyRepository
      .createQueryBuilder('family')
      .leftJoin('family.todos', 'todos')
      .leftJoin('todos.author', 'author')
      .leftJoin('todos.executor', 'executor')
      .leftJoin('todos.updater', 'updater')
      .select([
        'family',
        'todos',
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

  getCurrentUser = async (req, res) => {
    const { id: idDecoded } = await Token.decode(req.headers.authorization);

    const user = await this.userRepository.findOne({ id: idDecoded }, { relations: ['family'] });

    if (!user.isVerified || !user.hasFamily) return null;

    return user;
    // tslint:disable-next-line semicolon
  };

  @Post(API_TODOS)
  @UseBefore(urlencodedParser)
  @Authorized()
  async createTodo(@Req() req: any, @Res() res: any) {
    try {
      const { title, description, deadline } = req.body;

      if (isEmpty(title))
        return res.status(400).json({ errors: { title: defaultErrors.isRequired } });

      const user = await this.getCurrentUser(req, res);

      if (!user) return res.status(400).json({ errors: { user: userErrors.hasNoPermissions } });

      const todoData: TodoDataTypes = {
        title,
      };

      if (!isEmpty(description)) todoData.description = description;

      if (!isEmpty(deadline)) todoData.deadline = deadline;

      const newTodo = new Todo();

      const todo = await this.todoRepository.save({
        ...newTodo,
        ...todoData,
        author: user,
        isDone: false,
      });

      const family = await this.familyWithTodosQuery(user.family.id);

      family.todos.push(todo);

      await this.familyRepository.save(family);

      return res.status(200).json({ todos: todosSuccesses.todoCreated });
    } catch (err) {
      return res.status(500).json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  @Get(API_TODOS)
  @Authorized()
  async getTodos(@Req() req: any, @Res() res: any) {
    try {
      const user = await this.getCurrentUser(req, res);

      if (!user) return res.status(400).json({ errors: { user: userErrors.hasNoPermissions } });

      const family = await this.familyWithTodosQuery(user.family.id);

      return res.status(200).json({ todos: family.todos });
    } catch (err) {
      return res.status(500).json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  @Get(API_TODO().base)
  @Authorized()
  async getTodo(@Req() req: any, @Res() res: any) {
    const user = await this.getCurrentUser(req, res);

    if (!user) return res.status(400).json({ errors: { user: userErrors.hasNoPermissions } });

    const { todos } = await this.familyWithTodosQuery(user.family.id);

    const { todoId } = req.params;

    const foundTodos = find(todos, todo => todo.id === Number(todoId));

    if (isEmpty(foundTodos))
      return res.status(404).json({ errors: { todos: defaultErrors.notFound } });

    return res.status(200).json({ todos: foundTodos });
  }

  @Patch(API_TODO().base)
  @Authorized()
  async updateTodo(@Req() req: any, @Res() res: any) {
    // TODO: check payload
    const user = await this.getCurrentUser(req, res);

    const { todos } = await this.familyWithTodosQuery(user.family.id);

    const { todoId } = req.params;

    const foundTodos = find(todos, todo => todo.id === Number(todoId));
  }
}
