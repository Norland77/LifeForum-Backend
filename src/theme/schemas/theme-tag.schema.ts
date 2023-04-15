import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Document, ObjectId, SchemaTypes} from "mongoose";
import { Theme } from "./theme.schema";
import { Tags } from "src/tags/schemas/tags.schema";

export type ThemeTagDocument = ThemeTag & Document;

@Schema({timestamps: true})
export class ThemeTag implements IThemeTag {
    @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Theme.name})
    themeId: ObjectId;

    @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Tags.name})
    tagId: ObjectId;
}

export const ThemeTagSchema = SchemaFactory.createForClass(ThemeTag);

export interface IThemeTag{ 
    themeId: ObjectId;
    tagId: ObjectId;
}