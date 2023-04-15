import { CreateTagDto } from "../dto/create-tag.dto";

class CreateTagMapper{
    fromFrontToController(dto: CreateTagDto): CreateTagDto{
        return {
            name: dto.name
        }
    }
}
export const createTagMapper = new CreateTagMapper;