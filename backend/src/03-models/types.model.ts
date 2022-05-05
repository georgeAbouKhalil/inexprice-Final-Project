import { Document, Schema, model } from "mongoose";

export interface ITypesModel extends Document {
    name: string;
};

const TypesSchema = new Schema({
    name: {
        type: String,
        required: [true, "name is required"]
    }
}, {
    versionKey: false,
    id: false
});

export const TypesModel = model("TypesModel", TypesSchema, "Types");