import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ errorFormat: 'minimal', rejectOnNotFound: true });

export default prisma;
