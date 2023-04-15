import { IUserWithRole, IUserFront } from "../user.interfaces";

class GetUserByLoginMapper {
    fromControllerToFront(user: IUserWithRole): IUserFront {
        return {
            login: user.login,
            role: user.role.name
        }
    }
}
export const getUserByLoginMapper = new GetUserByLoginMapper;