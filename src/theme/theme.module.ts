import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Theme, ThemeSchema } from "./schemas/theme.schema";
import { ThemeRepository } from "./theme.repository";
import { ThemeController } from "./theme.controller";
import { UserModule } from "../user/user.module";
import { RoleModule } from "../role/role.module";
import { ThemeTag, ThemeTagSchema } from "./schemas/theme-tag.schema";
import { TagsModule } from "src/tags/tags.module";
import { ThemeService } from "./theme.service";
import { CommentModule } from "src/comment/comment.module";

const themeFeature = MongooseModule.forFeature([{ name: Theme.name, schema: ThemeSchema }]);
const themeTagFeature = MongooseModule.forFeature([{ name: ThemeTag.name, schema: ThemeTagSchema }]);

@Module({
  imports: [
    themeFeature,
    themeTagFeature,
    UserModule,
    RoleModule,
    forwardRef(() => TagsModule),
    forwardRef(() => CommentModule)
  ],
  controllers: [
    ThemeController
  ],
  providers: [
    ThemeRepository,
    ThemeService
  ],
  exports: [
    ThemeRepository
  ]
})
export class ThemeModule {} 