import { CreateThemeDto } from "../dto/create-theme.dto";

class CreateThemeMapper {
    fromFrontToController(dto: CreateThemeDto): CreateThemeDto{
        return {
            body: dto.body,
            createdBy: dto.createdBy,
            title: dto.title,
            tags: dto.tags
        }
    }
}

export const createThemeMapper = new CreateThemeMapper();