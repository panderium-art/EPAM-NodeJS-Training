import express, { Request, Response, NextFunction } from 'express';
import {
    ValidatedRequest,
    createValidator
} from 'express-joi-validation';
import { Container } from "typedi";
import { IRequestBodySchema, reqBodySchema } from "../schemas/userSchema";
import { UserService } from "../services/userService";
import { BaseUserDTO, UserDTO } from "../types/userDTO";
import { UserFilter } from "../types/filters";

export const usersRouter = express.Router();
const validator = createValidator({ passError: true });
const userService = Container.get(UserService);

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters: UserFilter = req.query;
    const users = await userService.getUsers(filters);
    res.status(200).send(users);
  } catch (error: any) {
    next(error);
  }
};

const getUserById = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(Number(id));

    if (!user) {
        return res.status(404).send({ error: `User ${id} not found!` });
    }

    res.status(200).send(user);
  } catch (error: any) {
    next(error);
  }
    
};

const createUser = async (
  req: ValidatedRequest<IRequestBodySchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userDTO = req.body as BaseUserDTO;
    const user = await userService.createUser(userDTO);

    res.status(201).json(user);
  } catch (error: any) {
    next(error);
  }
};

const updateUser = async (
  req: ValidatedRequest<IRequestBodySchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { login, password, age } = req.body;
    const userDTO: UserDTO = {
        id: Number(id),
        login,
        password,
        age,
    };
    const user = await userService.updateUser(userDTO);
    if(!user) {
        return res.status(404).send({ error: `User ${id} is not found!` });
    }

    res.status(200).send({ message: `User ${id} was updated`, user });
  } catch (error: any) {
    next(error);
  }
};

const removeUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const removedUserId = await userService.removeUser(Number(id));

    if (!removedUserId) {
        return res.status(404).send({ error: `User ${id} is not found!` });
    }

    res.status(200).send({ message: `User ${removedUserId} is soft deleted` });
  } catch (error: any) {
    next(error);
  }  
};

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUserById);
usersRouter.post('/', validator.body(reqBodySchema) , createUser);
usersRouter.put('/:id', validator.body(reqBodySchema), updateUser);
usersRouter.delete('/:id', removeUser);
