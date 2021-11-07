import { PrismaClient } from ".prisma/client";

export const prismaSoftDeteleMiddleware = async (prisma: PrismaClient) => {
  prisma.$use(async (params, next) => {
    if (params.model == 'User') {
      if (params.action == 'delete') {
        params.action = 'update';
        params.args['data'] = { isDeleted: true };
      }
      if (params.action == 'deleteMany') {
        params.action = 'updateMany';
        if (params.args.data != undefined) {
          params.args.data['isDeleted'] = true;
        } else {
          params.args['data'] = { isDeleted: true };
        }
      }
    }
    return next(params);
  });
};