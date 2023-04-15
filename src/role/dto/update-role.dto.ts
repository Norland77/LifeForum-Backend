import { IsNotEmpty, IsDefined, IsString } from "class-validator";

export class UpdateRoleDto{
    @IsNotEmpty()
    @IsDefined()
    @IsString()
    name:string;
}