import { ITheme } from "./schemas/theme.schema";

export interface GetAllThemesFrontType {
    total: number;
    limit: number;
    offset: number;
    themes: ITheme[];
}