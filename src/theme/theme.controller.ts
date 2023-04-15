import { Body, Controller, Delete, Get, HttpException, NotFoundException, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { IsLogedInGuard } from "../guards/is-loged-in.guard";
import { CreateThemeDto } from "./dto/create-theme.dto";
import { createThemeMapper } from "./mapper/create-theme.mapper";
import { ThemeRepository } from "./theme.repository";
import { Request } from 'express';
import { UserRepository } from "../user/user.repository";
import { UpdateThemeDto } from "./dto/update-theme.dto";
import { updateThemeMapper } from "./mapper/update-theme.mapper";
import { ToNumberPipe } from "../pipes/to-number.pipe";
import { getThemesMapper } from "./mapper/get-themes.mapper";
import { GetAllThemesFrontType } from "./theme.types";
import { RoleRepository } from "../role/role.repository";
import { RoleType } from "../role/role.type";
import { ValidateMongooseIdPipe } from "src/pipes/validate-monoose-id.pipe";
import { TagsRepository } from "src/tags/tags.repository";
import { ThemeService } from "./theme.service";
import { ObjectId } from "mongoose";
import { IsBannedGuard } from "src/guards/is-banned.guard";
import { CommentRepository } from "src/comment/comment.repository";
import { AddTagsToThemeDto } from "./dto/add-tags-to-theme.dto";
import { addTagsToThemeMapper } from "./mapper/add-tags-to-theme.mapper";
import { RemoveTagsFromThemeDto } from "./dto/remove-tags-from-theme.dto";
import { removeTagsFromThemeMapper } from "./mapper/remove-tags-from-theme.mapper";
import { TagsService } from "src/tags/tags.service";

@Controller("theme")
export class ThemeController {
    constructor(private readonly themeRepository: ThemeRepository,
                private readonly themeService: ThemeService,
                private readonly userRepository: UserRepository,
                private readonly roleRepository: RoleRepository,
                private readonly tagsRepository: TagsRepository,
                private readonly tagsService: TagsService,
                private readonly commentRepository: CommentRepository) {}

    @Get('/get/all')
    async getAllThemes(@Query('limit', ToNumberPipe) limitQ: number = 9, @Query('offset', ToNumberPipe) offsetQ: number = 0): Promise<GetAllThemesFrontType> {
        const { limit, offset } = getThemesMapper.fromControllerToService(limitQ, offsetQ);
        const themes = await this.themeRepository.getAllThemesFront(limit, offset);
        const total = (await this.themeRepository.getAllThemes()).length;
        return {
            total,
            limit,
            offset,
            themes
        };
    }

    @Get('/get/:themeId')
    async getThemeById(@Param('themeId', ValidateMongooseIdPipe) themeId: string) {
        if(!themeId)
            throw new HttpException('Incorrect id type', 400);
        const theme = await this.themeService.getThemeByIdFront(themeId);
        if(!theme)
            throw new NotFoundException('The theme was not found');
        return theme;
    }

    @UseGuards(IsLogedInGuard)
    @UseGuards(IsBannedGuard)
    @Post('/create')
    async createTheme(@Body() dto: CreateThemeDto, @Req() req: Request) {
        dto = createThemeMapper.fromFrontToController(dto);
        const userReq = req.user;
        const user = await this.userRepository.getUserByEmail(userReq.email);
        if(!user)
            throw new NotFoundException('The user was not found.');
        const theme = await this.themeRepository.getThemeByTitle(dto.title);
        if(theme)
            throw new HttpException('The theme with this title is already in use', 400);
        const existingTags = await this.tagsRepository.getTagsByNames(dto.tags);
        const newTags = this.themeService.excludeExistingTags(existingTags, dto.tags);
        const tagsForCreation = this.themeService.prepareTagsForCreation(newTags);
        const newCreatedTags = await this.themeService.createTagsByNames(tagsForCreation);
        const existingTagsIds = this.themeService.getIdsFromTags(existingTags);
        const newTheme = await this.themeRepository.createTheme({ ...dto, createdBy: user._id });
        await this.themeService.addTagsToTheme(newTheme._id, [...newCreatedTags, ...existingTagsIds]);
        return newTheme;
    }

    @UseGuards(IsLogedInGuard)
    @UseGuards(IsBannedGuard)
    @Patch('/update/:themeId')
    async updateTheme(@Body() dto: UpdateThemeDto, @Param('themeId', ValidateMongooseIdPipe) themeId: ObjectId): Promise<Object> {
        if(!themeId)
            throw new HttpException('Incorrect id type', 400);
        dto = updateThemeMapper.fromFrontToController(dto);
        const theme = await this.themeRepository.getThemeById(themeId);
        if(!theme)
            throw new NotFoundException('The theme was not found');
        if(dto.title) {
            const checkTitleUnique = await this.themeRepository.getThemeByTitle(dto.title);
            if(checkTitleUnique)
                throw new HttpException('The theme with this title is already in use', 400);
        }
        await this.themeRepository.updateThemeById(theme._id, dto);
        return { message: 'The theme has been updated successfully.' };
    }

    @UseGuards(IsLogedInGuard)
    @UseGuards(IsBannedGuard)
    @Post('/add-tags/:themeId')
    async addTagsToTheme(@Body() dto: AddTagsToThemeDto, @Param('themeId', ValidateMongooseIdPipe) themeId: ObjectId) {
        if(!themeId)
            throw new HttpException('Incorrect id type', 400);
        dto = addTagsToThemeMapper.fromFrontToController(dto);
        const theme = await this.themeRepository.getThemeById(themeId);
        if(!theme)
            throw new NotFoundException('The theme was not found');
        const existingTags = await this.tagsRepository.getTagsByNames(dto.tags);
        const newTags = this.themeService.excludeExistingTags(existingTags, dto.tags);
        const tagsForCreation = this.themeService.prepareTagsForCreation(newTags);
        const newCreatedTags = await this.themeService.createTagsByNames(tagsForCreation);
        const existingTagsIds = this.themeService.getIdsFromTags(existingTags);
        await this.themeService.addTagsToTheme(theme._id, [...newCreatedTags, ...existingTagsIds]);
        return { message: 'The tags has been added successfully.' };
    }

    @UseGuards(IsLogedInGuard)
    @UseGuards(IsBannedGuard)
    @Delete('/remove-tags/:themeId')
    async removeTagsFromTheme(@Body() dto: RemoveTagsFromThemeDto, @Param('themeId', ValidateMongooseIdPipe) themeId: ObjectId) {
        if(!themeId)
            throw new HttpException('Incorrect id type', 400);
        dto = removeTagsFromThemeMapper.fromFrontToController(dto);
        const theme = await this.themeRepository.getThemeById(themeId);
        if(!theme)
            throw new NotFoundException('The theme was not found');
        const existingTags = await this.tagsRepository.getTagsByNames(dto.tags);
        const tagsIds = this.tagsService.getIdsFromTags(existingTags);
        const themeTags = await this.themeRepository.getThemeTagsByThemeIdAndTagIds(theme._id, tagsIds);
        const themeTagIds = this.themeService.getTagIdsFromThemTags(themeTags);
        const themeTagsForDelete = this.themeService.prepareThemeTagsForDelete(themeTagIds);
        await this.themeRepository.deleteThemeTags(themeTagsForDelete);
        return { message: 'The tags from theme has been removed successfully.' };
    }

    @UseGuards(IsLogedInGuard)
    @UseGuards(IsBannedGuard)
    @Delete('/delete/:themeId')
    async deleteTheme(@Param('themeId') themeId: ObjectId, @Req() req: Request): Promise<Object> {
        const userReq = req.user;
        const user = await this.userRepository.getUserByEmail(userReq.email);
        if(!user)
            throw new NotFoundException('The user was not found.');
        const theme = await this.themeRepository.getThemeById(themeId);
        if(!theme)
            throw new NotFoundException('The theme was not found');
        const role = await this.roleRepository.getRoleById(user.roleId);
        if(!role)
            throw new NotFoundException("The role was not found");
        if(theme.createdBy !== user._id && role.name !== RoleType.Admin)
            throw new HttpException("You don't have a permission to do this action", 403);
        await this.commentRepository.deleteCommentsByThemeId(theme._id);
        await this.themeRepository.deleteThemeTagsByThemeId(theme._id);
        await this.themeRepository.deleteThemeById(theme._id);
        return { message: 'The theme has been deleted successfully.' };
    }
}