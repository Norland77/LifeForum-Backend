import { ObjectId } from "mongoose";

export interface IThemeCreation {
    title: string;
    body: string;
    createdBy: ObjectId;
}

export interface IBulkWriteTag {
    insertOne: {
        document: {
            name: string
        }
    }
}

export interface IBulkWriteInsertOneThemeTag {
    insertOne: {
        document: {
            themeId: ObjectId;
            tagId: ObjectId;
        }
    }
}

export interface IBulkWriteDeleteOneThemeTag {
    deleteOne: {
        filter: {
            _id: ObjectId;
        }
    }
}