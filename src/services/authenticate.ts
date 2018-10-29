import { Action } from 'routing-controllers';
import { getRepository } from 'typeorm';
import { isEmpty } from 'lodash';

import { Token } from '../controllers';
import { User } from '../entity/User';

const authenticate = async (action: Action) => {
  const token = action.request.headers.authorization;

  const userRepository = getRepository(User);
  const { id } = await Token.decode(token);

  const user = await userRepository.findOne({ id });

  if (!isEmpty(user)) return true;

  return false;
};

export default authenticate;
