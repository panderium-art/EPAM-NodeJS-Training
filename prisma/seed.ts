import { PrismaClient } from '@prisma/client';
import { groups, users, membersOfGroups } from '../mockData/data';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: users,
  });

  await prisma.group.createMany({
    data: groups,
  });

  await prisma.usersOnGroups.createMany({
    data: membersOfGroups
  });

  const allUsers = await prisma.user.findMany({
    include: { groups: { include: { group: true } } }
  });
  const result = allUsers.map(user => {
    return { ...user, groups: user.groups.map(group => group.group) };
  });

  console.log(JSON.stringify(result, null, '\t'));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
