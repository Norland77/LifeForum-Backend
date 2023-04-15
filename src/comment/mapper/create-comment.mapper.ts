import { CreateCommentDto } from "../dto/create-comment.dto"

class CreateCommentMapper {
    fromFrontToController(dto: CreateCommentDto): CreateCommentDto{
        return {
            body:dto.body,
            themeId: dto.themeId,
            createdBy: dto.createdBy
        }
    }
}

export const createCommentMapper = new CreateCommentMapper();