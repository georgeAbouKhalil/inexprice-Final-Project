import mongoose from "mongoose";
import ClientError from "../03-Models/client-error";
import { ICartModel, CartModel } from "../03-models/cart-model";

// Get all:
async function getAllCarts(): Promise<ICartModel[]> {

    // Get all products without virtual fields:
    return CartModel.find().exec();

    // Get all product with specific virtual fields:
    // return CartModel.find().populate("category").exec();
}

// Get one:
async function getOneCart(_id: string): Promise<ICartModel> {

    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`); // להיות יותר צדיק מאפיפיור...

    const product = await CartModel.findById(_id).exec();
    if (!product) throw new ClientError(404, `_id ${_id} not found`);

    return product;
}

// Insert:
async function addCart(product: ICartModel): Promise<ICartModel> {

    // Validation:
    const errors = product.validateSync();
    if (errors) throw new ClientError(400, errors.message);

    // Add:
    return product.save();
}

// Update:
async function updateCart(product: ICartModel): Promise<ICartModel> {

    if (!mongoose.Types.ObjectId.isValid(product._id)) throw new ClientError(404, `_id ${product._id} not valid`);

    // Validation:
    const errors = product.validateSync();
    if (errors) throw new ClientError(400, errors.message);

    // Update:
    const updatedProduct = await CartModel.findByIdAndUpdate(product._id, product, { returnOriginal: false }).exec();
    if (!updatedProduct) throw new ClientError(404, `_id ${product._id} not found`);

    // Return updated product:
    return updatedProduct;
}

// Delete:
async function deleteCart(_id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`);
    const deletedProduct = await CartModel.findByIdAndDelete(_id).exec();
    if (!deletedProduct) throw new ClientError(404, `_id ${_id} not found`);
}

// ------------------------------------------------------------------------------

// Mongo Query Language

// SELECT ___, ___, ___ FROM...
async function getPartialProducts(): Promise<ICartModel[]> {

    // SELECT _id, name, price FROM Products
    // return CartModel.find({}, ["name", "price"]).exec();

    // SELECT name, price FROM Products
    return CartModel.find({}, { name: true, price: true, _id: false }).exec();
}

// SELECT * FROM Products WHERE ....
async function getSomeProducts(): Promise<ICartModel[]> {

    // SELECT * FROM Products WHERE price = 10
    // return CartModel.find({ price: 10 }).exec();

    // SELECT * FROM Products WHERE price = 10 AND name = 'Longlife Tofu'
    // return CartModel.find({ price: 10, name: 'Longlife Tofu' }).exec();

    // SELECT * FROM Products WHERE price = 10 OR name = 'Chai'
    // return CartModel.find({ $or: [{ price: 10 }, { name: "Chai" }] }).exec();

    // SELECT * FROM Products WHERE price BETWEEN 10 AND 20
    // >    $gt
    // >=   $gte
    // <    $lt
    // <=   $lte
    // ==   $eq
    // !=   $ne
    // return CartModel.find({ price: { $gte: 10, $lte: 20 }}).exec();

    // SELECT * FROM Products ORDER BY price
    // return CartModel.find({}, null, { sort: { price: 1 } }).exec();

    // SELECT * FROM Products ORDER BY price DESC
    // return CartModel.find({}, null, { sort: { price: -1 } }).exec();

    // SELECT * FROM Products ORDER BY price, name
    // return CartModel.find({}, null, { sort: { price: 1, name: 1 } }).exec();

    // SELECT _id, name, price FROM Products WHERE price BETWEEN 10 AND 20 ORDER BY price, name
    return CartModel.find({ price: { $gte: 10, $lte: 20 } }, ["name", "price"], { sort: { price: 1, name: 1 } }).exec();
}

// SELECT * FROM Products LIMIT 20, 7
// (skip 20 items, get next 7 items)
async function getPagedProducts(): Promise<ICartModel[]> {
    return CartModel.find({}, null, { skip: 20, limit: 7 }).exec();
}

// SELECT * FROM Products WHERE ProductName LIKE '% %'
async function getProductsUsingRegex(): Promise<ICartModel[]> {
    return CartModel.find({ name: { $regex: /^.+ .+$/ } }).exec();
}

// INNER JOIN:
// return CartModel.find({ categoryId: { $ne: null }}).exec();

export default {
    getAllCarts,
    getOneCart,
    addCart,
    updateCart,
    deleteCart,
    getPartialProducts,
    getSomeProducts,
    getPagedProducts,
    getProductsUsingRegex
};
