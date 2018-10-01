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

import { internalServerErrors, emailErrors } from '../constants/errors';
import { API_CREATE_FAMILY, API_GET_FAMILY } from '../constants/routes';
import urlencodedParser from '../utils/bodyParser';
import { Family, User } from '../entity';
import { Token } from '.';

@JsonController()
export class FamilyController {
  familyWithUserQuery = (id, familyRepository) =>
    familyRepository
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

  // @description create family
  // @full route: /api/family/create
  // @access private
  @Post(API_CREATE_FAMILY)
  @UseBefore(urlencodedParser)
  @Authorized()
  async createFamily(@Req() req: any, @Res() res: any) {
    try {
      const userRepository = getRepository(User);
      const familyRepository = getRepository(Family);

      const { email } = await Token.decode(req.headers.authorization);

      const user = await userRepository.findOne({ email });

      if (user.hasFamily) return res.status(400).json({ errors: { email: emailErrors.hasFamily } });

      const newFamily = new Family();

      const { familyName } = req.body;

      const name = isEmpty(familyName) ? user.lastName : familyName;

      const createdFamily = await familyRepository.save({
        ...newFamily,
        users: [user],
        name,
      });

      await userRepository.save({
        ...user,
        isFamilyHead: true,
        hasFamily: true,
      });

      const family = await this.familyWithUserQuery(createdFamily.id, familyRepository);

      return res.status(200).json({ family });
    } catch (err) {
      return res.status(400).json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }

  // @description get family
  // @full route: /api/family/current
  // @access private
  @Get(API_GET_FAMILY)
  @UseBefore(urlencodedParser)
  @Authorized()
  async getFamily(@HeaderParam('authorization') token: string, @Res() res: any) {
    try {
      const familyRepository = getRepository(Family);
      const userRepository = getRepository(User);

      const { email } = await Token.decode(token);

      const user = await userRepository.findOne({ email }, { relations: ['family'] });

      if (!user.hasFamily || isEmpty(user.family))
        return res.status(400).json({ errors: { email: emailErrors.hasNoFamily } });

      const family = await this.familyWithUserQuery(user.family.id, familyRepository);

      return res.status(200).json({ family });
    } catch (err) {
      return res.status(400).json({ error: internalServerErrors.sthWrong, caughtError: err });
    }
  }
}
