import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Tags, TagsSchema } from "./schemas/tags.schema";
import { TagsController } from "./tags.controller";
import { TagsRepository } from "./tags.repository";
import { TagsService } from "./tags.service";
import { UserModule } from "src/user/user.module";
import { RoleModule } from "src/role/role.module";
import { ThemeModule } from "src/theme/theme.module";

const tagsFeature = MongooseModule.forFeature([{ name: Tags.name, schema: TagsSchema }])

@Module({
  imports: [
    tagsFeature,
    UserModule,
    RoleModule,
    forwardRef(() => ThemeModule)
  ],
  controllers: [TagsController],
  providers: [
    TagsService,
    TagsRepository
  ],
  exports: [
    TagsService,
    TagsRepository
  ]
})
export class TagsModule {} 