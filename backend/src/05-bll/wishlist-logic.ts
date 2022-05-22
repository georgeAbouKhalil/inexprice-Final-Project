import mongoose from "mongoose";
import ClientError from "../03-Models/client-error";
import { IWishListModel, WishListModel } from "../03-models/wishlist-model";

// Get all:
async function getAllWishLists(): Promise<IWishListModel[]> {

    // Get all products without virtual fields:
    return WishListModel.find().exec();
    // return WishListModel.find().populate("user");

    // Get all product with specific virtual fields:
    // return WishListModel.find().populate("category").exec();
}

// Get one:
async function getOneWishList(_id: string): Promise<IWishListModel> {

    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`); // להיות יותר צדיק מאפיפיור...

    // const WishList = await WishListModel.findById(_id).populate("user").exec();
    const wishList = await WishListModel.findById(_id).exec();
    if (!wishList) throw new ClientError(404, `_id ${_id} not found`);

    return wishList;
}

async function getWishListByUserId(userId: string): Promise<IWishListModel | any> {
    // Validate _id:
    if (!mongoose.isValidObjectId(userId)) throw new ClientError(404, `user_id ${userId} is invalid`);

    const wishLists = await WishListModel.find({"userId": userId }).populate("product").exec();
    // const WishList = await WishListModel.findOne({"user_id": user_id}).populate("user").exec();

    // // Validate WishList existence:
    // if(WishList.length === 0) throw new ClientError(404, "Current user has no WishList");
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

// ------------------------------------------------------------------------------

// Mongo Query Language

// SELECT ___, ___, ___ FROM...
async function getPartialProducts(): Promise<IWishListModel[]> {

    // SELECT _id, name, price FROM Products
    // return WishListModel.find({}, ["name", "price"]).exec();

    // SELECT name, price FROM Products
    return WishListModel.find({}, { name: true, price: true, _id: false }).exec();
}

// SELECT * FROM Products WHERE ....
async function getSomeProducts(): Promise<IWishListModel[]> {

    // SELECT * FROM Products WHERE price = 10
    // return WishListModel.find({ price: 10 }).exec();

    // SELECT * FROM Products WHERE price = 10 AND name = 'Longlife Tofu'
    // return WishListModel.find({ price: 10, name: 'Longlife Tofu' }).exec();

    // SELECT * FROM Products WHERE price = 10 OR name = 'Chai'
    // return WishListModel.find({ $or: [{ price: 10 }, { name: "Chai" }] }).exec();

    // SELECT * FROM Products WHERE price BETWEEN 10 AND 20
    // >    $gt
    // >=   $gte
    // <    $lt
    // <=   $lte
    // ==   $eq
    // !=   $ne
    // return WishListModel.find({ price: { $gte: 10, $lte: 20 }}).exec();

    // SELECT * FROM Products ORDER BY price
    // return WishListModel.find({}, null, { sort: { price: 1 } }).exec();

    // SELECT * FROM Products ORDER BY price DESC
    // return WishListModel.find({}, null, { sort: { price: -1 } }).exec();

    // SELECT * FROM Products ORDER BY price, name
    // return WishListModel.find({}, null, { sort: { price: 1, name: 1 } }).exec();

    // SELECT _id, name, price FROM Products WHERE price BETWEEN 10 AND 20 ORDER BY price, name
    return WishListModel.find({ price: { $gte: 10, $lte: 20 } }, ["name", "price"], { sort: { price: 1, name: 1 } }).exec();
}

// SELECT * FROM Products LIMIT 20, 7
// (skip 20 items, get next 7 items)
async function getPagedProducts(): Promise<IWishListModel[]> {
    return WishListModel.find({}, null, { skip: 20, limit: 7 }).exec();
}

// SELECT * FROM Products WHERE ProductName LIKE '% %'
async function getProductsUsingRegex(): Promise<IWishListModel[]> {
    return WishListModel.find({ name: { $regex: /^.+ .+$/ } }).exec();
}

// INNER JOIN:
// return WishListModel.find({ categoryId: { $ne: null }}).exec();

export default {
    getAllWishLists,
    getOneWishList,
    addWishList,
    updateWishList,
    deleteWishList,
    getPartialProducts,
    getSomeProducts,
    getPagedProducts,
    getProductsUsingRegex,
    getWishListByUserId
};
