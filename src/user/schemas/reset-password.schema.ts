import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Document, ObjectId, SchemaTypes} from "mongoose";
import { User } from "./user.schema";

export type ResetPasswordDocument = ResetPassword & Document;

@Schema()
export class ResetPassword implements IResetPassword {
    @Prop({required: true, type: SchemaTypes.ObjectId, ref: User.name})
    userId: ObjectId;

    @Prop({required: true})
    token: string;
}

export const ResetPasswordSchema = SchemaFactory.createForClass(ResetPassword);

export interface IResetPassword{ 
    userId: ObjectId;
    token: string;
}
