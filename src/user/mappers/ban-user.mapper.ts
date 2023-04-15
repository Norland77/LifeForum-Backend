import { BanUserDto } from "../dto/ban-user.dto";

class BanUserMapper {
    fromFrontToController(dto: BanUserDto): BanUserDto{
        return {
            reason: dto.reason,
            bannedAt: dto.bannedAt,
            bannedBy: dto.bannedBy,
            userId: dto.userId
        }
    }
}
export const banUserMapper = new BanUserMapper;