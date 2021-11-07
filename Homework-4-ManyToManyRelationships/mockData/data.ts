import { Permission } from '@prisma/client';

export const users = [
  {
    id: '893fd8ce-74f3-4578-a066-a02d62c68470',
    login: 'Daniel',
    password: 'c23VMvETTw',
    age: 12,
  },
  {
    id: 'bf2dc58e-f885-40aa-9ac5-1cd6f3105bfb',
    login: 'John',
    password: '6u9tJC9vwD',
    age: 23,
  },
];

export const groups = [
  {
    name: 'Developers',
    permissions: [Permission.READ, Permission.WRITE],
  },
  {
    name: 'Testers',
    permissions: [Permission.READ],
  }
];

export const membersOfGroups = [
  {
    userId: '893fd8ce-74f3-4578-a066-a02d62c68470',
    groupId: 1,
  },
  {
    userId: '893fd8ce-74f3-4578-a066-a02d62c68470',
    groupId: 2,
  },
  {
    userId: 'bf2dc58e-f885-40aa-9ac5-1cd6f3105bfb',
    groupId: 2,
  }
];