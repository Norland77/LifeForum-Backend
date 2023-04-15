import { AddTagsToThemeDto } from "../dto/add-tags-to-theme.dto";

class AddTagsToThemeMapper {
    fromFrontToController(dto: AddTagsToThemeDto): AddTagsToThemeDto{
        return {
            tags: dto.tags
        }
    }
}

export const addTagsToThemeMapper = new AddTagsToThemeMapper();