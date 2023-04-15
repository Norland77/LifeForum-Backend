import { IsNotEmpty, IsString, Length } from "class-validator";
import { ObjectId } from "mongoose";

export class BanUserDto {
    @IsString()
    @Length(3, 100)
    reason: string;

    userId: ObjectId;
    bannedBy: ObjectId;
    bannedAt: Date;
}