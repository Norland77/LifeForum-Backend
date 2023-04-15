import { IsEmail, IsString, Length } from "class-validator";

export class LoginDto {
    @IsEmail()
    email: string;
    
    @IsString()
    @Length(3, 30)
    password: string;
}