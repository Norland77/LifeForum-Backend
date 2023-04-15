import { ITokenAndUserFront, IUserWithRole } from "../user.interfaces";

class AuthMapper {
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
export const authMapper = new AuthMapper;