import { Injectable } from "@nestjs/common";
import { User } from "./schemas/user.schema";
import { JwtService } from "@nestjs/jwt";
import { ObjectId } from "mongoose";
import { UserRepository } from "./user.repository";
import { BanDocument } from "./schemas/ban.schema";
import { v4 } from "uuid"

@Injectable()
export class UserService {
    constructor(private readonly jwtService: JwtService,
                private readonly userRepository: UserRepository){}

    generateToken(user: User): string {
        const payload = {
            email: user.email,
            login: user.login
        };
        return this.jwtService.sign(payload);
    }

    async getLastUserBan(userId: ObjectId): Promise<BanDocument> {
        const bans = await this.userRepository.getBansByUserId(userId);
        if(bans.length === 0)
            return null;
        return bans[bans.length - 1];
    }

    async isBanned(userId: ObjectId): Promise<boolean> {
        const lastBan = await this.getLastUserBan(userId);
        if(!lastBan)
            return false;
        return !lastBan.unbannedAt;
    }

    generateResetPasswordToken() {
        return v4();
    }

    createResetPasswordLink(userId: string, token: string) {
        return `${process.env.FRONT_URL}/${userId}/${token}`;
    }
}