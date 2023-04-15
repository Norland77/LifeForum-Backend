import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { UserRepository } from "./user.repository";
import { RoleModule } from "../role/role.module";
import { JwtModule } from "@nestjs/jwt";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { Ban, BanSchema } from "./schemas/ban.schema";
import { ResetPassword, ResetPasswordSchema } from "./schemas/reset-password.schema";
import { MailTransporterModule } from "src/mail-transporter/mail-transporter.module";

const userFeature = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]);
const banFeature = MongooseModule.forFeature([{ name: Ban.name, schema: BanSchema }]);
const resetPasswordFeature = MongooseModule.forFeature([{ name: ResetPassword.name, schema: ResetPasswordSchema }]);

const jwtRegister = JwtModule.register({
  secret: process.env.JWT_SECRET || 'jwtsecret',
  signOptions: {
    expiresIn: '1h'
  }
});

@Module({
  imports: [
    userFeature,
    banFeature,
    resetPasswordFeature,
    jwtRegister,
    forwardRef(() => RoleModule),
    MailTransporterModule
  ],
  controllers: [
    UserController
  ],
  providers: [
    UserRepository,
    UserService
  ],
  exports: [
    UserRepository,
    UserService,
    jwtRegister
  ]
})
export class UserModule {} 