import { CreateRoleDto } from "../dto/create-role.dto";

class CreateRoleMapper{
    fromFrontToController(dto: CreateRoleDto): CreateRoleDto{
        return {
            name: dto.name
        }
    }
}
export const createRoleMapper = new CreateRoleMapper; 