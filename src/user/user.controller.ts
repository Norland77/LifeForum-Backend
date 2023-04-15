import { Body, Controller, Get, HttpException, NotFoundException, Param, Patch, Post, Req, UseGuards, Query} from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { CreateUserDto } from "./dto/create-user.dto";
import { createUserMapper } from "./mappers/create-user.mapper.dto";
import * as bcryptjs from "bcryptjs";
import { RoleType } from "../role/role.type";
import { RoleService } from "../role/role.service";
import { UserService } from "./user.service";
import { LoginDto } from "./dto/login.dto";
import { loginMapper } from "./mappers/login.mapper";
import { IsLogedInGuard } from "../guards/is-loged-in.guard";
import { Request } from 'express';
import { Roles } from "src/decorators/roles.decorator";
import { RolesGuard } from "src/guards/roles.guard";
import { BanUserDto } from "./dto/ban-user.dto";
import { ObjectId } from "mongoose";
import { ValidateMongooseIdPipe } from "src/pipes/validate-monoose-id.pipe";
import { IsBannedGuard } from "src/guards/is-banned.guard";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";
import { MailTransporterService } from "src/mail-transporter/mail-transporter.service";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { resetPasswordMapper } from "./mappers/reset-password.mapper";
import { banUserMapper } from "./mappers/ban-user.mapper";
import { forgotPasswordMapper } from "./mappers/forgot-password.mapper";
import { authMapper } from "./mappers/auth.mapper";
import { getUserByLoginMapper } from "./mappers/get-user-by-login.mapper";
import { ToNumberPipe } from "../pipes/to-number.pipe";
import { getUsersMapper } from "./mappers/get-users.mapper";

@Controller("user")
export class UserController {
    constructor(private readonly userRepository: UserRepository,
                private readonly userService: UserService,
                private readonly roleService: RoleService,
                private readonly mailTransporterService: MailTransporterService) {}

    @Get('/get/all')
    async getAllUsers(@Query('limit', ToNumberPipe) limitQ: number = 9, @Query('offset', ToNumberPipe) offsetQ: number = 0) {
        const { limit, offset } = getUsersMapper.fromControllerToService(limitQ, offsetQ);
        const users = await this.userRepository.getAllUsersFront(limit, offset);
        const total = (await this.userRepository.getAllUsers()).length;
        return {
            total,
            limit,
            offset,
            users
        };
    }

    @UseGuards(IsLogedInGuard)
    @UseGuards(IsBannedGuard)
    @Get('/auth')
    async auth(@Req() req: Request) {
        const userReq = req.user;
        const user = await this.userRepository.getUserByEmail(userReq.email);
        if(!user)
            throw new NotFoundException('The user was not found.');
        const token = this.userService.generateToken(user);
        return authMapper.fromControllerToFront(token, user);
    }

    @Get('/:login')
    async getUserByLogin(@Param('login') login: string) {
        const user = await this.userRepository.getUserByLogin(login);
        if(!user)
            throw new NotFoundException('The user was not found.');
        return getUserByLoginMapper.fromControllerToFront(user);
    }

    @Post('/register')
    async registration(@Body() dto: CreateUserDto): Promise<Object> {
        dto = createUserMapper.fromFrontToController(dto);
        const user = await this.userRepository.getUserByEmail(dto.email);
        if(user)
            throw new HttpException('This email is already in use', 400);
        const userRole = await this.roleService.getRoleByName(RoleType.User);
        if(!userRole)
            throw new NotFoundException('The user role was not found');
        const hashPassword = await bcryptjs.hash(dto.password!, 5);
        const newUser = await this.userRepository.createUser({...dto, password: hashPassword, roleId: userRole.id})
        const token = this.userService.generateToken(newUser);
        return createUserMapper.fromControllerToFront(token, {...newUser, role: userRole});
    }

    @Post('/login')
    async login(@Body() dto: LoginDto): Promise<Object> {
        dto = loginMapper.fromFrontToController(dto);
        const user = await this.userRepository.getUserByEmail(dto.email);
        if(!user)
            throw new HttpException('Incorrect data', 400);
        const comparePasswords = await bcryptjs.compare(dto.password, user.password);
        if(!comparePasswords)
            throw new HttpException('Incorrect data', 400);
        const isBanned = await this.userService.isBanned(user._id);
        if(isBanned)
            throw new HttpException('You are banned', 403);
        const token = this.userService.generateToken(user);
        return loginMapper.fromControllerToFront(token, user);
    }

    @Roles([RoleType.Admin])
    @UseGuards(RolesGuard)
    @UseGuards(IsBannedGuard)
    @Post('/ban/:userId')
    async banUser(@Body() dto: BanUserDto, @Req() req: Request, @Param('userId', ValidateMongooseIdPipe) userId: ObjectId) {
        if(!userId)
            throw new HttpException('Incorrect id type', 400);
        dto = banUserMapper.fromFrontToController(dto);
        const userReq = req.user;
        const user = await this.userRepository.getUserByEmail(userReq.email);
        if(!user)
            throw new NotFoundException('The user was not found.');
        const banUser = await this.userRepository.getUserById(userId);
        if(!banUser)
            throw new NotFoundException('The user was not found.');
        if(user._id === banUser._id)
            throw new HttpException('You cannot ban yourself.', 400);
        const isBanned = await this.userService.isBanned(banUser._id);
        if(isBanned)
            throw new HttpException('This user is already banned', 400);
        await this.userRepository.createBan({...dto, userId: banUser._id, bannedBy: user._id});
        return { message: 'The user has been banned successfully.' };
    }

    @Roles([RoleType.Admin])
    @UseGuards(RolesGuard)
    @UseGuards(IsBannedGuard)
    @Patch('/unban/:userId')
    async unbanUser(@Param('userId', ValidateMongooseIdPipe) userId: ObjectId) {
        if(!userId)
            throw new HttpException('Incorrect id type', 400);
        const unbanUser = await this.userRepository.getUserById(userId);
        if(!unbanUser)
            throw new NotFoundException('The user was not found.');
        const isBanned = await this.userService.isBanned(userId);
        if(!isBanned)
            throw new HttpException('This user is not banned.', 400);
        const lastBan = await this.userService.getLastUserBan(unbanUser._id);
        await this.userRepository.updateBanById(lastBan._id, { unbannedAt: new Date() });
        return { message: 'The user has been unbanned successfully.' };
    }

    @Post('/forgot-password')
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        dto = forgotPasswordMapper.fromFrontToController(dto);
        const user = await this.userRepository.getUserByEmail(dto.email);
        if(!user)
            throw new HttpException('The user was not found.', 404);
        const resetPassword = await this.userRepository.getResetPasswordByUserId(user._id);
        if(!resetPassword) {
            const token = this.userService.generateResetPasswordToken();
            await this.userRepository.createResetPassword({token, userId: user._id});
        }
        const link = this.userService.createResetPasswordLink(user._id.toString(), resetPassword.token);
        await this.mailTransporterService.sendEmail(user.email, 'Reset password', link);
        return { message: 'To complete your reset password you have to move on the link in your email.' };
    }

    @Post('/reset-password/:userId/:token')
    async resetPassword(@Body() dto: ResetPasswordDto, @Param('userId', ValidateMongooseIdPipe) userId: ObjectId, @Param('token') token: string) {
        if(!userId)
            throw new HttpException('Incorrect id type', 400);
        dto = resetPasswordMapper.fromControllerToService(dto);
        const user = await this.userRepository.getUserById(userId);
        if(!user)
            throw new HttpException('Incorrect data.', 400);
        const resetPassword = await this.userRepository.getResetPasswordByUserIdAndToken(user.id, token);
        if(!resetPassword)
            throw new HttpException('Incorrect data.', 400);
        const hashPassword = await bcryptjs.hash(dto.password, 5);
        await this.userRepository.updateUserById(user.id, {password: hashPassword});
        await this.userRepository.deleteResetPasswordById(resetPassword.id);
        return {message: `The password has been changed successfully.`};
    }
}