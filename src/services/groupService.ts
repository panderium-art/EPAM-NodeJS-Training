import 'reflect-metadata';
import { Service } from "typedi";
import { GroupDAO } from "../dao/groupDao";
import { BaseGroupDTO, GroupDTO } from "../types/groupDTO";
import { AppError } from '../error';
import { HTTP_STATUS_CODE } from '../enums/statusCodes';

@Service()
export class GroupService {
  constructor(
    private groupDAO: GroupDAO
  ){}

  public async getAllGroups() {
    return this.groupDAO.findAll();
  }

  public async getGroupById(id: number) {
    if (isNaN(id)) {
      throw new AppError(
        HTTP_STATUS_CODE.BAD_REQUEST,
        'Argument id: Got invalid value NaN, should be number'
      );
    }
    return this.groupDAO.findById(id);
  }

  public async createGroup(group: BaseGroupDTO) {
    return this.groupDAO.create(group);
  }

  public async updateGroup(group: GroupDTO) {
    return this.groupDAO.update(group);
  }

  public async removeGroup(id: number) {
    return this.groupDAO.remove(id);
  }

  public async getGroupMembers(groupId: number) {
    return this.groupDAO.getGroupMembers(groupId);
  }

  public async addUsersToGroup(groupId: number, userIds: string[]) {
    return this.groupDAO.addMembersToGroup(groupId, userIds);
  }
}
