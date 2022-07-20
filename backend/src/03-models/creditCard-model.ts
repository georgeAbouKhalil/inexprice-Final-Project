import { Document, Schema, model } from "mongoose";
import { UserModel } from "./user-model";

// Define model interface:
export interface ICreditCardModel extends Document {
    // we don't define the _id because it exists by default.
    user_id: Schema.Types.ObjectId;
    card_number:string;
    card_holder:string;
    cvv:string;
    date_mm:string;
    date_yyyy:string;
}

// Define model schema:
const CreditCardSchema = new Schema<ICreditCardModel>({
    user_id: {
        type: Schema.Types.ObjectId,
        required: [true, "Missing user_id"]
    },
    card_number: {
        type: String,
        required: [true, "Missing card_number"],
        unique: true
    },
    card_holder: {
        type: String,
        required: [true, "Missing card_holder"],
        trim: true,
    },
    cvv: {
        type: String,
        required: [true, "Missing cvv"],
    },
    date_mm: {
        type: String,
        required: [true, "Missing date_mm"],

    },
    date_yyyy: {
        type: String,
        required: [true, "Missing date"],
    }

}, { 
    versionKey: false, // Don't create __v field
    toJSON: { virtuals: true }, // Fill also the virtual fields when we're calling a "populate" function
    id: false, // Don't duplicate _id to id field
});

CreditCardSchema.virtual("user", {
    ref: UserModel, // Which model are you describing
    localField: "user_id", // Our model relation field
    foreignField: "_id", // Other model relation field
    justOne: true // each product has one category and not many
});

// Define model:
export const CreditCardModel = model<ICreditCardModel>("CreditCardModel", CreditCardSchema, "credit_cards"); // model name, schema class, collection name
