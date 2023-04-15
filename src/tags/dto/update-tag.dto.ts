import { IsNotEmpty, IsDefined, IsString } from "class-validator";

export class UpdateTagDto{
    @IsNotEmpty()
    @IsDefined()
    @IsString()
    name:string;
}