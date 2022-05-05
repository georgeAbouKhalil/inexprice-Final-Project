import { Document, Schema, model } from "mongoose";

// Interface: 
export interface ICategoryModel extends Document {
    // we don't define the _id because it exists by default.
    name: string;
    description: string;
}

// Schema:
export const CategorySchema = new Schema<ICategoryModel>({
    name: {
        type: String,
        required: [true, "Missing name"],
        minlength: [2, "Name too short"],
        maxlength: [50, "Name too long"],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, "Missing description"],
        minlength: [2, "Description too short"],
        maxlength: [500, "Description too long"],
        trim: true
    }
});

// Model:
export const CategoryModel = model<ICategoryModel>("CategoryModel", CategorySchema, "categories");
