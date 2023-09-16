import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import RequestWithUser from 'interfaces/requestWithUser.interface';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import { DataStoredInToken } from 'authentication/token.interface';
import User from '../users/user.entity';
import { AppDataSource } from '../data-source';

async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
  const cookies = request.cookies;
  console.log('cookies:', cookies);
  const userRepository = AppDataSource.getRepository(User);
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
      console.log('verificationResponse: ', verificationResponse)
      const id = verificationResponse.id
      const user = await userRepository.findOneBy({ id });
      if (user) {
        request.user = user;
        next()
      } else {
        next(new WrongCredentialsException())
      }
    } catch (error) {
      next(new WrongCredentialsException())
    }
  } else {
    next(new AuthenticationTokenMissingException())
  }
}

export default authMiddleware;
