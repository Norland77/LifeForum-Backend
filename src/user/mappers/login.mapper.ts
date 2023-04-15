import { LoginDto } from "../dto/login.dto";
import { ITokenAndUserFront, IUserWithRole } from "../user.interfaces";

class LoginMapper {
    fromFrontToController(dto: LoginDto): LoginDto{
        return {
            email: dto.email,
            password: dto.password
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
export const loginMapper = new LoginMapper;