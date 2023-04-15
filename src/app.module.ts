import { Module } from '@nestjs/common';
import { AppImportsLoader } from './app-imports-loader';
import { RoleModule } from './role/role.module';
import { TagsModule } from './tags/tags.module';
import { UserModule } from './user/user.module';
import { ThemeModule } from './theme/theme.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    ...AppImportsLoader.load('configs/imports/*.imports.{ts,js}'),
    TagsModule,
    RoleModule,
    UserModule,
    ThemeModule,
    CommentModule
  ]
})
export class AppModule {}
