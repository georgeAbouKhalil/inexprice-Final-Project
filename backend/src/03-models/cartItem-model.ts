import { Document, Schema, model } from "mongoose";
import { CartModel } from "./cart-model";
import { CategoryModel } from './category-model';
import { ProductModel } from "./product-model";

// Define model interface:
export interface ICartItemModel extends Document {
    // we don't define the _id because it exists by default.
    quantity: number;
    totalPrice: number;
    cart_id: Schema.Types.ObjectId;
    product_id: Schema.Types.ObjectId;
    discount: number;
    price:number;
    name: string;
    img: string;
    itemPrice: number

}

// Define model schema:
const CartItemSchema = new Schema<ICartItemModel>({
    quantity: {
        type: Number,
        required: [true, "Missing quantity"],
        min: [0, "quantity can't be negative"],
        max: [1000, "quantity can't exceed 1000"]
    },
    totalPrice: {
        type: Number,
    },
    cart_id: {
        type: Schema.Types.ObjectId,
        required: [true, "Missing cart_id"]

    },
    product_id: {
        type: Schema.Types.ObjectId,
        required: [true, "Missing product_id"]

    }
}, {
    versionKey: false, // Don't create __v field
    toJSON: { virtuals: true }, // Fill also the virtual fields when we're calling a "populate" function
    id: false, // Don't duplicate _id to id field
    // timestamps: true // 01/01/1970 12:00:00
});

CartItemSchema.virtual("cart", {
    ref: CartModel, // Which model are you describing
    localField: "cart_id", // Our model relation field
    foreignField: "_id", // Other model relation field
    justOne: true // One-to-Many relation --> each product has one category and not many
});

CartItemSchema.virtual("product", {
    ref: ProductModel, // Which model are you describing
    localField: "product_id", // Our model relation field
    foreignField: "_id", // Other model relation field
    justOne: true // One-to-Many relation --> each product has one category and not many
});

// Define model:
export const CartItemModel = model<ICartItemModel>("CartItemModel", CartItemSchema, "Cart_item"); // model name, schema class, collection name
