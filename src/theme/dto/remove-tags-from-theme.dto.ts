import { IsArray, IsNotEmpty } from "class-validator";

export class RemoveTagsFromThemeDto {
    @IsArray()
    @IsNotEmpty()
    tags: string[];
}