import mongoose from "mongoose";
import ClientError from "../03-Models/client-error";
import { CreditCardModel, ICreditCardModel } from "../03-models/creditCard-model";

// Get all:
async function getAllCreditCards(): Promise<ICreditCardModel[]> {
    // Get all Holidays without virtual fields:
    return CreditCardModel.find().exec();

}

 // Get all CreditCard by user ID
async function getAllCreditCardsByUserId(user_id: string): Promise<ICreditCardModel[]> {
    return await CreditCardModel.find({"user_id": user_id}).exec();
}

// Get one:
async function getOneCreditCard(_id: string): Promise<ICreditCardModel> {

    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`); 

    const creditcard = await CreditCardModel.findById(_id).exec();
    if (!creditcard) throw new ClientError(404, `_id ${_id} not found`);

    return creditcard;
}

// Insert:
async function addCreditCard(creditcard: ICreditCardModel): Promise<ICreditCardModel> {

    // Validation:
    const errors = creditcard.validateSync();
    if (errors) throw new ClientError(400, errors.message);

    // Add:
    return creditcard.save();
}

// Update:
async function updateCreditcard(creditcard: ICreditCardModel): Promise<ICreditCardModel> {

    if (!mongoose.Types.ObjectId.isValid(creditcard._id)) throw new ClientError(404, `_id ${creditcard._id} not valid`);

    // Validation:
    const errors = creditcard.validateSync();
    if (errors) throw new ClientError(400, errors.message);

    // Update:
    const updatedCreditcard = await CreditCardModel.findByIdAndUpdate(creditcard._id, creditcard, { returnOriginal: false }).exec();
    if (!updatedCreditcard) throw new ClientError(404, `_id ${creditcard._id} not found`);

    // Return updated Holiday:
    return updatedCreditcard;
}

// Delete:
async function deleteCreditcard(_id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`);
    const deletedCreditcard = await CreditCardModel.findByIdAndDelete(_id).exec();
    if (!deletedCreditcard) throw new ClientError(404, `_id ${_id} not found`);
}

export default {
    getAllCreditCards,
    getOneCreditCard,
    addCreditCard,
    updateCreditcard,
    deleteCreditcard,
    getAllCreditCardsByUserId
};
