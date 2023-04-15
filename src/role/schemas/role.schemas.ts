import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Document} from "mongoose";

export type RoleDocument = Role & Document;

@Schema()
export class Role implements IRole {
    @Prop({ unique:true, required:true})
    name: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

export interface IRole{ 
    name:string
}