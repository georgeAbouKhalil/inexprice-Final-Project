import mongoose from "mongoose";
import ClientError from "../03-Models/client-error";
import { CreditCardModel, ICreditCardModel } from "../03-models/creditCard-model";

// Get all:
async function getAllCreditCards(): Promise<ICreditCardModel[]> {

    // Get all Holidays without virtual fields:
    return CreditCardModel.find().exec();

    // Get all Holiday with specific virtual fields:
    // return HolidayModel.find().populate("category").exec();
}

// Get one:
async function getOneCreditCard(_id: string): Promise<ICreditCardModel> {

    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`); // להיות יותר צדיק מאפיפיור...

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
// ------------------------------------------------------------------------------

// Mongo Query Language

// SELECT ___, ___, ___ FROM...
async function getPartialCreditCard(): Promise<ICreditCardModel[]> {

    // SELECT _id, name, price FROM Holidays
    // return HolidayModel.find({}, ["name", "price"]).exec();

    // SELECT name, price FROM Holidays
    return CreditCardModel.find({}, { name: true, price: true, _id: false }).exec();
}

// SELECT * FROM Holidays WHERE ....
async function getSomeCreditCards(): Promise<ICreditCardModel[]> {

    // SELECT * FROM Holidays WHERE price = 10
    // return HolidayModel.find({ price: 10 }).exec();

    // SELECT * FROM Holidays WHERE price = 10 AND name = 'Longlife Tofu'
    // return HolidayModel.find({ price: 10, name: 'Longlife Tofu' }).exec();

    // SELECT * FROM Holidays WHERE price = 10 OR name = 'Chai'
    // return HolidayModel.find({ $or: [{ price: 10 }, { name: "Chai" }] }).exec();

    // SELECT * FROM Holidays WHERE price BETWEEN 10 AND 20
    // >    $gt
    // >=   $gte
    // <    $lt
    // <=   $lte
    // ==   $eq
    // !=   $ne
    // return HolidayModel.find({ price: { $gte: 10, $lte: 20 }}).exec();

    // SELECT * FROM Holidays ORDER BY price
    // return HolidayModel.find({}, null, { sort: { price: 1 } }).exec();

    // SELECT * FROM Holidays ORDER BY price DESC
    // return HolidayModel.find({}, null, { sort: { price: -1 } }).exec();

    // SELECT * FROM Holidays ORDER BY price, name
    // return HolidayModel.find({}, null, { sort: { price: 1, name: 1 } }).exec();

    // SELECT _id, name, price FROM Holidays WHERE price BETWEEN 10 AND 20 ORDER BY price, name
    return CreditCardModel.find({ price: { $gte: 10, $lte: 20 } }, ["name", "price"], { sort: { price: 1, name: 1 } }).exec();
}

// SELECT * FROM Holidays LIMIT 20, 7
// (skip 20 items, get next 7 items)
async function getPagedCreditCards(): Promise<ICreditCardModel[]> {
    return CreditCardModel.find({}, null, { skip: 20, limit: 7 }).exec();
}

// SELECT * FROM Holidays WHERE HolidayName LIKE '% %'
async function getCreditCardsUsingRegex(): Promise<ICreditCardModel[]> {
    return CreditCardModel.find({ name: { $regex: /^.+ .+$/ } }).exec();
}

// INNER JOIN:
// return HolidayModel.find({ categoryId: { $ne: null }}).exec();

export default {
    getAllCreditCards,
    getOneCreditCard,
    addCreditCard,
    updateCreditcard,
    deleteCreditcard,
    getPartialCreditCard,
    getSomeCreditCards,
    getPagedCreditCards,
    getCreditCardsUsingRegex
};
