import { Document, Schema, model } from "mongoose";
import { CartModel } from "./cart-model";
import { CategoryModel } from './category-model';
import { UserModel } from "./user-model";

// Define model interface:
export interface IOrderModel extends Document {
    // we don't define the _id because it exists by default.
     cart_id: Schema.Types.ObjectId;
     user_id: Schema.Types.ObjectId;
     final_price : number;
     delivery_city: string;
     order_date: string;
     credit_card: string;
     order_number: Number;
}

// Define model schema:
const OrderSchema = new Schema<IOrderModel>({
    cart_id: {
        type: Schema.Types.ObjectId,
        required: [true, "Missing cart_id"]
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: [true, "Missing user_id"]
    },
    final_price: {
        type: Number,
        required: [true, "Missing stock"],
        min: [0, "Stock can't be negative"]
    },
    order_number: {
        type: Number,
        unique: true
    },
    delivery_city: {
        type: String,
        required: [true, "City is required"],
        minlength: [2, "City must be min 2 chars"],
        maxlength: [20, "City must be min 20 chars"],
        trim: true
    },
    order_date: {
        type: String,
        required: [true, "order Date is required"]
    },
    credit_card: {
        type: String,
        required: [true, "Missing stock"],
        min: [0, "Stock can't be negative"],
        max: [1000, "Stock can't exceed 1000"]
    },
}, { 
    versionKey: false, // Don't create __v field
    toJSON: { virtuals: true }, // Fill also the virtual fields when we're calling a "populate" function
    id: false, // Don't duplicate _id to id field
});

OrderSchema.virtual("cart", {
    ref: CartModel, // Which model are you describing
    localField: "cart_id", // Our model relation field
    foreignField: "_id", // Other model relation field
    justOne: true // One-to-Many relation --> each product has one category and not many
});
OrderSchema.virtual("user", {
    ref: UserModel, // Which model are you describing
    localField: "user_id", // Our model relation field
    foreignField: "_id", // Other model relation field
    justOne: true // One-to-Many relation --> each product has one category and not many
});

// Define model:
export const OrderModel = model<IOrderModel>("OrderModel", OrderSchema, "Order"); // model name, schema class, collection name
