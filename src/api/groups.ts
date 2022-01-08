import express, { NextFunction, Request, Response } from "express";
import { Container } from "typedi";
import { GroupService } from "../services/groupService";
import { BaseGroupDTO, GroupDTO } from "../types/groupDTO";

export const groupsRouter = express.Router();
const groupService = Container.get(GroupService);

const getAllGroups = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const groups = await groupService.getAllGroups();
    res.status(200).send(groups);
  } catch (error) {
    next(error);
  }
};

const getGroupById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const group = await groupService.getGroupById(Number(id));

    if(!group) {
      return res.status(404).send({ error: `Group ${id} not found!` });
    }
    res.status(200).send(group);
  } catch (error) {
    next(error);
  }
};

const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groupDTO = req.body as BaseGroupDTO;
    const group = await groupService.createGroup(groupDTO);
    res.status(201).json(group);
  } catch (error) {
    next(error);
  }
};

const updateGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body as BaseGroupDTO;
    const groupDTO: GroupDTO = {
      id: Number(id),
      name,
      permissions
    };
    const group = await groupService.updateGroup(groupDTO);

    if(!group){
      return res.status(404).send({ error: `Group ${id} not found!` });
    }

    res.status(200).json({ message: `Group with ${id} is updated`, group });
  } catch (error) {
    next(error);
  }
};

const removeGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const group = await groupService.removeGroup(Number(id));

    res.status(200).json({ message: `Group ${group.name} was deleted` });
  } catch (error) {
    next(error);
  }
};

const addUsersToGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { members } = req.body;

    const updatedGroup = await groupService.addUsersToGroup(Number(id), members);

    res.status(200).json(updatedGroup);
  } catch (error) {
    next(error);
  }
};

const getGroupUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const members = await groupService.getGroupMembers(Number(id));

    res.status(200).json(members);
  } catch (error) {
    next(error);
  }
};

groupsRouter.get('/', getAllGroups);
groupsRouter.get('/:id', getGroupById);
groupsRouter.post('/', createGroup);
groupsRouter.put('/:id', updateGroup);
groupsRouter.delete('/:id', removeGroup);
groupsRouter.post('/:id/members', addUsersToGroup);
groupsRouter.get('/:id/members', getGroupUsers);


