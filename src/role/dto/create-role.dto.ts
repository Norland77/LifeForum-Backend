import { IsNotEmpty, IsDefined, IsString } from "class-validator";

export class CreateRoleDto{
    @IsNotEmpty()
    @IsDefined()
    @IsString()
    name:string;
}