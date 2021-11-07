-- DropForeignKey
ALTER TABLE "UsersOnGroups" DROP CONSTRAINT "UsersOnGroups_groupId_fkey";

-- DropForeignKey
ALTER TABLE "UsersOnGroups" DROP CONSTRAINT "UsersOnGroups_userId_fkey";

-- AddForeignKey
ALTER TABLE "UsersOnGroups" ADD CONSTRAINT "UsersOnGroups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOnGroups" ADD CONSTRAINT "UsersOnGroups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
