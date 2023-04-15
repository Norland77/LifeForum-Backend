import { CreateUserDto } from "../dto/create-user.dto";
import { ITokenAndUserFront, IUserWithRole } from "../user.interfaces";

class CreateUserMapper {
    fromFrontToController(dto: CreateUserDto): CreateUserDto{
        return {
            email: dto.email,
            login: dto.login,
            password: dto.password,
            roleId: dto.roleId
        }
    }

    fromControllerToFront(token: string, user: IUserWithRole): ITokenAndUserFront {
        return {
            token,
            user: {
                login: user.login,
                role: user.role.name
            }
        }
    }
}
export const createUserMapper = new CreateUserMapper;