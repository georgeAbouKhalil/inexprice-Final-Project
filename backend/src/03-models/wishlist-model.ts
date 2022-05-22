import { Document, Schema, model } from "mongoose";
import { ProductModel } from "./product-model";
import { UserModel } from "./user-model";

// Define model interface:
export interface IWishListModel extends Document {
    productId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
}

// Define model schema:
const WishListSchema = new Schema<IWishListModel>({
    productId: {
        type: Schema.Types.ObjectId,
    },
    userId: {
        type: Schema.Types.ObjectId,
    },
}, { 
    versionKey: false, // Don't create __v field
    toJSON: { virtuals: true }, // Fill also the virtual fields when we're calling a "populate" function
    id: false, // Don't duplicate _id to id field
    // timestamps: true // 01/01/1970 12:00:00
});

WishListSchema.virtual("user", {
    ref: UserModel, // Which model are you describing
    localField: "userId", // Our model relation field
    foreignField: "_id", // Other model relation field
    justOne: true // One-to-Many relation --> each product has one category and not many
});
WishListSchema.virtual("product", {
    ref: ProductModel, // Which model are you describing
    localField: "productId", // Our model relation field
    foreignField: "_id", // Other model relation field
    justOne: true // One-to-Many relation --> each product has one category and not many
});

// Define model:
export const WishListModel = model<IWishListModel>("WishListModel", WishListSchema, "wishlist"); // model name, schema class, collection name
