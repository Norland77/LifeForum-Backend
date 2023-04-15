import { ForgotPasswordDto } from "../dto/forgot-password.dto";

class ForgotPasswordMapper {
    fromFrontToController(dto: ForgotPasswordDto): ForgotPasswordDto{
        return {
            email: dto.email
        }
    }
}
export const forgotPasswordMapper = new ForgotPasswordMapper;