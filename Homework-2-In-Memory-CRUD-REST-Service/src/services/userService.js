import { User } from '../models/User.js';
import { sortUsersByLogin } from '../helpers/usersHelper.js';

const users = [];

export const createUser = (login, password, age) => {
    const user = new User(login, password, age);
    users.push(user);
    return user;
};

export const updateUser = (id, propsToUpdate) => {
    const user = getUserById(id);
    if (!user) {
        return null;
    }
    user.update(propsToUpdate);

    return user;
};

const getAllUsers = () => users;

export const getUserById = id => {
    const user = users.find(item => item.id === id);
    if (!user) {
        return null;
    }

    return user;
};

export const removeUser = id => {
    const user = getUserById(id);
    if (!user) {
        return null;
    }
    user.isDeleted = true;

    return user.id;
};

export const getUsers = filters => {
    let filteredUsers = [...getAllUsers()];

    if (filters.loginSubstring) {
        const loginSubstring = filters.loginSubstring;
        filteredUsers = filteredUsers.filter(user => user.login.toLowerCase().includes(loginSubstring));
    }

    if (filters.limit) {
        const limit = parseInt(filters.limit, 10);
        filteredUsers = filteredUsers.slice(0, limit);
        sortUsersByLogin(filteredUsers);
    }

    return filteredUsers;
};
