import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ThemeModule } from "src/theme/theme.module";
import { UserModule } from "src/user/user.module";
import { CommentController } from "./comment.controller";
import { CommentRepository } from "./comment.repository";
import { CommentService } from "./comment.service";
import { Comment, CommentSchema } from "./schemas/comment.schema";
import { RoleModule } from "src/role/role.module";

const commentFeature = MongooseModule.forFeature([{name: Comment.name, schema: CommentSchema}]);

@Module({
    imports: [
        commentFeature,
        UserModule,
        forwardRef(() => ThemeModule),
        RoleModule
    ],
    controllers: [
      CommentController
    ],
    providers: [
      CommentRepository,
      CommentService
    ],
    exports: [
        CommentRepository
    ]
  })
  export class CommentModule {} 