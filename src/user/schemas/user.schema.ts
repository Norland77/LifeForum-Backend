import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Document, ObjectId, SchemaTypes} from "mongoose";
import { Role } from "../../role/schemas/role.schemas";

export type UserDocument = User & Document;

@Schema()
export class User implements IUser {
    @Prop({ required: true})
    login: string;

    @Prop({ required: true, unique: true})
    email: string;

    @Prop({ required: true})
    password: string;

    @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Role.name})
    roleId: ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);

export interface IUser{ 
    login: string;
    email: string;
    password: string;
    roleId: ObjectId;
}
