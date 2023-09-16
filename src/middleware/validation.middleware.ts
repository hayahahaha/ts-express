import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import * as express from 'express';
import HttpException from '../exceptions/HttpException';

function validationMiddleware<T>(type: any, skipMissingProperties = false): express.RequestHandler {
  return (req, res, next) => {
    validate(plainToClass(type, req.body), { skipMissingProperties })
      .then((errors: ValidationError[]) => {
        if (errors.length > 0) {
          console.log('error:', errors);
          const message = errors.map((error: ValidationError) => {
            return Object.values(error.constraints);
          }).join(', ');
          next(new HttpException(400, message));
        } else {
          console.log('hellow world')
          next();
        }
      })
  }
}

export default validationMiddleware;
