import { plainToInstance } from 'class-transformer';
import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { NextFunction } from 'express';

export const validateBody = (DtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto: object = plainToInstance(DtoClass, req.body);
    const errors = await validate(dto);
    const messages: string[] = [];
    if (errors.length > 0) {
      for (let error of errors) {
        if (error.constraints) {
          const message = Object.values(error.constraints).join();
          messages.push(message);
        }
      }
      res.status(400).json({ message: messages });
      return;
    }
    next();
  };
};
