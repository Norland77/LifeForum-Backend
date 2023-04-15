import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Document, ObjectId, SchemaTypes} from "mongoose";
import { User } from "../../user/schemas/user.schema";

export type ThemeDocument = Theme & Document;

@Schema({timestamps: true})
export class Theme implements ITheme {
    @Prop({ unique:true, required:true})
    title: string;

    @Prop({ required:true})
    body: string;

    @Prop({ required:true, type: SchemaTypes.ObjectId, ref: User.name})
    createdBy: ObjectId;
}

export const ThemeSchema = SchemaFactory.createForClass(Theme);

export interface ITheme{ 
    title: string;
    body: string;
    createdBy: ObjectId;
}