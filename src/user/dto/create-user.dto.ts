import { IsEmail, IsString, Length } from "class-validator";
import { ObjectId } from "mongoose";

export class CreateUserDto {
    @IsString()
    @Length(3, 30)
    login: string;

    @IsEmail()
    email: string;

    @IsString()
    @Length(3, 30)
    password: string;

    roleId?: ObjectId;
}