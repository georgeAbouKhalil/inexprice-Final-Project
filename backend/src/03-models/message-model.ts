import { Document, Schema, model } from "mongoose";
import { CartModel } from "./cart-model";
import { CategoryModel } from './category-model';
import { ProductModel } from "./product-model";
import { UserModel } from "./user-model";

// Define model interface:
export interface IMessageModel extends Document {
    // we don't define the _id because it exists by default.
    userId: Schema.Types.ObjectId;
    role: Schema.Types.ObjectId;
    admin: string;
    name: string;
    userName: string;
    email: string;
    message: string;
    date: string;
    time: string;

}

// Define model schema:
const MessageModelSchema = new Schema<IMessageModel>({
    // userId: {
    //     type: Schema.Types.ObjectId,
    // },
    admin: {
        type: String,
    },
    name: {
        type: String,
    },
    userName: {
        type: String,
    },
    email: {
        type: String,
    },
    message: {
        type: String,
    },
    date: {
        type: String,
    }, 
    time: {
        type: String
    },
    role: {
        type: Schema.Types.ObjectId, 
    }
}, {
    versionKey: false, // Don't create __v field
    toJSON: { virtuals: true }, // Fill also the virtual fields when we're calling a "populate" function
    id: false, // Don't duplicate _id to id field
    // timestamps: true // 01/01/1970 12:00:00
});

// MessageModelSchema.virtual("user", {
//     ref: UserModel, // Which model are you describing
//     localField: "userId", // Our model relation field
//     foreignField: "_id", // Other model relation field
//     justOne: true // One-to-Many relation --> each product has one category and not many
// });
MessageModelSchema.virtual("user", {
    ref: UserModel, // Which model are you describing
    localField: "role", // Our model relation field
    foreignField: "role", // Other model relation field
    justOne: true // One-to-Many relation --> each product has one category and not many
});
// Define model:
export const MessageModel = model<IMessageModel>("MessageModel", MessageModelSchema, "messages"); // model name, schema class, collection name
