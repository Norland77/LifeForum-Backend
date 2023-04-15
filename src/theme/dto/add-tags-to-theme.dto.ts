import { IsArray, IsNotEmpty } from "class-validator";

export class AddTagsToThemeDto {
    @IsArray()
    @IsNotEmpty()
    tags: string[];
}