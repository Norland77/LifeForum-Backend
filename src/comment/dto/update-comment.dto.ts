import { IsOptional, IsString, Length } from "class-validator";

export class UpdateCommentDto {
    @IsOptional()
    @IsString()
    @Length(3, 1000)
    body?: string;
}