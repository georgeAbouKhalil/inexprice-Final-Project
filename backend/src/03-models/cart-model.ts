import { Document, Schema, model } from "mongoose";
import { UserModel } from "./user-model";

// Define model interface:
export interface ICartModel extends Document {
    user_id: Schema.Types.ObjectId;
    status: string
}

// Define model schema:
const CartSchema = new Schema<ICartModel>({
    user_id: {
        type: Schema.Types.ObjectId,
    },
    status: {
        type: String,
    },
}, { 
    versionKey: false, // Don't create __v field
    toJSON: { virtuals: true }, // Fill also the virtual fields when we're calling a "populate" function
    id: false, // Don't duplicate _id to id field
});

CartSchema.virtual("user", {
    ref: UserModel, // Which model are you describing
    localField: "user_id", // Our model relation field
    foreignField: "_id", // Other model relation field
    justOne: true // each product has one category and not many
});

// Define model:
export const CartModel = model<ICartModel>("CartModel", CartSchema, "Cart"); // model name, schema class, collection name
