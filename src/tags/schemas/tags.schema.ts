import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Document} from "mongoose";

export type TagsDocument = Tags & Document;


@Schema()
export class Tags implements ITags {
    @Prop({ unique:true, required:true})
    name: string;
}

export const TagsSchema = SchemaFactory.createForClass(Tags);

export interface ITags{ 
    name:string
}
