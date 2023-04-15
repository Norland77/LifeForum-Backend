import { Injectable } from "@nestjs/common";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { ITags, TagsDocument } from "./schemas/tags.schema";
import { TagsRepository } from "./tags.repository";
import { ObjectId } from "mongoose";

@Injectable()
export class TagsService {
    constructor(
        private readonly tagsRepository: TagsRepository
    ) {}

    async createTag(newTag:CreateTagDto){
       await this.tagsRepository.createTag(newTag); 
    }

    async getAllTags(): Promise<string[]>{
        return (await (this.tagsRepository.getAllTags())).map( tag => {
            return tag.name;
        } );
    }

    async getAllTagsFront(limit: number, offset: number): Promise<string[]>{
        return (await (this.tagsRepository.getAllTagsFront(limit, offset))).map( tag => {
            return tag.name;
        } );
    }

    async getTagByName(tagName: string): Promise<string>{
        return (await (this.tagsRepository.getTagByName(tagName))).name;
    }

    async deleteTagByName(tagName: string){
         (await (this.tagsRepository.deleteTagByName(tagName)));
    }

    async updateTagByName(tagName: string,dto: UpdateTagDto){
        return this.tagsRepository.updateTagByName(tagName,dto);
    }

    getIdsFromTags(tags: TagsDocument[]): ObjectId[] {
        return tags.map(tag => {
            return tag._id;
        });
    }
}