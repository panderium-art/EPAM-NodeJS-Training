import { Service } from "typedi";
import { groupDAO } from "../dao/groupDao";
import { BaseGroupDTO, GroupDTO } from "../types/groupDTO";

@Service()
export class GroupService {
  constructor(
    private groupDAO: groupDAO
  ){}

  public async getAllGroups() {
    return this.groupDAO.findAll();
  }

  public async getGroupById(id: number) {
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