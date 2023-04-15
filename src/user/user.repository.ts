import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {Model, ObjectId} from "mongoose";
import { IUser, User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { BanUserDto } from "./dto/ban-user.dto";
import { Ban, BanDocument } from "./schemas/ban.schema";
import { ICreateResetPassword, IUpdateBan, IUpdateUser, IUserWithRole, IUserFront } from "./user.interfaces";
import { ResetPassword, ResetPasswordDocument } from "./schemas/reset-password.schema";

@Injectable()
export class UserRepository {
    constructor(@InjectModel(User.name) private readonly user: Model<UserDocument>,
                @InjectModel(Ban.name) private readonly ban: Model<BanDocument>,
                @InjectModel(ResetPassword.name) private readonly resetPassword: Model<ResetPasswordDocument>) {}

    async createUser(data: CreateUserDto){
        return this.user.create(data);
    }
    
    async getUserById(userId: ObjectId): Promise<UserDocument> {
        return this.user.findById(userId);
    }

    async getAllUsers(): Promise<IUser[]>{
        return this.user.find();
    }

    async getAllUsersFront(limit: number, offset: number): Promise<IUserFront[]>{
        return this.user.aggregate(
            [
                {
                  '$lookup': {
                    'from': 'roles', 
                    'localField': 'roleId', 
                    'foreignField': '_id', 
                    'as': 'role'
                  }
                }, {
                  '$unwind': {
                    'path': '$role'
                  }
                }, {
                  '$project': {
                    'login': 1, 
                    'role': '$role.name'
                  }
                },
                {
                  '$unset': '_id'
                }
              ]
        ).skip(offset).limit(limit);
    }

    async updateUserById(userId: ObjectId, data: IUpdateUser) {
        return this.user.updateOne({_id: userId}, data);
    }

    async getUserByEmail(email: string): Promise<IUserWithRole>{
        return (await this.user.aggregate([
              {
                '$match': {
                  'email': email
                }
              },
              {
                '$lookup': {
                  'from': 'roles', 
                  'localField': 'roleId', 
                  'foreignField': '_id', 
                  'as': 'role'
                }
              }, {
                '$unwind': {
                  'path': '$role'
                }
              }
        ]))[0];
    }

    async getUserByLogin(login: string): Promise<IUserWithRole>{
        return (await this.user.aggregate([
            {
                '$match': {
                    'login': login
                }
            },
            {
                '$lookup': {
                  'from': 'roles', 
                  'localField': 'roleId', 
                  'foreignField': '_id', 
                  'as': 'role'
                }
              }, {
                '$unwind': {
                  'path': '$role'
                }
              }
        ]))[0];
    }

    async createBan(data: BanUserDto): Promise<BanDocument> {
        return this.ban.create(data);
    }

    async getBanByUserId(userId: ObjectId): Promise<BanDocument> {
        return this.ban.findOne({userId});
    }

    async getBansByUserId(userId: ObjectId): Promise<BanDocument[]> {
        return this.ban.find({userId});
    }

    async updateBanById(banId: ObjectId, data: IUpdateBan) {
        return this.ban.updateOne({_id: banId}, data);
    }

    async createResetPassword(data: ICreateResetPassword): Promise<ResetPassword> {
        return this.resetPassword.create(data);
    }

    async getResetPasswordByUserId(userId: ObjectId): Promise<ResetPasswordDocument> {
        return this.resetPassword.findOne({userId});
    }

    async getResetPasswordByUserIdAndToken(userId: ObjectId, token: string): Promise<ResetPasswordDocument> {
        return this.resetPassword.findOne({userId, token});
    }

    async deleteResetPasswordById(id: ObjectId) {
        return this.resetPassword.deleteOne({_id: id});
    }
}