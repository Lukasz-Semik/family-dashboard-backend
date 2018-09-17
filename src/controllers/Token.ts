import * as jwt from 'jsonwebtoken';

import { EXPIRE_2_WEEKS } from '../constants/expirations';

interface TokenPayloadTypes {
  email: string;
}

class Token {
  public static create(user: TokenPayloadTypes) {
    const payload = {
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_TOKEN, {
      expiresIn: EXPIRE_2_WEEKS,
      algorithm: 'HS256',
    });

    return token;
  }

  public static decode(
    token: string | string[] | number
  ): Promise<{
    email: string;
  }> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
        if (err) return reject(err);

        resolve(decoded);
      });
    });
  }
}

export default Token;
