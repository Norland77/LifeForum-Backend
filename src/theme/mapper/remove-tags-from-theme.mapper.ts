import { RemoveTagsFromThemeDto } from "../dto/remove-tags-from-theme.dto";

class RemoveTagsFromThemeMapper {
    fromFrontToController(dto: RemoveTagsFromThemeDto): RemoveTagsFromThemeDto{
        return {
            tags: dto.tags
        }
    }
}

export const removeTagsFromThemeMapper = new RemoveTagsFromThemeMapper();