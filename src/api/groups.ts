import express, { Request, Response } from "express";
import { Container } from "typedi";
import { GroupService } from "../services/groupService";
import { BaseGroupDTO, GroupDTO } from "../types/groupDTO";
import { HTTP_STATUS_CODE } from "../enums/statusCodes";
import Logger from "../config/winstonLogger";
import { createErrorString } from '../helpers/loggingHelper';
import { authenticateToken } from "../middlewares/authenticateToken";

export const groupsRouter = express.Router();
const groupService = Container.get(GroupService);

export const getAllGroups = async (req: Request, res: Response) => {
  try {
    const groups = await groupService.getAllGroups();
    res.status(HTTP_STATUS_CODE.OK).send(groups);
  } catch (error: any) {
    Logger.error(createErrorString(error.message, 'getAllGroups', req));
    res.status(error.status).json({ message: error.message });
  }
};

export const getGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const group = await groupService.getGroupById(Number(id));
    res.status(HTTP_STATUS_CODE.OK).send(group);
  } catch (error: any) {
    Logger.error(createErrorString(error.message, 'getGroupById', req));
    res.status(error.status).json({ message: error.message });
  }
};

export const createGroup = async (req: Request, res: Response) => {
  try {
    const groupDTO = req.body as BaseGroupDTO;
    const group = await groupService.createGroup(groupDTO);
    res.status(HTTP_STATUS_CODE.CREATED).send(group);
  } catch (error: any) {
    Logger.error(createErrorString(error.message, 'createGroup', req));
    res.status(error.status).json({ message: error.message });
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body as BaseGroupDTO;
    const groupDTO: GroupDTO = {
      id: Number(id),
      name,
      permissions
    };
    const group = await groupService.updateGroup(groupDTO);
    res.status(HTTP_STATUS_CODE.OK)
      .json({ message: `Group with ${id} is updated`, group });
  } catch (error: any) {
    Logger.error(createErrorString(error.message, 'updateGroup', req));
    res.status(error.status).json({ message: error.message });
  }
};

export const removeGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const group = await groupService.removeGroup(Number(id));
    res.status(HTTP_STATUS_CODE.OK).json({ message: `Group ${group?.name} was deleted` });
  } catch (error: any) {
    Logger.error(createErrorString(error.message, 'removeGroup', req));
    res.status(error.status).json({ message: error.message });
  }
};

export const addUsersToGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { members } = req.body;

    const updatedGroup = await groupService.addUsersToGroup(Number(id), members);

    res.status(HTTP_STATUS_CODE.OK).send(updatedGroup);
  } catch (error: any) {
    Logger.error(createErrorString(error.message, 'addUsersToGroup', req));
    res.status(error.status).json({ message: error.message });
  }
};

export const getGroupUsers = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const members = await groupService.getGroupMembers(Number(id));
    res.status(HTTP_STATUS_CODE.OK).send(members);
  } catch (error: any) {
    Logger.error(createErrorString(error.message, 'getGroupUsers', req));
    res.status(error.status).json({ message: error.message });
  }
};

groupsRouter.get('/', authenticateToken, getAllGroups);
groupsRouter.get('/:id', authenticateToken, getGroupById);
groupsRouter.post('/', authenticateToken, createGroup);
groupsRouter.put('/:id', authenticateToken, updateGroup);
groupsRouter.delete('/:id', authenticateToken, removeGroup);
groupsRouter.post('/:id/members', authenticateToken, addUsersToGroup);
groupsRouter.get('/:id/members', authenticateToken, getGroupUsers);


