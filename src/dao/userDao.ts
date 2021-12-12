import prisma from '../client';
import { User } from '@prisma/client';
import { Service } from "typedi";
import { BaseUserDTO, UserDTO } from "../types/userDTO";
import { UserFilter } from "../types/filters";
import { prismaSoftDeteleMiddleware } from '../middlewares/prismaSoftDelete';
import { prismaErrorHandler } from '../helpers/errorHelper';

interface IUserDao {
    findById: (id: string) => Promise<User | undefined>;
    findAll: (filters: UserFilter) => Promise<User[] | undefined>;
    create: (user:BaseUserDTO) => Promise<User>;
    update: (user: UserDTO) => Promise<User | undefined>;
    remove: (id: string) => Promise<string | undefined>;
}

prismaSoftDeteleMiddleware(prisma);
@Service()
export class userDAO implements IUserDao {

  public async findAll(filters:UserFilter) {
    try {
      const users = await prisma.user.findMany({
        orderBy: {
          login: 'asc',
        },
        ...(filters.loginSubstring
          ? {
            where: {
              login: {
                contains: filters.loginSubstring,
              }
            }
          } : {}),
        ...(filters.limit
          ? {
            take: parseInt(filters.limit, 10)
          } : {})

      });
      return users;
    } catch (error: any) {
      const processedPrismaError = prismaErrorHandler(error);
      throw processedPrismaError;
    }
  }

  public async findById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        }
      });
      return user;
    } catch (error: any) {
      const processedPrismaError = prismaErrorHandler(error);
      throw processedPrismaError;
    }
  }

  public async create({ login, password, age }: BaseUserDTO) {
    try {
      const user = await prisma.user.create({
        data: {
          login,
          password,
          age,
        }
      });
      return user;
    } catch (error: any) {
      const processedPrismaError = prismaErrorHandler(error);
      throw processedPrismaError;
    }
  }

  public async update({ id, login, password, age }: UserDTO) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: { login, password, age },
      });
      return user;
    } catch (error: any) {
      const processedPrismaError = prismaErrorHandler(error);
      throw processedPrismaError;
    }
  }

  public async remove(id: string){
    try {
      const user = await prisma.user.delete({
        where: {
          id,
        },
      });
      return user.id;
    } catch (error: any) {
      const processedPrismaError = prismaErrorHandler(error);
      throw processedPrismaError;
    }
  }
}
