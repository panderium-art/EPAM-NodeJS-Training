import * as UserService from '../services/userService.js';

export const getUsers = (req, res) => {
    const filters = req.query;
    const users = UserService.getUsers(filters);

    res.status(200).send(users);
};

export const getUserById = (req, res) => {
    const id = req.params.id;
    const user = UserService.getUserById(id);

    if (!user) {
        return res.status(404).send({ error: `User ${id} not found!` });
    }

    res.status(200).send(user);
};

export const createUser = (req, res) => {
    const { login, password, age } = req.body;
    const user = UserService.createUser(login, password, age);

    res.status(201).json(user);
};

export const updateUser = (req, res) => {
    const id = req.params.id;
    const propsToUpdate = req.body;

    const user = UserService.updateUser(id, propsToUpdate);

    if (!user) {
        return res.status(404).send({ error: 'User not found' });
    }

    res.status(201).json(user);
};

export const deleteUser = (req, res) => {
    const id = req.params.id;

    const removedUserId = UserService.removeUser(id);

    if (!removedUserId) {
        return res.status(404).send({ error: 'User not found!' });
    }

    res.status(200).send({ message: `User ${removedUserId} is soft deleted` });
};
