import { Service } from "typedi";
import type { BaseGroupDTO, GroupDTO } from "../types/groupDTO";
import prisma from "../client";
import { prismaErrorHandler } from '../helpers/errorHelper';

@Service()
export class groupDAO {
  public async findAll(){
    try {
      const groups = await prisma.group.findMany({ orderBy: {
        id: 'asc',
      }, });
      return groups;
    } catch (error: any) {
      const processedPrismaError = prismaErrorHandler(error);
      throw processedPrismaError;
    }

  }

  public async findById(id: number){
    try {
      const group = await prisma.group.findUnique({
        where:{
          id,
        },
      });
      return group;
    } catch (error: any) {
      const processedPrismaError = prismaErrorHandler(error);
      throw processedPrismaError;
    }
  }

  public async create(group: BaseGroupDTO){
    try {
      const { name, permissions } = group;
      const createdGroup = await prisma.group.create({
        data: {
          name,
          permissions
        }
      });
      return createdGroup;
    } catch (error: any) {
      const processedPrismaError = prismaErrorHandler(error);
      throw processedPrismaError;
    }
  }

  public async update({ id, name, permissions }: GroupDTO) {
    try {
      const group = await prisma.group.update({
        where: { id },
        data: { name, permissions }
      });
      return group;
    } catch (error: any) {
      const processedPrismaError = prismaErrorHandler(error);
      throw processedPrismaError;
    }
  }

  public async remove(id: number) {
    try {
      const group = await prisma.group.delete({
        where: {
          id,
        },
      });
      return group;
    } catch (error: any) {
      const processedPrismaError = prismaErrorHandler(error);
      throw processedPrismaError;
    }
  }

  public async getGroupMembers(groupId: number) {
    try {
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
    } catch (error: any) {
      const processedPrismaError = prismaErrorHandler(error);
      throw processedPrismaError;
    }
  }

  public async addMembersToGroup(groupId: number, members: string []) {
    try {
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
    } catch (error: any) {
      const processedPrismaError = prismaErrorHandler(error);
      throw processedPrismaError;
    }
  }
}
