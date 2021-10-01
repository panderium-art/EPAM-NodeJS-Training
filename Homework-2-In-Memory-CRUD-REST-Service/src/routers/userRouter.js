import express from 'express';
import Joi from 'joi';
import { createValidator } from 'express-joi-validation';
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from '../controllers/userController.js';

const schema = Joi.object({
    login: Joi.string()
        .alphanum()
        .trim()
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'))
        .required(),
    age: Joi.number()
        .integer()
        .min(4)
        .max(130)
        .required()
});

const validator = createValidator({ passError: true });

export const usersRouter = express.Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUserById);
usersRouter.post('/', validator.body(schema), createUser);
usersRouter.put('/:id', validator.body(schema),  updateUser);
usersRouter.delete('/:id', deleteUser);
