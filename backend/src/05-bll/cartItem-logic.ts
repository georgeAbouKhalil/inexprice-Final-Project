import mongoose from "mongoose";
import ClientError from "../03-Models/client-error";
import { ICartItemModel, CartItemModel } from "../03-models/cartItem-model";

// Get all:
async function getAllCartItem(): Promise<ICartItemModel[]> {

    // Get all products without virtual fields:
    return CartItemModel.find().exec();

    // Get all product with specific virtual fields:
    // return CartItemModel.find().populate("category").exec();
}

// Get one:
async function getOneCartItem(_id: string): Promise<ICartItemModel> {

    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`); // להיות יותר צדיק מאפיפיור...

    const product = await CartItemModel.findById(_id).exec();
    if (!product) throw new ClientError(404, `_id ${_id} not found`);

    return product;
}

// Insert:
async function addCartItem(product: ICartItemModel): Promise<ICartItemModel> {

    // Validation:
    const errors = product.validateSync();
    if (errors) throw new ClientError(400, errors.message);

    // Add:
    return product.save();
}

// Update:
async function updateCartItem(product: ICartItemModel): Promise<ICartItemModel> {

    if (!mongoose.Types.ObjectId.isValid(product._id)) throw new ClientError(404, `_id ${product._id} not valid`);

    // Validation:
    const errors = product.validateSync();
    if (errors) throw new ClientError(400, errors.message);

    // Update:
    const updatedProduct = await CartItemModel.findByIdAndUpdate(product._id, product, { returnOriginal: false }).exec();
    if (!updatedProduct) throw new ClientError(404, `_id ${product._id} not found`);

    // Return updated product:
    return updatedProduct;
}

// Delete:
async function deleteCartItem(_id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`);
    const deletedProduct = await CartItemModel.findByIdAndDelete(_id).exec();
    if (!deletedProduct) throw new ClientError(404, `_id ${_id} not found`);
}

// ------------------------------------------------------------------------------

// Mongo Query Language

// SELECT ___, ___, ___ FROM...
async function getPartialProducts(): Promise<ICartItemModel[]> {

    // SELECT _id, name, price FROM Products
    // return CartItemModel.find({}, ["name", "price"]).exec();

    // SELECT name, price FROM Products
    return CartItemModel.find({}, { name: true, price: true, _id: false }).exec();
}

// SELECT * FROM Products WHERE ....
async function getSomeProducts(): Promise<ICartItemModel[]> {

    // SELECT * FROM Products WHERE price = 10
    // return CartItemModel.find({ price: 10 }).exec();

    // SELECT * FROM Products WHERE price = 10 AND name = 'Longlife Tofu'
    // return CartItemModel.find({ price: 10, name: 'Longlife Tofu' }).exec();

    // SELECT * FROM Products WHERE price = 10 OR name = 'Chai'
    // return CartItemModel.find({ $or: [{ price: 10 }, { name: "Chai" }] }).exec();

    // SELECT * FROM Products WHERE price BETWEEN 10 AND 20
    // >    $gt
    // >=   $gte
    // <    $lt
    // <=   $lte
    // ==   $eq
    // !=   $ne
    // return CartItemModel.find({ price: { $gte: 10, $lte: 20 }}).exec();

    // SELECT * FROM Products ORDER BY price
    // return CartItemModel.find({}, null, { sort: { price: 1 } }).exec();

    // SELECT * FROM Products ORDER BY price DESC
    // return CartItemModel.find({}, null, { sort: { price: -1 } }).exec();

    // SELECT * FROM Products ORDER BY price, name
    // return CartItemModel.find({}, null, { sort: { price: 1, name: 1 } }).exec();

    // SELECT _id, name, price FROM Products WHERE price BETWEEN 10 AND 20 ORDER BY price, name
    return CartItemModel.find({ price: { $gte: 10, $lte: 20 } }, ["name", "price"], { sort: { price: 1, name: 1 } }).exec();
}

// SELECT * FROM Products LIMIT 20, 7
// (skip 20 items, get next 7 items)
async function getPagedProducts(): Promise<ICartItemModel[]> {
    return CartItemModel.find({}, null, { skip: 20, limit: 7 }).exec();
}

// SELECT * FROM Products WHERE ProductName LIKE '% %'
async function getProductsUsingRegex(): Promise<ICartItemModel[]> {
    return CartItemModel.find({ name: { $regex: /^.+ .+$/ } }).exec();
}

// INNER JOIN:
// return CartItemModel.find({ categoryId: { $ne: null }}).exec();

export default {
    getAllCartItem,
    getOneCartItem,
    addCartItem,
    updateCartItem,
    deleteCartItem,
    getPartialProducts,
    getSomeProducts,
    getPagedProducts,
    getProductsUsingRegex
};
