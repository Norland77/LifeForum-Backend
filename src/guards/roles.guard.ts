import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { UserRepository } from "../user/user.repository";
import { RoleRepository } from "../role/role.repository";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private jwtService: JwtService,
                private reflector: Reflector,
                private userRepository: UserRepository,
                private roleRepository: RoleRepository){}

    async canActivate(context: ExecutionContext) {
        try {
            const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler()
            ]);
            if(!roles)
                return true;
            const req = context.switchToHttp().getRequest();
            const token = req.headers.authorization?.split(' ')[1];
            if(!token)
                throw new HttpException('No authorization', 401);
            const user = this.jwtService.verify<Express.User>(token);
            if(!user)
                throw new HttpException('No authorization', 401);
            const userDB = await this.userRepository.getUserByEmail(user.email);
            if(!userDB)
                throw new HttpException('No authorization', 401);
            const role = await this.roleRepository.getRoleById(userDB.roleId);
            if(!role)
                throw new HttpException('No authorization', 401);
            req.user = user;
            return roles.includes(role.name);
        } catch (error) {
            if(error instanceof HttpException)
                throw error;
            throw new HttpException('No access', 403);
        }
    }
}