/* eslint-disable max-len */
import { getMockReq, getMockRes } from "@jest-mock/express";
import { Group, Permission } from "@prisma/client";
import { HTTP_STATUS_CODE } from "../enums/statusCodes";
import { AppError } from "../error";
import { GroupService } from "../services/groupService";
import { BaseGroupDTO } from "../types/groupDTO";
import {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  removeGroup,
  addUsersToGroup,
  getGroupUsers,
} from "./groups";

describe('Groups Controller', () => {
  const groupsList: Group[] = [
    {
      "id": 1,
      "name": "Developers",
      "permissions": [
        "READ",
        "WRITE"
      ]
    },
    {
      "id": 2,
      "name": "Testers",
      "permissions": [
        "READ"
      ]
    }
  ];

  describe('Get All Groups', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(GroupService.prototype, 'getAllGroups');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should get status code 200 and groups list in response', async () => {
      const req = getMockReq();
      const { res } = getMockRes();

      spy.mockImplementation(() => {
        return Promise.resolve(groupsList);
      });

      await getAllGroups(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
      expect(res.send).toHaveBeenCalledWith(groupsList);
    });

    it('should return empty array of groups if there is no groups in db', async () => {
      const req = getMockReq();
      const { res } = getMockRes();
      spy.mockImplementation(() => {
        return Promise.resolve([]);
      });
      await getAllGroups(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
      expect(res.send).toHaveBeenCalledWith([]);
    });
  });

  describe('Get Group By Id', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(GroupService.prototype, 'getGroupById');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should get group by id and get status code 200', async () => {
      const req = getMockReq({ params: { id: '1' } });
      const { res } = getMockRes();

      spy.mockImplementation((id) => {
        const group = groupsList.find(group => group.id === id);
        return Promise.resolve(group);
      });

      await getGroupById(req,res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
      expect(res.send).toHaveBeenCalledWith({
        "id": 1,
        "name": "Developers",
        "permissions": [
          "READ",
          "WRITE"
        ]
      });
    });

    it('should return error with 404 status code and message, if group not found', async () => {
      const req = getMockReq({ params: { id: 'non-existent-id' } });
      const { res } = getMockRes();

      spy.mockImplementation(() => {
        throw new AppError(HTTP_STATUS_CODE.NOT_FOUND, 'Not Found Error');
      });

      await getGroupById(req,res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not Found Error' });
    });
  });

  describe('Create Group', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(GroupService.prototype, 'createGroup');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should receive 201 status and successfully created group in response', async () => {
      const req = getMockReq(
        {
          body: {
            name: 'Admins',
            permissions: [
              Permission.READ,
              Permission.DELETE,
              Permission.SHARE,
              Permission.UPLOAD_FILES,
              Permission.WRITE,
            ]
          }
        }
      );
      const { res } = getMockRes();

      spy.mockImplementation((group: BaseGroupDTO) => {
        return Promise.resolve({
          id: 3,
          ...group,
        });
      });

      await createGroup(req, res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.CREATED);
      expect(res.send).toHaveBeenCalledWith({
        id: 3,
        name: 'Admins',
        permissions: [ 'READ', 'DELETE', 'SHARE', 'UPLOAD_FILES', 'WRITE' ],
      });
    });

    it('should return 400 bad request in case of prisma validation error', async () => {
      const req = getMockReq(
        {
          body: {
            name: 'Admins',
            permissions: [
              Permission.READ,
              Permission.DELETE,
              Permission.SHARE,
              Permission.UPLOAD_FILES,
              Permission.WRITE,
            ]
          }
        }
      );
      const { res } = getMockRes();

      spy.mockImplementation(() => {
        throw new AppError(HTTP_STATUS_CODE.BAD_REQUEST, 'Unique constraint failed on the fields: (`name`)');
      });

      await createGroup(req, res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unique constraint failed on the fields: (`name`)' });
    });

  });

  describe('Update Group', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(GroupService.prototype, 'updateGroup');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 200 status code and group in response', async () => {
      const req = getMockReq(
        {
          params: {
            id: '2',
          },
          body: {
            name: 'Testers',
            permissions: [ 'READ', 'WRITE' ]
          }
        });
      const { res } = getMockRes();

      spy.mockImplementation((group: BaseGroupDTO) => {
        return Promise.resolve({
          id: 2,
          ...group,
        });
      });

      await updateGroup(req, res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Group with 2 is updated',
        group:{
          id: 2,
          name: 'Testers',
          permissions: [ 'READ', 'WRITE' ],
        }
      });
    });

    it('should return error with 404 status code and message, if group not found', async () => {
      const req = getMockReq(
        {
          params: {
            id: 'non-existent-id',
          },
          body: {
            name: 'Testers',
            permissions: [ 'READ', 'WRITE' ]
          }
        });
      const { res } = getMockRes();

      spy.mockImplementation(() => {
        throw new AppError(HTTP_STATUS_CODE.NOT_FOUND, 'Not Found Error');
      });

      await updateGroup(req,res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not Found Error' });
    });

    it('should return 400 bad request in case of prisma validation error', async () => {
      const req = getMockReq(
        {
          params: {
            id: '3',
          },
          body: {
            name: 'Testers',
            permissions: [ 'READ', 'WRITE' ]
          }
        });
      const { res } = getMockRes();

      spy.mockImplementation(() => {
        throw new AppError(HTTP_STATUS_CODE.BAD_REQUEST, 'Unique constraint failed on the fields: (`name`)');
      });

      await updateGroup(req, res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unique constraint failed on the fields: (`name`)' });
    });

  });

  describe('Remove Group', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(GroupService.prototype, 'removeGroup');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return status code 200 and message about successful group removal', async () => {
      const req = getMockReq(
        {
          params: {
            id: '2',
          }
        }
      );
      const { res } = getMockRes();

      spy.mockImplementation((id) => {
        const group = groupsList.find(group => group.id === id);
        return Promise.resolve(group);
      });

      await removeGroup(req, res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
      expect(res.json).toHaveBeenCalledWith({ message: 'Group Testers was deleted' });
    });

    it('should return error with 404 status code and message, if group not found', async () => {
      const req = getMockReq(
        {
          params: {
            id: 'non-existent-id',
          },
        }
      );
      const { res } = getMockRes();

      spy.mockImplementation(() => {
        throw new AppError(HTTP_STATUS_CODE.NOT_FOUND, 'Not Found Error');
      });

      await removeGroup(req,res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not Found Error' });
    });

  });

  describe('Add Users To Group', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(GroupService.prototype, 'addUsersToGroup');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return status code 200 and updated group in response', async () => {
      const req = getMockReq(
        {
          params: {
            id: '2',
          },
          body: {
            members: [
              "23"
            ]
          }
        }
      );
      const { res } = getMockRes();

      spy.mockImplementation((id) => {
        const group = groupsList.find(group => group.id === id);

        return Promise.resolve(group);
      });

      await addUsersToGroup(req, res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
      expect(res.send).toHaveBeenCalledWith({
        id: 2,
        name: 'Testers',
        permissions: [ 'READ' ]
      });
    });

    it('should return error with 404 status code and message, if group not found', async () => {
      const req = getMockReq(
        {
          params: {
            id: 'non-existent-id',
          },
          body: {
            members: [
              "23"
            ]
          }
        }
      );
      const { res } = getMockRes();

      spy.mockImplementation(() => {
        throw new AppError(HTTP_STATUS_CODE.NOT_FOUND, 'Not Found Error');
      });

      await addUsersToGroup(req,res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not Found Error' });
    });

    it('should return error with 400 status code and message, if user doesn\'t exist', async () => {
      const req = getMockReq(
        {
          params: {
            id: '2',
          },
          body: {
            members: [
              "23123131"
            ]
          }
        }
      );
      const { res } = getMockRes();

      spy.mockImplementation(() => {
        throw new AppError(
          HTTP_STATUS_CODE.BAD_REQUEST,
          'Foreign key constraint failed on the field: `UsersOnGroups_userId_fkey (index)'
        );
      });

      await addUsersToGroup(req,res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Foreign key constraint failed on the field: `UsersOnGroups_userId_fkey (index)',
      });
    });

  });

  describe('Get Group Members', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(GroupService.prototype, 'getGroupMembers');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return status code 200 and updated group in response', async () => {
      const req = getMockReq(
        {
          params: {
            id: '2',
          },
        }
      );
      const { res } = getMockRes();

      const membersResp = {
        id: 2,
        members: [
          {
            "user": {
              "id": "893fd8ce-74f3-4578-a066-a02d62c68470",
              "login": "Daniel",
              "password": "c23VMvETTw",
              "age": 12,
              "isDeleted": false
            }
          },
          {
            "user": {
              "id": "bf2dc58e-f885-40aa-9ac5-1cd6f3105bfb",
              "login": "John",
              "password": "6u9tJC9vwD",
              "age": 23,
              "isDeleted": false
            }
          },
        ]
      };

      spy.mockImplementation(() => {
        const members = membersResp;

        return Promise.resolve(members);
      });

      await getGroupUsers(req, res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
      expect(res.send).toHaveBeenCalledWith(membersResp);
    });

    it('should return error with 404 status code and message, if group not found', async () => {
      const req = getMockReq(
        {
          params: {
            id: 'non-existent-id',
          },
        }
      );
      const { res } = getMockRes();

      spy.mockImplementation(() => {
        throw new AppError(HTTP_STATUS_CODE.NOT_FOUND, 'No Group found');
      });

      await getGroupUsers(req,res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'No Group found' });
    });

  });

});