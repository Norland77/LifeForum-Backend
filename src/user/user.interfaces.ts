import { ObjectId } from "mongoose";
import { IUser } from "./schemas/user.schema";
import { Role } from "src/role/schemas/role.schemas";

export interface IUpdateUser {
    password?: string;
}

export interface IUpdateBan {
    unbannedAt?: Date;
}

export interface ICreateResetPassword {
    userId: ObjectId;
    token: string;
}

export interface IUserWithId extends IUser{
    _id: ObjectId;
}

export interface IUserWithRole extends IUserWithId {
    role: Role;
}

export interface IUserFront {
    login: string;
    role: string;
}

export interface ITokenAndUserFront {
    token: string;
    user: IUserFront;
}