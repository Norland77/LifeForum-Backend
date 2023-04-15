import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "src/user/user.repository";
import { UserService } from "src/user/user.service";

@Injectable()
export class IsBannedGuard implements CanActivate {
    constructor(private jwtService: JwtService,
                private userRepository: UserRepository,
                private userService: UserService){}

    async canActivate(context: ExecutionContext) {
        try {
            const req = context.switchToHttp().getRequest();
            const token = req.headers.authorization?.split(' ')[1];
            if(!token)
                throw new HttpException('No authorization', 401)
            const user = this.jwtService.verify<Express.User>(token);
            if(!user)
                throw new HttpException('No authorization', 401);
            const userDB = await this.userRepository.getUserByEmail(user.email);
            if(!userDB)
                throw new HttpException('No authorization', 401);
            const isBanned = await this.userService.isBanned(userDB._id);
            if(isBanned)
                throw new HttpException('You are banned.', 403);
            return true;
        } catch (error) {
            if(error instanceof HttpException)
                throw error;
            throw new HttpException('No authorization', 401);
        }
    }
}