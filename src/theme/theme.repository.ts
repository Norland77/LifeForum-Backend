import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, ObjectId } from "mongoose";
import { ITheme, Theme, ThemeDocument } from "./schemas/theme.schema";
import { UpdateThemeDto } from "./dto/update-theme.dto";
import { IBulkWriteDeleteOneThemeTag, IBulkWriteInsertOneThemeTag, IThemeCreation } from "./theme.interfaces";
import { ThemeTag, ThemeTagDocument } from "./schemas/theme-tag.schema";

@Injectable()
export class ThemeRepository {
    constructor(@InjectModel(Theme.name) private readonly theme: Model<ThemeDocument>,
        @InjectModel(ThemeTag.name) private readonly themeTag: Model<ThemeTagDocument>) { }

    async createTheme(data: IThemeCreation) {
        return this.theme.create(data);
    }

    async getAllThemes(): Promise<ITheme[]> {
        return this.theme.find();
    }

    async getAllThemesFront(limit: number, offset: number): Promise<ITheme[]> {
        return this.theme.aggregate([
          {
            '$lookup': {
              'from': 'themetags', 
              'localField': '_id', 
              'foreignField': 'themeId', 
              'as': 'themetags'
            }
          }, {
            '$unwind': {
              'path': '$themetags', 
              'preserveNullAndEmptyArrays': true
            }
          }, {
            '$lookup': {
              'from': 'tags', 
              'localField': 'themetags.tagId', 
              'foreignField': '_id', 
              'as': 'tag'
            }
          }, {
            '$unwind': {
              'path': '$tag', 
              'preserveNullAndEmptyArrays': true
            }
          }, {
            '$unset': 'themetags'
          }, {
            '$group': {
              '_id': '$_id', 
              'title': {
                '$first': '$title'
              }, 
              'body': {
                '$first': '$body'
              }, 
              'createdBy': {
                '$first': '$createdBy'
              }, 
              'createdAt': {
                '$first': '$createdAt'
              }, 
              'updatedAt': {
                '$first': '$updatedAt'
              }, 
              'tags': {
                '$push': '$tag'
              }
            }
          }, {
            '$lookup': {
              'from': 'comments', 
              'localField': '_id', 
              'foreignField': 'themeId', 
              'as': 'comments'
            }
          }, {
            '$addFields': {
              'commentCount': {
                '$size': '$comments'
              }
            }
          }, {
            '$addFields': {
              'comments': {
                '$filter': {
                  'input': '$comments', 
                  'as': 'comment', 
                  'cond': {
                    '$eq': [
                      '$$comment.createdAt', {
                        '$max': '$comments.createdAt'
                      }
                    ]
                  }
                }
              }
            }
          }, {
            '$addFields': {
              'lastComment': {
                '$last': '$comments'
              }
            }
          }, {
            '$unset': 'comments'
          }, {
            '$lookup': {
              'from': 'users', 
              'localField': 'createdBy', 
              'foreignField': '_id', 
              'as': 'user'
            }
          }, {
            '$unwind': {
              'path': '$user', 
              'preserveNullAndEmptyArrays': true
            }
          }, {
            '$project': {
              '_id': 1, 
              'title': 1, 
              'body': 1, 
              'createdBy': '$user.login', 
              'createdAt': 1, 
              'updatedAt': 1, 
              'tags': 1, 
              'commentCount': 1, 
              'lastComment': 1
            }
          }, {
            '$lookup': {
              'from': 'users', 
              'localField': 'lastComment.createdBy', 
              'foreignField': '_id', 
              'as': 'user'
            }
          }, {
            '$unwind': {
              'path': '$user', 
              'preserveNullAndEmptyArrays': true
            }
          }, {
            '$project': {
              '_id': 1, 
              'title': 1, 
              'body': 1, 
              'createdBy': 1, 
              'createdAt': 1, 
              'updatedAt': 1, 
              'tags': 1, 
              'commentCount': 1, 
              'lastComment': {
                '$cond': {
                  'if': {
                    '$eq': [
                      {
                        '$type': '$user'
                      }, 'missing'
                    ]
                  }, 
                  'then': '$empty', 
                  'else': {
                    '_id': '$lastComment._id', 
                    'body': '$lastComment.body', 
                    'themeId': '$lastComment.themeId', 
                    'createdBy': '$user.login', 
                    'createdAt': '$lastComment.createdAt', 
                    'updatedAt': '$lastComment.updatedAt'
                  }
                }
              }
            }
          }
        ]).skip(offset).limit(limit);
    }

    async getThemeById(id: ObjectId): Promise<ThemeDocument> {
        return this.theme.findOne({ _id: id });
    }

    async getThemeByIdFront(id: string): Promise<any> {
        return this.theme.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
                }
            },
            {
              '$lookup': {
                'from': 'comments', 
                'localField': '_id', 
                'foreignField': 'themeId', 
                'as': 'comments'
              }
            }, {
              '$unwind': {
                'path': '$comments', 
                'preserveNullAndEmptyArrays': true
              }
            }, {
              '$lookup': {
                'from': 'users', 
                'localField': 'comments.createdBy', 
                'foreignField': '_id', 
                'as': 'user'
              }
            }, {
              '$project': {
                'title': 1, 
                'body': 1, 
                'createdBy': 1, 
                'createdAt': 1, 
                'updatedAt': 1, 
                'comment': '$comments', 
                'user': '$user'
              }
            }, {
              '$unwind': {
                'path': '$user', 
                'preserveNullAndEmptyArrays': true
              }
            }, {
              '$addFields': {
                'comment': {
                  '$mergeObjects': [
                    '$comment', {
                      'user': '$user'
                    }
                  ]
                }
              }
            }, {
              '$unset': 'user'
            }, {
              '$lookup': {
                'from': 'roles', 
                'localField': 'comment.user.roleId', 
                'foreignField': '_id', 
                'as': 'role'
              }
            }, {
              '$unwind': {
                'path': '$role', 
                'preserveNullAndEmptyArrays': true
              }
            }, {
              '$addFields': {
                'comment.user': {
                  '$mergeObjects': [
                    '$comment.user', {
                      'role': '$role.name'
                    }
                  ]
                }
              }
            }, {
              '$lookup': {
                'from': 'bans', 
                'localField': 'comment.user._id', 
                'foreignField': 'userId', 
                'as': 'comment.user.bans'
              }
            }, {
              '$addFields': {
                'comment.user.lastBan': {
                  '$ifNull': [
                    {
                      '$arrayElemAt': [
                        '$comment.user.bans', {
                          '$subtract': [
                            {
                              '$size': '$comment.user.bans'
                            }, 1
                          ]
                        }
                      ]
                    }, '$empty'
                  ]
                }
              }
            }, {
              '$addFields': {
                'comment.user.isBanned': {
                  '$cond': {
                    'if': {
                      '$eq': [
                        {
                          '$type': '$comment.user.lastBan'
                        }, 'object'
                      ]
                    }, 
                    'then': {
                      '$cond': {
                        'if': {
                          '$eq': [
                            {
                              '$type': '$comment.user.lastBan.unbannedAt'
                            }, 'date'
                          ]
                        }, 
                        'then': false, 
                        'else': true
                      }
                    }, 
                    'else': false
                  }
                }
              }
            }, {
              '$project': {
                '_id': 1, 
                'title': 1, 
                'body': 1, 
                'createdBy': 1, 
                'createdAt': 1, 
                'updatedAt': 1, 
                'comment': {
                  '$cond': {
                    'if': {
                      '$eq': [
                        {
                          '$type': '$comment._id'
                        }, 'missing'
                      ]
                    }, 
                    'then': '$empty', 
                    'else': '$comment'
                  }
                }
              }
            }, {
              '$unset': 'comment.user.lastBan'
            }, {
              '$group': {
                '_id': '$_id', 
                'title': {
                  '$first': '$title'
                }, 
                'body': {
                  '$first': '$body'
                }, 
                'createdBy': {
                  '$first': '$createdBy'
                }, 
                'createdAt': {
                  '$first': '$createdAt'
                }, 
                'updatedAt': {
                  '$first': '$updatedAt'
                }, 
                'comments': {
                  '$push': '$comment'
                }
              }
            }, {
              '$project': {
                'comments.user.password': 0, 
                'comments.user.roleId': 0, 
                'comments.user.email': 0, 
                'comments.user._id': 0, 
                'comments.user.bans': 0
              }
            }, {
              '$addFields': {
                'comments': {
                  '$cond': {
                    'if': {
                      '$and': [
                        {
                          '$eq': [
                            {
                              '$size': '$comments'
                            }, 1
                          ]
                        }, {
                          '$eq': [
                            {
                              '$size': {
                                '$objectToArray': {
                                  '$arrayElemAt': [
                                    '$comments', 0
                                  ]
                                }
                              }
                            }, 0
                          ]
                        }
                      ]
                    }, 
                    'then': [], 
                    'else': '$comments'
                  }
                }
              }
            }
        ]);
    }

    async getThemeByTitle(title: string): Promise<ThemeDocument> {
        return this.theme.findOne({ title });
    }

    async deleteThemeById(id: ObjectId) {
        await this.theme.deleteOne({ _id: id });
    }

    async updateThemeById(id: ObjectId, dto: UpdateThemeDto) {
        return this.theme.updateOne({ _id: id }, dto);
    }

    async createThemeTags(data: IBulkWriteInsertOneThemeTag[]) {
        return this.themeTag.bulkWrite(data);
    }

    async deleteThemeTags(data: IBulkWriteDeleteOneThemeTag[]) {
        return this.themeTag.bulkWrite(data);
    }

    async getThemeTagsByThemeId(themeId: ObjectId): Promise<ThemeTagDocument[]> {
        return this.themeTag.find({ themeId });
    }

    async getThemeTagsByThemeIdAndTagIds(themeId: ObjectId, tagsIds: ObjectId[]): Promise<ThemeTagDocument[]> {
        return this.themeTag.find({
            themeId,
            tagId: {
                "$in": tagsIds
            }
        });
    }

    async deleteThemeTagsByThemeId(themeId: ObjectId) {
        await this.themeTag.deleteMany({ themeId });
    }

    async deleteThemeTagsByTagId(tagId: ObjectId) {
        await this.themeTag.deleteMany({ tagId });
    }
}