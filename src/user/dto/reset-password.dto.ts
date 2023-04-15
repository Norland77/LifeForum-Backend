import { IsString, Length } from "class-validator";

export class ResetPasswordDto {
    @IsString()
    @Length(3, 30)
    password: string;
}