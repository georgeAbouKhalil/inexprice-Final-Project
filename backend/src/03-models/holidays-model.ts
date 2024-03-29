import { Document, Schema, model } from "mongoose";
import { CategoryModel } from './category-model';

// Define model interface:
export interface IHolidayModel extends Document {
    // we don't define the _id because it exists by default.
    name: string;
    date: string;
    discount: number;
    end_date: string;
}

// Define model schema:
const HolidaySchema = new Schema<IHolidayModel>({
    name: {
        type: String,
        required: [true, "Missing name"],
        minlength: [2, "Name too short"],
        maxlength: [100, "Name too long"],
        trim: true,
    },
    date: {
        type: String,
        required: [true, "Missing date"],
    },
    discount: {
        type: Number,
        required: [true, "Missing discount"],
    },
    end_date: {
        type: String,
        required: [true, "Missing end date"],
    },
}, {
    versionKey: false, // Don't create __v field
    toJSON: { virtuals: true }, // Fill also the virtual fields when we're calling a "populate" function
    id: false, // Don't duplicate _id to id field
});

HolidaySchema.virtual("category", {
    ref: CategoryModel, // Which model are you describing
    localField: "categoryId", // Our model relation field
    foreignField: "_id", // Other model relation field
    justOne: true // each product has one category and not many
});

// Define model:
export const HolidayModel = model<IHolidayModel>("HolidayModel", HolidaySchema, "Holidays"); // model name, schema class, collection name
