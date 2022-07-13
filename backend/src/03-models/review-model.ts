import { Document, Schema, model } from "mongoose";
import { ProductModel } from "./product-model";
import { UserModel } from "./user-model";


// Define model interface:
export interface IReviewModel extends Document {
    // we don't define the _id because it exists by default.
    userId:Schema.Types.ObjectId;
    review:string;
    productId: Schema.Types.ObjectId;
    
}

// Define model schema:
const ReviewSchema = new Schema<IReviewModel>({
    userId: {
        type: Schema.Types.ObjectId,
    },
    review: {
        type: String,
        required: [true, "Missing review"],
    },
    productId: {
        type: Schema.Types.ObjectId,
    },
}, { 
    versionKey: false, // Don't create __v field
    toJSON: { virtuals: true }, // Fill also the virtual fields when we're calling a "populate" function
    id: false, // Don't duplicate _id to id field
    // timestamps: true // 01/01/1970 12:00:00
});

ReviewSchema.virtual("product", {
    ref: ProductModel, // Which model are you describing
    localField: "productId", // Our model relation field
    foreignField: "_id", // Other model relation field
    justOne: true // One-to-Many relation --> each product has one category and not many
});

ReviewSchema.virtual("user", {
    ref: UserModel, // Which model are you describing
    localField: "userId", // Our model relation field
    foreignField: "_id", // Other model relation field
    justOne: true // One-to-Many relation --> each product has one category and not many
});

// Define model:
export const ReviewModel = model<IReviewModel>("ReviewModel", ReviewSchema, "Reviews"); // model name, schema class, collection name
