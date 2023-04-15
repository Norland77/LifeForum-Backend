import { Injectable } from "@nestjs/common";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { RoleRepository } from "./role.repository";
import { ObjectId } from "mongoose";

@Injectable()
export class RoleService {
    constructor(
        private readonly roleRepository: RoleRepository
    ) {}

    async createRole(newRole:CreateRoleDto){
       await this.roleRepository.createRole(newRole); 
    }

    async getAllRoles(): Promise<string[]>{
        return (await (this.roleRepository.getAllRoles())).map( tag => {
            return tag.name;
        } );
    }

    async getRoleByName(roleName: string): Promise<{id: ObjectId, name: string}> {
        const role = await this.roleRepository.getRoleByName(roleName);
        if(!role)
            return null;
        return {
            id: role.id,
            name: role.name
        };
    }

    async deleteRoleByName(roleName: string){
         (await (this.roleRepository.deleteRoleByName(roleName)));
    }

    async updateTagByName(roleName: string,dto: UpdateRoleDto){
        return this.roleRepository.updateRoleByName(roleName,dto);
    }
}