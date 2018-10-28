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
import { isEmpty } from 'lodash';

import { internalServerErrors, userErrors, familyErrors } from '../constants/errors';
import { accountSuccesses } from '../constants/successes';
import { API_TODOLIST_CREATE } from '../constants/routes';
import urlencodedParser from '../utils/bodyParser';
import {
  validateUserAssigningFamilyHead,
  validateUserToAssignFamilyHead,
} from '../validators/user';
import { Family, User } from '../entity';
import { Token } from '.';

@JsonController()
export class TodoListController {
  userRepository = getRepository(User);

  @Post(API_TODOLIST_CREATE)
  @UseBefore(urlencodedParser)
  @Authorized()
  async createTodoList(@Req() req: any, @Res() res: any) {}
}
