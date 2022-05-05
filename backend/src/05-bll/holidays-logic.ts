import mongoose from "mongoose";
import ClientError from "../03-Models/client-error";
import { IHolidayModel, HolidayModel } from "../03-models/holidays-model";

// Get all:
async function getAllHolidays(): Promise<IHolidayModel[]> {

    // Get all Holidays without virtual fields:
    return HolidayModel.find().exec();

    // Get all Holiday with specific virtual fields:
    // return HolidayModel.find().populate("category").exec();
}

// Get one:
async function getOneHoliday(_id: string): Promise<IHolidayModel> {

    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`); // להיות יותר צדיק מאפיפיור...

    const holiday = await HolidayModel.findById(_id).exec();
    if (!holiday) throw new ClientError(404, `_id ${_id} not found`);

    return holiday;
}

// Insert:
async function addHoliday(holiday: IHolidayModel): Promise<IHolidayModel> {

    // Validation:
    const errors = holiday.validateSync();
    if (errors) throw new ClientError(400, errors.message);

    // Add:
    return holiday.save();
}

// Update:
async function updateHoliday(holiday: IHolidayModel): Promise<IHolidayModel> {

    if (!mongoose.Types.ObjectId.isValid(holiday._id)) throw new ClientError(404, `_id ${holiday._id} not valid`);

    // Validation:
    const errors = holiday.validateSync();
    if (errors) throw new ClientError(400, errors.message);

    // Update:
    const updatedHoliday = await HolidayModel.findByIdAndUpdate(holiday._id, holiday, { returnOriginal: false }).exec();
    if (!updatedHoliday) throw new ClientError(404, `_id ${holiday._id} not found`);

    // Return updated Holiday:
    return updatedHoliday;
}

// Delete:
async function deleteHoliday(_id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`);
    const deletedHoliday = await HolidayModel.findByIdAndDelete(_id).exec();
    if (!deletedHoliday) throw new ClientError(404, `_id ${_id} not found`);
}

// ------------------------------------------------------------------------------

// Mongo Query Language

// SELECT ___, ___, ___ FROM...
async function getPartialHoliday(): Promise<IHolidayModel[]> {

    // SELECT _id, name, price FROM Holidays
    // return HolidayModel.find({}, ["name", "price"]).exec();

    // SELECT name, price FROM Holidays
    return HolidayModel.find({}, { name: true, price: true, _id: false }).exec();
}

// SELECT * FROM Holidays WHERE ....
async function getSomeHolidays(): Promise<IHolidayModel[]> {

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
    return HolidayModel.find({ price: { $gte: 10, $lte: 20 } }, ["name", "price"], { sort: { price: 1, name: 1 } }).exec();
}

// SELECT * FROM Holidays LIMIT 20, 7
// (skip 20 items, get next 7 items)
async function getPagedHolidays(): Promise<IHolidayModel[]> {
    return HolidayModel.find({}, null, { skip: 20, limit: 7 }).exec();
}

// SELECT * FROM Holidays WHERE HolidayName LIKE '% %'
async function getHolidaysUsingRegex(): Promise<IHolidayModel[]> {
    return HolidayModel.find({ name: { $regex: /^.+ .+$/ } }).exec();
}

// INNER JOIN:
// return HolidayModel.find({ categoryId: { $ne: null }}).exec();

export default {
    getAllHolidays,
    getOneHoliday,
    addHoliday,
    updateHoliday,
    deleteHoliday,
    getPartialHoliday,
    getSomeHolidays,
    getPagedHolidays,
    getHolidaysUsingRegex
};
