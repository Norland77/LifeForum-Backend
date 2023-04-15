import { IsOptional, IsString, Length } from "class-validator";

export class UpdateThemeDto {
    @IsOptional()
    @IsString()
    @Length(3, 200)
    title?: string;

    @IsOptional()
    @IsString()
    @Length(3, 1000)
    body?: string;
}