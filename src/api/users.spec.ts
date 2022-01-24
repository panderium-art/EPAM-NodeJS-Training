/* eslint-disable max-len */
import { HTTP_STATUS_CODE } from '../enums/statusCodes';
import { getUsers, getUserById, createUser, updateUser, removeUser } from './users';
import { getMockReq, getMockRes } from '@jest-mock/express';
import { User } from '@prisma/client';
import { UserService } from '../services/userService';
import { AppError } from '../error';
import { BaseUserDTO } from '../types/userDTO';


describe('User Controller', () => {
  const usersList: User[] = [
    {
      "id": "3336c1fb-9635-4b65-90d1-e4cf87f4f6a2",
      "login": "Adah",
      "password": "9qmrz39b",
      "age": 62,
      "isDeleted": false
    },
    {
      "id": "893fd8ce-74f3-4578-a066-a02d62c68470",
      "login": "Daniel",
      "password": "c23VMvETTw",
      "age": 12,
      "isDeleted": false
    },
  ];


  describe('Get Users', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(UserService.prototype, 'getUsers');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should get users if they exists in db', async () => {
      const req = getMockReq();
      const { res } = getMockRes();
      spy.mockImplementation(() => {
        return Promise.resolve(usersList);
      });
      await getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
      expect(res.send).toHaveBeenCalledWith(usersList);
    });

    it('should return empty array of user if there is no users in db', async () => {
      const req = getMockReq();
      const { res } = getMockRes();
      spy.mockImplementation(() => {
        return Promise.resolve([]);
      });
      await getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
      expect(res.send).toHaveBeenCalledWith([]);
    });

    it('should get appropriate filtered user', async () => {
      const req = getMockReq({ query: { loginSubstring: 'ad' } });
      const { res } = getMockRes();
      spy.mockImplementation((filters) => {
        const filteredUserList = usersList.
          filter(item => {
            if(filters.loginSubstring) {
              return item.login.toLowerCase().includes(filters.loginSubstring);
            }
          });
        return Promise.resolve(filteredUserList);
      });
      await getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
      expect(res.send).toHaveBeenCalledWith([usersList[0]]);
    });

    it('should get an error if wrong filter was passed', async () => {
      const req = getMockReq({ query: { limit: 'asdzxc' } });
      const { res } = getMockRes();
      spy.mockImplementation(() => {
        throw new AppError(
          HTTP_STATUS_CODE.BAD_REQUEST,
          'Limit parameter should be a number'
        );
      });
      await getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.BAD_REQUEST);
      expect(res.json)
        .toHaveBeenCalledWith({ message: 'Limit parameter should be a number' });
    });

    it('should return limited number of users', async () => {
      const req = getMockReq({ query: { limit: '1' } });
      const { res } = getMockRes();
      spy.mockImplementation(() => {
        return Promise.resolve([usersList[0]]);
      });
      await getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
      expect(res.send)
        .toHaveBeenCalledWith([usersList[0]]);
    });
  });

  describe('Get User By Id', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(UserService.prototype, 'getUserById');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should get user by id and get status 200', async () => {
      const req = getMockReq({ params: { id: '893fd8ce-74f3-4578-a066-a02d62c68470' } });
      const { res } = getMockRes();

      spy.mockImplementation((id) => {
        const user = usersList.find(user => user.id === id);
        return Promise.resolve(user);
      });

      await getUserById(req,res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
      expect(res.send).toHaveBeenCalledWith({
        "id": "893fd8ce-74f3-4578-a066-a02d62c68470",
        "login": "Daniel",
        "password": "c23VMvETTw",
        "age": 12,
        "isDeleted": false
      },);
    });

    it('should return error with 404 status code and message, if user not found', async () => {
      const req = getMockReq({ params: { id: 'non-existent-id' } });
      const { res } = getMockRes();

      spy.mockImplementation(() => {
        throw new AppError(HTTP_STATUS_CODE.NOT_FOUND, 'Not Found Error');
      });

      await getUserById(req,res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not Found Error' });
    });
  });

  describe('Create User', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(UserService.prototype, 'createUser');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should receive 201 status and successfully create user in response', async () => {
      const req = getMockReq(
        {
          body: {
            login: 'NewSuperUser',
            password: 'SuperSecurePassword1',
            age: 23
          }
        });
      const { res } = getMockRes();

      spy.mockImplementation((user: BaseUserDTO) => {
        return Promise.resolve({
          id: 'auto-generated-id',
          isDeleted: false,
          ...user,
        });
      });

      await createUser(req, res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.CREATED);
      expect(res.send).toHaveBeenCalledWith({
        id: 'auto-generated-id',
        login: 'NewSuperUser',
        password: 'SuperSecurePassword1',
        age: 23,
        isDeleted: false,
      });
    });

    it('should return 400 bad request in case of prisma validation error', async () => {
      const req = getMockReq(
        {
          body: {
            login: 'AlreadyExistingLoginName',
            password: 'SuperSecurePassword1',
            age: 23
          }
        });
      const { res } = getMockRes();

      spy.mockImplementation(() => {
        throw new AppError(HTTP_STATUS_CODE.BAD_REQUEST, 'Unique constraint failed on the fields: (`login`)');
      });

      await createUser(req, res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unique constraint failed on the fields: (`login`)' });
    });
  });

  describe('Update User', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(UserService.prototype, 'updateUser');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 200 status code and user', async () => {
      const req = getMockReq(
        {
          params: {
            id: '3336c1fb-9635-4b65-90d1-e4cf87f4f6a2',
          },
          body: {
            login: 'UpdatedLogin',
            password: 'SuperSecurePassword1',
            age: 23
          }
        });
      const { res } = getMockRes();

      spy.mockImplementation((user: BaseUserDTO) => {
        return Promise.resolve({
          id: '3336c1fb-9635-4b65-90d1-e4cf87f4f6a2',
          isDeleted: false,
          ...user,
        });
      });

      await updateUser(req, res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User 3336c1fb-9635-4b65-90d1-e4cf87f4f6a2 was updated',
        user:{
          id: '3336c1fb-9635-4b65-90d1-e4cf87f4f6a2',
          login: 'UpdatedLogin',
          password: 'SuperSecurePassword1',
          age: 23,
          isDeleted: false,
        }
      });
    });

    it('should return error with 404 status code and message, if user not found', async () => {
      const req = getMockReq(
        {
          params: {
            id: 'non-existent-id',
          },
          body: {
            login: 'UpdatedLogin',
            password: 'SuperSecurePassword1',
            age: 23
          }
        });
      const { res } = getMockRes();

      spy.mockImplementation(() => {
        throw new AppError(HTTP_STATUS_CODE.NOT_FOUND, 'Not Found Error');
      });

      await updateUser(req,res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not Found Error' });
    });

    it('should return 400 bad request in case of prisma validation error', async () => {
      const req = getMockReq(
        {
          params: {
            id: '3336c1fb-9635-4b65-90d1-e4cf87f4f6a2',
          },
          body: {
            login: 'UpdatedLogin',
            password: 'SuperSecurePassword1',
            age: 23
          }
        });
      const { res } = getMockRes();

      spy.mockImplementation(() => {
        throw new AppError(HTTP_STATUS_CODE.BAD_REQUEST, 'Unique constraint failed on the fields: (`login`)');
      });

      await updateUser(req, res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unique constraint failed on the fields: (`login`)' });
    });
  });

  describe('Remove User', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(UserService.prototype, 'removeUser');
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return status code 200 and message about successful removal', async () => {
      const req = getMockReq(
        {
          params: {
            id: '3336c1fb-9635-4b65-90d1-e4cf87f4f6a2',
          }
        }
      );
      const { res } = getMockRes();

      spy.mockImplementation((id) => {
        return Promise.resolve(id);
      });

      await removeUser(req, res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.OK);
      expect(res.json).toHaveBeenCalledWith({ message: 'User 3336c1fb-9635-4b65-90d1-e4cf87f4f6a2 is soft deleted' });
    });

    it('should return error with 404 status code and message, if user not found', async () => {
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

      await removeUser(req,res);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(HTTP_STATUS_CODE.NOT_FOUND);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not Found Error' });
    });
  });
});