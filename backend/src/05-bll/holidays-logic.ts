import mongoose from "mongoose";
import ClientError from "../03-Models/client-error";
import { IHolidayModel, HolidayModel } from "../03-models/holidays-model";

// Get all:
async function getAllHolidays(): Promise<IHolidayModel[]> {
    // Get all Holidays without virtual fields:
    return HolidayModel.find().exec();
}

// Get one:
async function getOneHoliday(_id: string): Promise<IHolidayModel> {

    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`); 

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

export default {
    getAllHolidays,
    getOneHoliday,
    addHoliday,
    updateHoliday,
    deleteHoliday,
};
