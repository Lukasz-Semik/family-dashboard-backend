import * as jwt from 'jsonwebtoken';

import { EXPIRE_2_WEEKS } from '../constants/expirations';

interface TokenPayloadTypes {
  id: number;
  email: string;
}

class Token {
  public static create(user: TokenPayloadTypes) {
    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_TOKEN, {
      expiresIn: EXPIRE_2_WEEKS,
      algorithm: 'HS256',
    });

    return token;
  }
}

export default Token;
