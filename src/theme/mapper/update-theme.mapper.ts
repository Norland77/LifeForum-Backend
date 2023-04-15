import { UpdateThemeDto } from "../dto/update-theme.dto";

class UpdateThemeMapper {
    fromFrontToController(dto: UpdateThemeDto): UpdateThemeDto{
        return {
            body: dto.body,
            title: dto.title
        }
    }
}

export const updateThemeMapper = new UpdateThemeMapper();