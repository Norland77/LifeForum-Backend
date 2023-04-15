import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Comment, CommentDocument, IComment } from "./schemas/comment.schema";

@Injectable()
export class CommentRepository {
    constructor(@InjectModel(Comment.name) private readonly comment:Model<CommentDocument>){}
    
    async createComment(data: CreateCommentDto){
        return this.comment.create(data);
    }

    async getAllCommentsByThemeId(themeId: ObjectId){
        return this.comment.find({themeId});
    }

    async getAllCommentsByThemeIdFront(themeId: ObjectId, offset: number, limit: number):Promise<IComment[]>{
        return this.comment.find({themeId}).skip(offset).limit(limit);
    }

    async getCommentById(id: ObjectId){
        return this.comment.findOne({_id: id});
    }

    async getAllCommentsByThemeIdAndUserId(themeId: ObjectId, createdBy: ObjectId):Promise<IComment[]>{
        return this.comment.find({themeId, createdBy});
    }

    async getAllCommentsByThemeIdAndUserIdFront(themeId: ObjectId, createdBy: ObjectId, offset: number, limit: number):Promise<IComment[]>{
        return this.comment.find({themeId, createdBy}).skip(offset).limit(limit);
    }

    async deleteCommentById(id: ObjectId){
        await this.comment.deleteOne({_id: id});
    }

    async deleteCommentsByThemeId(themeId: ObjectId){
        await this.comment.deleteMany({themeId});
    }

    async updateCommentById(id: ObjectId, dto: UpdateCommentDto){
        return this.comment.updateOne({_id: id},dto);
    }
}