import { Document, Schema, model } from "mongoose";

// Define model interface:
export interface IUserModel extends Document {
    // we don't define the _id because it exists by default.+
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    birthday: string;
    country: string;
    userName: string;
    password: string;
    gender: string;
    business: string;
    role: string;
    phone: string;

}

// Define model schema:
const UserSchema = new Schema<IUserModel>({
    firstName: {
        type: String,
        required: [true,"firstName is required"],
        minlength: [2, "firstName must be min 2 chars"],
        maxlength: [10, "firstName must be max 10 chars"],
        trim: true
    },
    lastName: {
        type: String,
        required: [true,"lastName is required"],
        minlength: [2, "lastName must be min 2 chars"],
        maxlength: [15, "lastName must be max 15 chars"],
        trim: true
    },
    phone: {
        type: String,
        required: [true, "phone is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        match: [/^(.+)@(.+)$/, "invalid email structure"],
        unique: true
    },
    address: {
        type: String,
        required: [true,"Address is required"],
        minlength: [4, "Address must be min 2 chars"],
        maxlength: [10, "Address must be max 15 chars"],
    },
    city: {
        type: String,
        required: [true,"City is required"],
        minlength: [4, "City must be min 2 chars"],
        maxlength: [10, "City must be max 15 chars"],
    },
    birthday: {
        type: String,
        required: [true, "birthday is required"]
    },
    country: {
        type: String,
        required: [true, "country is required"]
    },
    userName: {
        type: String,
        required: [true,"username is required"],
        minlength: [2, "username must be min 2 chars"],
        maxlength: [15, "username must be max 15 chars"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true,"password is required"],
        minlength: [4, "password must be min 2 chars"],
        maxlength: [10, "password must be max 15 chars"],
    },
    gender: {
        type: String,
        required: [true, "gender is required"]
    },
    business: {
        type: String,
        required: [true, "business is required"]
    },
    role: {
        type: String
    },
}, { 
    versionKey: false, // Don't create __v field
    toJSON: { virtuals: true }, // Fill also the virtual fields when we're calling a "populate" function
    id: false, // Don't duplicate _id to id field
});


// Define model:
export const UserModel = model<IUserModel>("UserModel", UserSchema, "Users"); // model name, schema class, collection name
