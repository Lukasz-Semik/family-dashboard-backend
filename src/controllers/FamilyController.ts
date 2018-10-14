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

import {
  internalServerErrors,
  emailErrors,
  familyErrors,
  defaultErrors,
} from '../constants/errors';
import { API_FAMILY_CREATE, API_FAMILY_GET, API_FAMILY_ASSIGN_HEAD } from '../constants/routes';
import urlencodedParser from '../utils/bodyParser';
import { Family, User } from '../entity';
import { Token } from '.';

@JsonController()
export class FamilyController {
  familyRepository = getRepository(Family);
  userRepository = getRepository(User);
  minFamilySizeToAssignHead = 2;

  familyWithUserQuery = id =>
    this.familyRepository
      .createQueryBuilder('family')
      .leftJoin('family.users', 'users')
      .select([
        'family',
        'users.id',
        'users.firstName',
        'users.lastName',
        'users.isFamilyHead',
        'users.isVerified',
      ])
      .where('family.id = :id', { id })
      // tslint:disable-next-line semicolon
      .getOne();

  // @description: create family
  // @full route: /api/family/create
  // @access: private
  @Post(API_FAMILY_CREATE)
  @UseBefore(urlencodedParser)
  @Authorized()
  async createFamily(@Req() req: any, @Res() res: any) {
    try {
      const { email } = await Token.decode(req.headers.authorization);

      const user = await this.userRepository.findOne({ email });

      if (user.hasFamily) return res.status(400).json({ errors: { email: emailErrors.hasFamily } });

      const newFamily = new Family();

      const { familyName } = req.body;

      const name = isEmpty(familyName) ? user.lastName : familyName;

      const createdFamily = await this.familyRepository.save({
        ...newFamily,
        users: [user],
        name,
      });

      await this.userRepository.save({
        ...user,
        isFamilyHead: true,
        hasFamily: true,
      });

      const family = await this.familyWithUserQuery(createdFamily.id);

      return res.status(200).json({ family });
    } catch (err) {
      return res.status(500).json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // @description: get family
  // @full route: /api/family/current
  // @access: private
  @Get(API_FAMILY_GET)
  @UseBefore(urlencodedParser)
  @Authorized()
  async getFamily(@HeaderParam('authorization') token: string, @Res() res: any) {
    try {
      const { email } = await Token.decode(token);

      const user = await this.userRepository.findOne({ email }, { relations: ['family'] });

      if (!user.hasFamily || isEmpty(user.family))
        return res.status(400).json({ errors: { email: emailErrors.hasNoFamily } });

      const family = await this.familyWithUserQuery(user.family.id);

      return res.status(200).json({ family });
    } catch (err) {
      return res.status(500).json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // @description: post family
  // @full route: /api/family/head-assign
  // @access: private
  @Post(API_FAMILY_ASSIGN_HEAD)
  @UseBefore(urlencodedParser)
  @Authorized()
  async assignFamilyHead(@Req() req: any, @Res() res: any) {
    try {
      const { email } = await Token.decode(req.headers.token);

      const user = await this.userRepository.findOne({ email }, { relations: ['family'] });

      if (!user.hasFamily || isEmpty(user.family))
        return res.status(400).json({ errors: { email: emailErrors.hasNoFamily } });

      const { users } = await this.familyWithUserQuery(user.family.id);
      // if empty users!!
      if (users.length < this.minFamilySizeToAssignHead)
        return res.status(400).json({ errors: { family: familyErrors.tooSmall } });

      const { id: userToAssignId } = req.body;

      if (isEmpty(userToAssignId))
        return res.status(400).json({
          error: { payload: defaultErrors.isRequired },
        });
    } catch (err) {
      return res.status(500).json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }
}
