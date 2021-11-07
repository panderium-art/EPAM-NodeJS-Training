import { PrismaClient, User } from '@prisma/client';
import { Service } from "typedi";
import { BaseUserDTO, UserDTO } from "../types/userDTO";
import { UserFilter } from "../types/filters";
import { prismaSoftDeteleMiddleware } from '../middlewares/prismaSoftDelete';

interface IUserDao {
    findById: (id: number) => Promise<User|null>;
    findAll: (filters: UserFilter) => Promise<User[]>;
    create: (user:BaseUserDTO) => Promise<User>;
    update: (user: UserDTO) => Promise<User|null>;
    remove: (id: number) => Promise<number|null>;
}

const prisma = new PrismaClient();
prismaSoftDeteleMiddleware(prisma);
@Service()
export class userDAO implements IUserDao {

    public async findAll(filters:UserFilter) {
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
    }

    public async findById(id: number) {
      return prisma.user.findUnique({
        where: {
            id,
        }
      });
    }

    public async create({ login, password, age }: BaseUserDTO) {
      const user = await prisma.user.create({
          data: {
              login,
              password,
              age,
          }
      });
      return user;
    }

    public async update({ id, login, password, age }: UserDTO) {
      const user = await prisma.user.update({
          where: { id },
          data: { login, password, age },
      });
      return user;
    }

    public async remove(id: number){
      const user =  await prisma.user.delete({
          where: {
              id,
          },
      });
      return user.id;
    }
}
