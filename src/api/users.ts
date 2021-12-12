import express, { Request, Response } from 'express';
import {
  ValidatedRequest,
  createValidator
} from 'express-joi-validation';
import { Container } from "typedi";
import { IRequestBodySchema, reqBodySchema } from "../schemas/userSchema";
import { UserService } from "../services/userService";
import { BaseUserDTO, UserDTO } from "../types/userDTO";
import { UserFilter } from "../types/filters";
import Logger from '../config/winstonLogger';
import { HTTP_STATUS_CODE } from '../enums/statusCodes';
import { createErrorString } from '../helpers/loggingHelper';

export const usersRouter = express.Router();
const validator = createValidator({ passError: true });
const userService = Container.get(UserService);

const getUsers = async (req: Request, res: Response) => {
  try {
    const filters: UserFilter = req.query;
    const users = await userService.getUsers(filters);
    res.status(HTTP_STATUS_CODE.OK).send(users);
  } catch (error: any) {
    Logger.error(createErrorString(error.message, 'getUsers', req));
    res.status(error.status).json({ message: error.message });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    res.status(HTTP_STATUS_CODE.OK).send(user);
  } catch (error: any) {
    Logger.error(createErrorString(error.message, 'getUserById', req));
    res.status(error.status)
      .json({ message: error.message });
  }
};

const createUser = async (
  req: ValidatedRequest<IRequestBodySchema>,
  res: Response,
) => {
  try {
    const userDTO = req.body as BaseUserDTO;
    const user = await userService.createUser(userDTO);

    res.status(HTTP_STATUS_CODE.CREATED).json(user);
  } catch (error: any) {
    Logger.error(createErrorString(error.message, 'createUser', req));
    res.status(error.status).json({ message: error.message });
  }
};

const updateUser = async (
  req: ValidatedRequest<IRequestBodySchema>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { login, password, age } = req.body;
    const userDTO: UserDTO = {
      id,
      login,
      password,
      age,
    };
    const user = await userService.updateUser(userDTO);
    res.status(HTTP_STATUS_CODE.OK).send({ message: `User ${id} was updated`, user });
  } catch (error: any) {
    Logger.error(createErrorString(error.message, 'updateUser', req));
    res.status(error.status).json({ message: error.message });
  }
};

const removeUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const removedUserId = await userService.removeUser(id);

    res.status(HTTP_STATUS_CODE.OK)
      .send({ message: `User ${removedUserId} is soft deleted` });
  } catch (error: any) {
    Logger.error(createErrorString(error.message, 'removeUser', req));
    res.status(error.status).json({ message: error.message });
  }
};

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUserById);
usersRouter.post('/', validator.body(reqBodySchema) , createUser);
usersRouter.put('/:id', validator.body(reqBodySchema), updateUser);
usersRouter.delete('/:id', removeUser);
