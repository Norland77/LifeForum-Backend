import { UpdateRoleDto } from "../dto/update-role.dto";


class UpdateRoleMapper{
    fromFrontToController(dto: UpdateRoleDto): UpdateRoleDto{
        return {
            name: dto.name
        }
    }
}
export const updateRoleMapper = new UpdateRoleMapper;