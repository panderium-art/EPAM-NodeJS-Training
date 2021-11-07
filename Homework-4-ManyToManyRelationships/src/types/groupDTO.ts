import type { Permission } from '@prisma/client';

export type BaseGroupDTO = {
  name: string;
  permissions: Permission[];
}

export type GroupDTO = BaseGroupDTO & { id: number }
