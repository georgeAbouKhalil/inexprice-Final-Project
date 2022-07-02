import { Document, Schema, model } from "mongoose";
import { CategoryModel } from './category-model';
import { TypesModel } from "./types.model";

// Define model interface:
export interface IProductModel extends Document {
    // we don't define the _id because it exists by default.
    type: Schema.Types.ObjectId;
    brand: string;
    name: string;
    size: string;
    color: string;
    img: string;
    price: number;
    description: string;
    inStock: number;
    discount: number;
    wishlist: boolean;
    // p_id: number; //delete this
    // categoryId: Schema.Types.ObjectId;
}

// Define model schema:
const ProductSchema = new Schema<IProductModel>({
    type: {
        type: Schema.Types.ObjectId,
        required: [true, "Missing category/type"]
        // minlength: [2, "Name too short"],
        // maxlength: [100, "Name too long"],
        // trim: true,
        // unique: true
    },
    brand: {
        type: String,
        required: [true, "Missing brand"],
        min: [0, "brand can't be negative"],
        max: [1000, "brand can't exceed 1000"]
    },
    name: {
        type: String,
        required: [true, "Missing name"],
        min: [0, "name can't be negative"],
        max: [1000, "name can't exceed 1000"]
    },
    size: {
        type: String,
        required: [true, "Missing size"],
        min: [0, "size can't be negative"],
        max: [1000, "size can't exceed 1000"]
    },
    color: {
        type: String,
        required: [true, "Missing color"],
        min: [0, "color can't be negative"],
        max: [1000, "color can't exceed 1000"]
    },
    img: {
        type: String,
        required: [true, "Missing img"],
        min: [0, "img can't be negative"],
        max: [1000, "img can't exceed 1000"]
    },
    price: {
        type: Number,
        required: [true, "Missing price"],
        min: [0, "Price can't be negative"],
    },
    description: {
        type: String,
        required: [true, "Missing description"],
        min: [0, "description can't be negative"],
        max: [1000, "description can't exceed 1000"]
    },
    inStock: {
        type: Number,
        required: [true, "Missing inStock"],
        min: [0, "inStock can't be negative"],
        max: [1000, "inStock can't exceed 1000"]
    },
    discount: {
        type: Number,
        required: [true, "Missing discount"],
        min: [0, "discount can't be negative"],
        max: [1000, "discount can't exceed 1000"]
    },
    wishlist: {
        type: Boolean,
    },
}, { 
    versionKey: false, // Don't create __v field
    toJSON: { virtuals: true }, // Fill also the virtual fields when we're calling a "populate" function
    id: false, // Don't duplicate _id to id field
    // timestamps: true // 01/01/1970 12:00:00
});

ProductSchema.virtual("category", {
    ref: TypesModel, // Which model are you describing
    localField: "type", // Our model relation field
    foreignField: "_id", // Other model relation field
    justOne: true // One-to-Many relation --> each product has one category and not many
});

// Define model:
export const ProductModel = model<IProductModel>("ProductModel", ProductSchema, "Product"); // model name, schema class, collection name
