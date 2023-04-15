import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Document, ObjectId, SchemaTypes} from "mongoose";
import { User } from "./user.schema";

export type BanDocument = Ban & Document;

@Schema()
export class Ban implements IBan {
    @Prop({ required: true })
    reason: string;

    @Prop({ required: true, type: SchemaTypes.ObjectId, ref: User.name })
    userId: ObjectId;

    @Prop({ required: true, type: SchemaTypes.ObjectId, ref: User.name })
    bannedBy: ObjectId;

    @Prop({ required: true, default: new Date })
    bannedAt: Date;

    @Prop()
    unbannedAt: Date;
}

export const BanSchema = SchemaFactory.createForClass(Ban);

export interface IBan{ 
    reason: string;
    userId: ObjectId;
    bannedBy: ObjectId;
    bannedAt: Date;
    unbannedAt: Date;
}
