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

  @Post(API_CREATE_FAMILY)
  @UseBefore(urlencodedParser)
  @Authorized()
  async createFamily(@Req() req: any, @Res() res: any) {
    const { email } = await Token.decode(req.headers.authorization);

    const user = await this.userRepository.findOne({ email });

    if (user.hasFamily) return res.status(400).json({ errors: { email: emailErrors.hasFamily } });

    const newFamily = new Family();

    await this.familyRepository.save({
      ...newFamily,
      familyName: 'test-name',
      users: [user],
    });

    await this.userRepository.save({
      ...user,
      hasFamily: true,
    });

    return res.status(200).json({ done: 'done' });
  }

  @Get(API_GET_FAMILY)
  @UseBefore(urlencodedParser)
  @Authorized()
  async getFamily(@Req() req: any, @Res() res: any) {
    const { email } = await Token.decode(req.headers.authorization);

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.family', 'family')
      .where('user.email = :email', { email })
      .getOne();

    const family = await this.familyRepository
      .createQueryBuilder('family')
      .leftJoinAndSelect('family.users', 'users')
      .where('family.id = :id', { id: user.family.id })
      .getOne();

    return res.status(200).json({ user, family });
  }
}
