import mongoose from "mongoose";
import ClientError from "../03-Models/client-error";
import { IWishListModel, WishListModel } from "../03-models/wishlist-model";

// Get all:
async function getAllWishLists(): Promise<IWishListModel[]> {
    // Get all products without virtual fields:
    return WishListModel.find().exec();
}

// Get one:
async function getOneWishList(_id: string): Promise<IWishListModel> {

    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`); 
    const wishList = await WishListModel.findById(_id).exec();
    if (!wishList) throw new ClientError(404, `_id ${_id} not found`);

    return wishList;
}

async function getWishListByUserId(userId: string): Promise<IWishListModel | any> {
    // Validate _id:
    if (!mongoose.isValidObjectId(userId)) throw new ClientError(404, `user_id ${userId} is invalid`);

    const wishLists = await WishListModel.find({"userId": userId }).populate("product").exec();
    return wishLists;
}

// Insert:
async function addWishList(WishList: IWishListModel): Promise<IWishListModel> {

    // Validation:
    const errors = WishList.validateSync();
    if (errors) throw new ClientError(400, errors.message);

    // Add:
    return WishList.save();
}

// Update:
async function updateWishList(wishList: IWishListModel): Promise<IWishListModel> {

    if (!mongoose.Types.ObjectId.isValid(wishList._id)) throw new ClientError(404, `_id ${wishList._id} not valid`);

    // Validation:
    const errors = wishList.validateSync();
    if (errors) throw new ClientError(400, errors.message);

    // Update:
    const updatedWishList = await WishListModel.findByIdAndUpdate(wishList._id, wishList, { returnOriginal: false }).exec();
    if (!updatedWishList) throw new ClientError(404, `_id ${wishList._id} not found`);

    // Return updated WishList:
    return updatedWishList;
}

// Delete:
async function deleteWishList(_id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`);
    const deletedWishList = await WishListModel.findByIdAndDelete(_id).exec();
    if (!deletedWishList) throw new ClientError(404, `_id ${_id} not found`);
}

export default {
    getAllWishLists,
    getOneWishList,
    addWishList,
    updateWishList,
    deleteWishList,
    getWishListByUserId
};
