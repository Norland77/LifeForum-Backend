import { UpdateTagDto } from "../dto/update-tag.dto";

class UpdateTagMapper{
    fromFrontToController(dto: UpdateTagDto): UpdateTagDto{
        return {
            name: dto.name
        }
    }
}
export const updateTagMapper = new UpdateTagMapper;