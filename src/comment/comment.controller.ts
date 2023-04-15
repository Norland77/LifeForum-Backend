import {Body, Controller, Delete, Get, HttpException, NotFoundException, Param, Patch, Post, Query, Req, UseGuards} from "@nestjs/common";
import { Request } from "express";
import { ObjectId } from "mongoose";
import { IsLogedInGuard } from "src/guards/is-loged-in.guard";
import { ToNumberPipe } from "src/pipes/to-number.pipe";
import { ThemeRepository } from "src/theme/theme.repository";
import { UserRepository } from "src/user/user.repository";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { createCommentMapper } from "./mapper/create-comment.mapper";
import { getCommentsMapper } from "./mapper/get-comments.mapper";
import { IsBannedGuard } from "src/guards/is-banned.guard";
import { ValidateMongooseIdPipe } from "src/pipes/validate-monoose-id.pipe";
import { RoleRepository } from "src/role/role.repository";
import { RoleType } from "src/role/role.type";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { updateCommentMapper } from "./mapper/update-comment.mapper";

@Controller("comment")
export class CommentController{
    constructor(private readonly commentService: CommentService,
                private readonly userRepository: UserRepository,
                private readonly themeRepository: ThemeRepository,
                private readonly roleRepository: RoleRepository){}
    
    @UseGuards(IsLogedInGuard)
    @UseGuards(IsBannedGuard)
    @Post('/create')
    async createComment(@Body() dto: CreateCommentDto, @Req() req: Request){
        dto = createCommentMapper.fromFrontToController(dto);
        const userReq = req.user;
        const user = await this.userRepository.getUserByEmail(userReq.email);
        if(!user){
            throw new NotFoundException('The user was not found.');
        }
        const theme = await this.themeRepository.getThemeById(dto.themeId);
        if(!theme){
            throw new NotFoundException('The theme was not found.');
        }
        return this.commentService.createComment({...dto,createdBy:user._id});
    }

    @UseGuards(IsLogedInGuard)
    @UseGuards(IsBannedGuard)
    @Get('/get/:themeId')
    async getAllCommentsByTheme(
        @Query('limit', ToNumberPipe) limitQ: number = 9,
        @Query('offset', ToNumberPipe) offsetQ: number = 0,
        @Param('themeId', ValidateMongooseIdPipe) themeId: ObjectId){
        if(!themeId)
            throw new HttpException('Invalid id type', 400);
        const { limit, offset } = getCommentsMapper.fromControllerToService(limitQ, offsetQ);
        const theme = await this.themeRepository.getThemeById(themeId);
        if(!theme){
            throw new NotFoundException('The theme was not found.');
        }
        const comments = await this.commentService.getCommentsByThemeFront(themeId, offset, limit);
        const total = (await this.commentService.getCommentsByTheme(themeId)).length;
        return {
            total,
            limit,
            offset,
            comments
        };
    }

    @UseGuards(IsLogedInGuard)
    @UseGuards(IsBannedGuard)
    @Get('/get/user/:themeId')
    async getAllCommentsByThemeAndUser(
        @Query('limit', ToNumberPipe) limitQ: number = 9,
        @Query('offset', ToNumberPipe) offsetQ: number = 0, 
        @Param('themeId', ValidateMongooseIdPipe) themeId: ObjectId,
        @Req() req: Request
        ){
        if(!themeId)
            throw new HttpException('Invalid id type', 400);
        const { limit, offset } = getCommentsMapper.fromControllerToService(limitQ, offsetQ);
        const userReq = req.user;
        const user = await this.userRepository.getUserByEmail(userReq.email);
        if(!user){
            throw new NotFoundException('The user was not found.');
        }
        const theme = await this.themeRepository.getThemeById(themeId);
        if(!theme){
            throw new NotFoundException('The theme was not found.');
        }
        const comments = await this.commentService.getCommentsByThemeAndByUserFront(themeId, user._id, offset, limit);
        const total = (await this.commentService.getCommentsByThemeAndByUser(themeId, user._id)).length;
        return {
            total,
            limit,
            offset,
            comments
        };
    }

    @UseGuards(IsLogedInGuard)
    @UseGuards(IsBannedGuard)
    @Patch('/update/:commentId')
    async updateComment(@Body() dto: UpdateCommentDto, @Param('commentId', ValidateMongooseIdPipe) commentId: ObjectId) {
        if(!commentId)
            throw new HttpException('Invalid id type', 400);
        dto = updateCommentMapper.fromFrontToController(dto);
        const comment = await this.commentService.getCommentById(commentId);
        if(!comment)
            throw new NotFoundException('The comment was not found');
        await this.commentService.updateCommentById(comment._id, dto);
        return { message: 'The comment has been updated successfully.' };
    }

    @UseGuards(IsLogedInGuard)
    @UseGuards(IsBannedGuard)
    @Delete('/delete/:commentId')
    async deleteComment(@Param('commentId', ValidateMongooseIdPipe) commentId: ObjectId, @Req() req: Request) {
        if(!commentId)
            throw new HttpException('Invalid id type', 400);
        const userReq = req.user;
        const user = await this.userRepository.getUserByEmail(userReq.email);
        if(!user)
            throw new NotFoundException('The user was not found.');
        const comment = await this.commentService.getCommentById(commentId);
        if(!comment)
            throw new NotFoundException('The comment was not found');
        const role = await this.roleRepository.getRoleById(user.roleId);
        if(!role)
            throw new NotFoundException("The role was not found");
        if(comment.createdBy !== user._id && role.name !== RoleType.Admin)
            throw new HttpException("You don't have a permission to do this action", 403);
        await this.commentService.deleteCommentById(comment._id);
        return { message: 'The comment has been deleted successfully.' };
    }
}