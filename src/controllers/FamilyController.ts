import {
  JsonController,
  Body,
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
  passwordErrors,
  defaultErrors,
} from '../constants/errors';
import { API_CREATE_FAMILY, API_GET_FAMILY } from '../constants/routes';
import urlencodedParser from '../utils/bodyParser';
import { Family, User } from '../entity';
import { Token } from '.';

@JsonController()
export class FamilyController {
  familyRepository = getRepository(Family);
  userRepository = getRepository(User);

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

  @Post(API_CREATE_FAMILY)
  @UseBefore(urlencodedParser)
  @Authorized()
  async createFamily(@Req() req: any, @Res() res: any) {
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
  }

  @Get(API_GET_FAMILY)
  @UseBefore(urlencodedParser)
  @Authorized()
  async getFamily(@HeaderParam('authorization') token: string, @Res() res: any) {
    const { email } = await Token.decode(token);

    const user = await this.userRepository.findOne({ email }, { relations: ['family'] });

    if (!user.hasFamily || isEmpty(user.family))
      return res.status(400).json({ errors: { email: emailErrors.hasNoFamily } });

    const family = await this.familyWithUserQuery(user.family.id);

    return res.status(200).json({ family });
  }
}
