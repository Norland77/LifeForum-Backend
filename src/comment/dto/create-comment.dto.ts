import { IsMongoId, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateCommentDto{
    @IsString()
    @Length(3, 1000)
    body: string;

    @IsNotEmpty()
    @IsMongoId()
    themeId: ObjectId;

    @IsOptional()
    createdBy?: ObjectId;
}