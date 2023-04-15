import { IsArray, IsNotEmpty, IsString, Length } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateThemeDto {
    @IsString()
    @Length(3, 200)
    title: string;

    @IsString()
    @Length(3, 1000)
    body: string;
    
    createdBy: ObjectId;

    @IsArray()
    @IsNotEmpty()
    tags: string[];
}