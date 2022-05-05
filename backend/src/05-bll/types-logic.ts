import ClientError from '../03-models/client-error';
import mongoose from 'mongoose';
import { TypesModel, ITypesModel } from '../03-models/types.model';

async function getAllTypes(): Promise<ITypesModel[]> {
    return TypesModel.find().exec();
}

async function getOneType(_id: string): Promise<ITypesModel> {
    // Validate _id:
    if (!mongoose.isValidObjectId(_id)) throw new ClientError(404, `_id ${_id} is invalid`);

    const type = await TypesModel.findById(_id).exec();

    // Validate Type existence:
    if(!type) throw new ClientError(404, "Type not found");

    return type;
}

async function addType(type: ITypesModel): Promise<ITypesModel> {
    // Validate Type:
    const errors = type.validateSync();
    if(errors) throw new ClientError(400, errors.message);

    // Save:
    const addedType = type.save();
    return addedType;
}

async function updateType(type: ITypesModel): Promise<ITypesModel> {
    // Validate Type:
    const errors = type.validateSync();
    if(errors) throw new ClientError(400, errors.message);

    // update:
    const updatedType = await TypesModel.findByIdAndUpdate(type._id, type, {returnOriginal: false}).exec();

    // Validate if user exist in DB:
    if(!updatedType) throw new ClientError(404, "user is not found");

    return updatedType;
}

async function getProductsByTypeId(_id: string): Promise<[]> {
    return [];
}

async function deleteType(_id: string) {
    // Validate _id:
    if(!mongoose.isValidObjectId(_id)) throw new ClientError(404, `_id ${_id} is not valid`);

    // Validate Type empty:
    const prodByTypeId = await getProductsByTypeId(_id);
    if(prodByTypeId.length !== 0) throw new ClientError(400, "There are still some products in that Type, you cannot delete it until its empty");

    // Delete:
    const deletedType = await TypesModel.findByIdAndDelete(_id);

    // Validate Type found:
    if(!deletedType) throw new ClientError(404, "Type not found");
}

export default {
    getAllTypes,
    getOneType,
    addType,
    updateType,
    deleteType
}