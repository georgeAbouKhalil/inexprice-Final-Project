import { CartModel } from './../../../client/src/app/models/cart.model';
import mongoose from "mongoose";
import ClientError from "../03-Models/client-error";
import { IOrderModel, OrderModel } from "../03-models/order-model";

// Get all:
async function getAllOrders(): Promise<IOrderModel[]> {
    // Get all products without virtual fields:
    return OrderModel.find().exec();
}

 // Get all Orders by user ID
 async function getAllOrdersByUserId(user_id: string): Promise<IOrderModel[]> {
    return await OrderModel.find({"user_id": user_id}).exec();
}

// Get one:
async function getOneOrder(_id: string): Promise<IOrderModel> {

    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`); // להיות יותר צדיק מאפיפיור...

    const product = await OrderModel.findById(_id).exec();
    if (!product) throw new ClientError(404, `_id ${_id} not found`);

    return product;
}

// Insert:
async function addOrder(product: IOrderModel): Promise<IOrderModel> {

    // Validation:
    const errors = product.validateSync();
    if (errors) throw new ClientError(400, errors.message);

    // Add:
    return product.save();
}

// Update:
async function updateOrder(product: IOrderModel): Promise<IOrderModel> {

    if (!mongoose.Types.ObjectId.isValid(product._id)) throw new ClientError(404, `_id ${product._id} not valid`);

    // Validation:
    const errors = product.validateSync();
    if (errors) throw new ClientError(400, errors.message);

    // Update:
    const updatedProduct = await OrderModel.findByIdAndUpdate(product._id, product, { returnOriginal: false }).exec();
    if (!updatedProduct) throw new ClientError(404, `_id ${product._id} not found`);

    // Return updated product:
    return updatedProduct;
}

// Delete:
async function deleteOrder(_id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`);
    const deletedProduct = await OrderModel.findByIdAndDelete(_id).exec();
    if (!deletedProduct) throw new ClientError(404, `_id ${_id} not found`);
}




// ------------------------------------------------------------------------------

// Mongo Query Language

// SELECT ___, ___, ___ FROM...
async function getPartialProducts(): Promise<IOrderModel[]> {

    // SELECT _id, name, price FROM Products
    // return OrderModel.find({}, ["name", "price"]).exec();

    // SELECT name, price FROM Products
    return OrderModel.find({}, { name: true, price: true, _id: false }).exec();
}

// SELECT * FROM Products WHERE ....
async function getSomeProducts(): Promise<IOrderModel[]> {

    // SELECT * FROM Products WHERE price = 10
    // return OrderModel.find({ price: 10 }).exec();

    // SELECT * FROM Products WHERE price = 10 AND name = 'Longlife Tofu'
    // return OrderModel.find({ price: 10, name: 'Longlife Tofu' }).exec();

    // SELECT * FROM Products WHERE price = 10 OR name = 'Chai'
    // return OrderModel.find({ $or: [{ price: 10 }, { name: "Chai" }] }).exec();

    // SELECT * FROM Products WHERE price BETWEEN 10 AND 20
    // >    $gt
    // >=   $gte
    // <    $lt
    // <=   $lte
    // ==   $eq
    // !=   $ne
    // return OrderModel.find({ price: { $gte: 10, $lte: 20 }}).exec();

    // SELECT * FROM Products ORDER BY price
    // return OrderModel.find({}, null, { sort: { price: 1 } }).exec();

    // SELECT * FROM Products ORDER BY price DESC
    // return OrderModel.find({}, null, { sort: { price: -1 } }).exec();

    // SELECT * FROM Products ORDER BY price, name
    // return OrderModel.find({}, null, { sort: { price: 1, name: 1 } }).exec();

    // SELECT _id, name, price FROM Products WHERE price BETWEEN 10 AND 20 ORDER BY price, name
    return OrderModel.find({ price: { $gte: 10, $lte: 20 } }, ["name", "price"], { sort: { price: 1, name: 1 } }).exec();
}

// SELECT * FROM Products LIMIT 20, 7
// (skip 20 items, get next 7 items)
async function getPagedProducts(): Promise<IOrderModel[]> {
    return OrderModel.find({}, null, { skip: 20, limit: 7 }).exec();
}

// SELECT * FROM Products WHERE ProductName LIKE '% %'
async function getProductsUsingRegex(): Promise<IOrderModel[]> {
    return OrderModel.find({ name: { $regex: /^.+ .+$/ } }).exec();
}

// INNER JOIN:
// return OrderModel.find({ categoryId: { $ne: null }}).exec();

export default {
    getAllOrders,
    getOneOrder,
    addOrder,
    updateOrder,
    deleteOrder,
    getAllOrdersByUserId,
    getPartialProducts,
    getSomeProducts,
    getPagedProducts,
    getProductsUsingRegex
};
