/* eslint-disable prefer-rest-params */
import 'reflect-metadata';
import { Service } from 'typedi';
import { UserDAO } from "../dao/userDao";
import { BaseUserDTO, UserDTO } from "../types/userDTO";
import { UserFilter } from "../types/filters";
import { AppError } from '../error';
import { HTTP_STATUS_CODE } from '../enums/statusCodes';

@Service()
export class UserService {
  constructor(
        private userDAO: UserDAO,
  ){}

  public async getUsers(filters: UserFilter) {
    if(filters.limit && isNaN(Number(filters.limit))) {
      throw new AppError(
        HTTP_STATUS_CODE.BAD_REQUEST,
        'Limit parameter should be a number'
      );
    }
    return this.userDAO.findAll(filters);
  }

  public async getUserById(id: string) {
    return this.userDAO.findById(id);
  }

  public async createUser(user: BaseUserDTO) {
    return this.userDAO.create(user);
  }

  public async updateUser(user: UserDTO) {
    return this.userDAO.update(user);
  }

  public async removeUser(id: string) {
    return this.userDAO.remove(id);
  }
}
