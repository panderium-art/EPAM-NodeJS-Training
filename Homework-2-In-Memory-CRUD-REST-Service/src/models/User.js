import { randomUUID } from 'crypto';

export class User {
    constructor(login, password, age) {
        this.id = randomUUID();
        this.login = login;
        this.password = password;
        this.age = age;
        this.isDeleted = false;
    }

    update(updatedUserObj) {
        this.login = updatedUserObj.login;
        this.password = updatedUserObj.password;
        this.age = updatedUserObj.age;
    }

    toJSON() {
        const { ...obj } = this;
        return obj;
    }
}
