import { IsNotEmpty, IsDefined, IsString } from "class-validator";

export class CreateTagDto{
    @IsNotEmpty()
    @IsDefined()
    @IsString()
    name:string;
}