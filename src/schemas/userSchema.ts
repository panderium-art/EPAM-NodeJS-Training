import * as Joi from "joi";
import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

const reqBodySchema = Joi.object({
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

interface IRequestBodySchema extends ValidatedRequestSchema {
    [ContainerTypes.Body]: {
        login: string,
        password: string,
        age: number,
    }
}

export {
  reqBodySchema,
  IRequestBodySchema
};
