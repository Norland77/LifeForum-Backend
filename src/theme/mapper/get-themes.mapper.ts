class GetThemesMapper {
    fromControllerToService(limit: number, offset: number) {
        return {
            limit: limit > 0 ? limit : 9,
            offset: offset >= 0 ? offset : 0
        }
    }
}

export const getThemesMapper = new GetThemesMapper();