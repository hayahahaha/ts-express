import * as bcrypt from 'bcrypt';
import * as express from 'express';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middleware/validation.middleware';
import CreateUserDto from '../users/user.dto';
import User from '../users/user.entity';
import logInDto from './logIn.dto';
import { AppDataSource } from '../data-source';
import LoginDto from './logIn.dto';
import { TokenData, DataStoredInToken } from './token.interface'
import * as jwt from 'jsonwebtoken';

export default class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private userRepository = AppDataSource.getRepository(User);

  constructor() {
    this.initializeRouters()
  }

  private initializeRouters() {
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
    this.router.post(`${this.path}/login`, validationMiddleware(logInDto), this.loggingIn);
  }

  private createToken(user: User) {
    const expiresIn = 60 * 60 * 24 * 265;
    const secret = process.env.JWT_SECRET || '124';
    const dataStoredInToken: DataStoredInToken = {
      id: user.id
    }

    return ({
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn })
    })
  }

  private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const data: LoginDto = request.body;
    const user = await this.userRepository.findOneBy({
      email: data.email
    });
    if (!user) {
      return response.send({
        message: 'User exist!'
      })
    }
    const isPasswordMatching = await bcrypt.compare(data.password, user.password);

    if (!isPasswordMatching) {
      return response.send({
        message: 'Password error!'
      })
    }

    const token = this.createToken(user)


    return response.send({
      user: user,
      token: token
    })

  }

  private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const userData: CreateUserDto = request.body;
    const user = await this.userRepository.findOneBy({ email: userData.email });
    if (user) {
      return response.send({
        message: 'User exist'
      });
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userResponse = this.userRepository.create({
      ...userData,
      password: hashedPassword
    })
    this.userRepository.save(userResponse);
    return response.send(userResponse);

  }

  private loggingOut = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    response.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
    response.send(200);
  }

}
