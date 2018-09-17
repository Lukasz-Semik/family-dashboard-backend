import { Action } from 'routing-controllers';
import { getRepository } from 'typeorm';
import { isEmpty } from 'lodash';

import Token from '../controllers/Token';
import { User } from '../entity/User';

const authenticate = async (action: Action, roles: string[]) => {
  const token = action.request.headers.authorization;

  const userRepository = getRepository(User);
  const { email } = await Token.decode(token);

  const user = await userRepository.findOne({ email });

  if (!isEmpty(user)) return true;

  return false;
};

export default authenticate;
