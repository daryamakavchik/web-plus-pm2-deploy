import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IRequest } from '../types/index';
import BadRequestError from '../errors/bad-request-err';
import UnauthorizedError from '../errors/unauthorized-err';
import NotFoundError from '../errors/not-found-err';
import ConflictError from '../errors/conflict-err';
import { STATUS_500, STATUS_11000, SECRET_KEY } from '../utils/constants';
import User, { IUser } from '../models/user';

const bcrypt = require('bcrypt');

interface IError extends Error {
  statusCode?: number
}

export const getAllUsers = (req: Request, res: Response): void => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(STATUS_500).send({ message: 'Произошла ошибка на сервере' }));
};

export const createUser = (req: IRequest, res: Response, next: NextFunction): void => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash: string | number) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user: IUser) => res.send({ data: user }))
    .catch((err: IError) => {
      if (err.name === 'BadRequestError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.name === 'ConflictError' || err.statusCode === STATUS_11000) {
        throw next(new ConflictError('Пользователь с таким email уже существует'));
      }
      next(err);
    });
};

export const findUserById = (req: Request, res: Response, next: NextFunction): void => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw next(new NotFoundError('Пользователь по указанному id не найден'));
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Неверный формат id'));
      } else {
        next(err);
      }
    });
};

export const getUserInfo = (req: IRequest, res: Response, next: NextFunction): void => {
  User.findById(req.user!._id)
    .orFail(() => {
      throw next(new NotFoundError('Пользователь по указанному id не найден'));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Неверный формат id'));
      }
      next(err);
    });
};

export const updateUserInfo = (req: IRequest, res: Response, next: NextFunction): void => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user?._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => {
      throw next(new NotFoundError('Пользователь по указанному id не найден'));
    })
    .then((user) => {
      if (user !== null) {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'BadRequestError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

export const updateUserAvatar = (req: IRequest, res: Response, next: NextFunction): void => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user?._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => {
      throw next(new NotFoundError('Пользователь по заданному id не найден'));
    })
    .then((user) => {
      if (user !== null) {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'BadRequestError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(err);
      }
    });
};

export const login = (req: IRequest, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        SECRET_KEY,
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      if (err.name === 'BadRequestError') {
        next(new BadRequestError('Оба поля должны быть заполнены'));
      } else {
        next(new UnauthorizedError('Передан неккоректный email'));
      }
      next(err);
    });
};
