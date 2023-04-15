import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, ObjectId, SchemaTypes } from "mongoose";
import { Theme } from "src/theme/schemas/theme.schema";
import { User } from "src/user/schemas/user.schema";

export type CommentDocument = Comment & Document;

@Schema({timestamps: true})
export class Comment implements IComment{
    @Prop({required:true})
    body:string;

    @Prop({required:true, type:SchemaTypes.ObjectId, ref: Theme.name})
    themeId: ObjectId;

    @Prop({required:true, type:SchemaTypes.ObjectId, ref: User.name})
    createdBy: ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

export interface IComment{
    body: string;
    themeId: ObjectId;
    createdBy: ObjectId;
}