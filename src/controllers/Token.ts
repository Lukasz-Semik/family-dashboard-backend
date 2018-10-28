import * as jwt from 'jsonwebtoken';

import { EXPIRE_2_WEEKS } from '../constants/expirations';

interface TokenPayloadTypes {
  email: string;
  id?: number;
}

export class Token {
  public static create(user: TokenPayloadTypes, expiresIn = EXPIRE_2_WEEKS) {
    const payload: TokenPayloadTypes = {
      email: user.email,
    };

    if (user.id) payload.id = user.id;

    const token = jwt.sign(payload, process.env.JWT_TOKEN, {
      expiresIn,
      algorithm: 'HS256',
    });

    return token;
  }

  public static decode(
    token: string | string[] | number
  ): Promise<{
    email: string;
    id: number;
    iat: number;
    exp: number;
  }> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
        if (err) return reject(err);

        resolve(decoded);
      });
    });
  }
}
