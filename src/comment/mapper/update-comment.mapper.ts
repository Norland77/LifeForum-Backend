import { UpdateCommentDto } from "../dto/update-comment.dto";

class UpdateCommentMapper {
    fromFrontToController(dto: UpdateCommentDto): UpdateCommentDto{
        return {
            body:dto.body
        }
    }
}

export const updateCommentMapper = new UpdateCommentMapper();