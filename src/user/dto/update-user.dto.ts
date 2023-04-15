import { IsOptional, IsString, Length } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @Length(3, 30)
    login: string;
}