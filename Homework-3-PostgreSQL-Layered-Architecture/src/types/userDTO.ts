export type BaseUserDTO = {
    login: string;
    password: string;
    age: number;
}

export type UserDTO = BaseUserDTO & { id: number }
