import 'reflect-metadata';
import { Service } from 'typedi';
import { userDAO } from "../dao/userDao";
import { BaseUserDTO, UserDTO } from "../types/userDTO";
import { UserFilter } from "../types/filters";

@Service()
export class UserService {
  constructor(
        private userDAO: userDAO
  ){}

  public async getUsers(filters: UserFilter) {
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
