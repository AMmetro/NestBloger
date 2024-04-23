import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
// import { appConfig } from 'src/settings/appConfig';
import { appSettings } from 'src/settings/app-settings';
import { appConfigLocal } from 'src/settings/appConfig';

export type OutputUserType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  emailConfirmation: emailConfirmationType;
};

type emailConfirmationType = {
  confirmationCode: string;
  expirationDate: any;
  isConfirmed: boolean;
};

export type JWTDecodedType = {
  userId: string;
  deviceId: string;
  iat: number;
  exp: number;
};

export const jwtServise = {
  async createAccessTokenJWT(user: OutputUserType, deviceId: string) {
    throw new Error('Not implemented!!!');

    const token = jwt.sign(
      { userId: user.id, deviceId },
      // appConfig.JWT_ACSS_SECRET,
      appSettings.api.JWT_ACSS_SECRET,
      {
        expiresIn: '10m',
      },
    );
    return token;
    //     return {
    //       resultCode: 0,
    //       data: { token: token },
    //     };
  },

  async createRefreshTokenJWT(user: OutputUserType, deviceId: string) {
    const token: any = jwt.sign(
      { userId: user.id, deviceId },
      // appConfig.JWT_REFRESH_SECRET,
      appSettings.api.JWT_REFRESH_SECRET,
      {
        expiresIn: '20m',
      },
    );
    return token;
  },

  async getUserFromAcssesToken(token: string): Promise<JWTDecodedType | null> {
    try {
      const jwtUserData: any = jwt.verify(
        token,
        appConfigLocal.JWT_ACSS_SECRET_LOCAL,
        // appSettings.api.JWT_ACSS_SECRET,
        (err, decoded) => {
          if (err) {
            if (err.name === 'TokenExpiredError') {
              console.log('Access Token expired');
              return 'Access Token expired';
            } else {
              console.log('Access Token is broken');
              return 'Access Token is broken';
            }
          } else {
            return decoded;
          }
        },
      );
      return jwtUserData;
    } catch (e) {
      return null;
    }
  },

  async getUserFromRefreshToken(token: string): Promise<JWTDecodedType | null> {
    try {
      const result: any = jwt.verify(
        token,
        // appConfig.JWT_REFRESH_SECRET,
        appSettings.api.JWT_REFRESH_SECRET,
        (err, decoded) => {
          if (err) {
            if (err.name === 'TokenExpiredError') {
              console.log('Token expired');
              return 'Token expired';
            } else {
              console.log('Token is broken');
              return 'Token is broken';
            }
          } else {
            return decoded;
          }
        },
      );
      // const outUser = {userId: result.userId, deviceId: result.deviceId}
      return result;
    } catch (e) {
      return null;
    }
  },
};

export const hashServise = {
  async generateSalt() {
    const salt = await bcrypt.genSalt(10);
    return salt;
  },

  async generateHash(password: string, paswordSalt: string) {
    const hash = await bcrypt.hash(password, paswordSalt);
    return hash;
  },
};
