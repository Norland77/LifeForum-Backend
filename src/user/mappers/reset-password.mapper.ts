import { ResetPasswordDto } from "../dto/reset-password.dto";

class ResetPasswordMapper {
    fromControllerToService(dto: ResetPasswordDto): ResetPasswordDto {
        return {
            password: dto.password
        }
    }
}

export const resetPasswordMapper = new ResetPasswordMapper();