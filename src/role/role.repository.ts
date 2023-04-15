import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {Model, ObjectId} from "mongoose";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { IRole, Role, RoleDocument } from "./schemas/role.schemas";

@Injectable()
export class RoleRepository {
    constructor(
        @InjectModel(Role.name) private readonly role: Model<RoleDocument>
    ) {}

    async createRole(data:CreateRoleDto){
        return this.role.create(data);
    } 

    async getAllRoles(): Promise<IRole[]>{
        return this.role.find();
    }

    async getRoleById(id: ObjectId): Promise<RoleDocument>{
        return this.role.findOne({_id: id});
    }

    async getRoleByName(roleName: string): Promise<RoleDocument>{
        return this.role.findOne({name: roleName});
    }

    async deleteRoleByName(roleName: string){
        await this.role.deleteOne({name: roleName});
    }

    async updateRoleByName(roleName: string,dto: UpdateRoleDto){
        return this.role.updateOne({name: roleName},dto);
    }
}