import { PrismaClient } from ".prisma/client";
import { Service } from "typedi";
import type { BaseGroupDTO, GroupDTO } from "../types/groupDTO";

const prisma = new PrismaClient();

@Service()
export class groupDAO {
  public async findAll(){
    const groups = await prisma.group.findMany({ orderBy: {
      id: 'asc',
    }, });
    return groups;
  }

  public async findById(id: number){
    return prisma.group.findUnique({
      where:{
        id,
      },
    });
  }

  public async create(group: BaseGroupDTO){
    const { name, permissions } = group;
    const createdGroup = await prisma.group.create({
      data: {
        name,
        permissions
      }
    });
    return createdGroup;
  }

  public async update({ id, name, permissions }: GroupDTO) {
    const group = await prisma.group.update({
      where: { id },
      data: { name, permissions }
    });
    return group;
  }

  public async remove(id: number) {
    const group = await prisma.group.delete({
      where: {
        id,
      },
    });
    return group;
  }

  public async getGroupMembers(groupId: number) {
    const members = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        id: true,
        members: {
          select: {
            user: true,
          }
        }
      }
    });

    return members;
  }

  public async addMembersToGroup(groupId: number, members: string []) {
    const updatedGroup = await prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        members : {
          create: members.map(userId => ({ userId }))
        }
      }
    });

    return updatedGroup;
  }
}
