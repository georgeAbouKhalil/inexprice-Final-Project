import { IMessageModel, MessageModel } from './../03-models/message-model';
import mongoose from "mongoose";
import ClientError from "../03-Models/client-error";
import { ICartModel, CartModel } from "../03-models/cart-model";

// Get all:
async function getAllCarts(): Promise<ICartModel[]> {

    return CartModel.find().exec();

}

// Get one:
async function getOneMsg(_id: string): Promise<IMessageModel> {

    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`);
    const msg = await MessageModel.findById(_id).exec();
    if (!msg) throw new ClientError(404, `_id ${_id} not found`);

    return msg;
}

// Get latest added message:
async function getLatestMsg(): Promise<IMessageModel | any> {

    const lastMsg = await MessageModel.find({}).sort({_id:-1}).limit(1);
    return lastMsg[0];

}

async function getMsgByUserId(userId: string): Promise<IMessageModel | any> {

    // Validate _id:
    if (!mongoose.isValidObjectId(userId)) throw new ClientError(404, `user_id ${userId} is invalid`);

    const msgs = await MessageModel.find({ $or: [{ "userId": userId }, { "toUser": userId }] }).populate("user").exec();
    return msgs;
}

// get all users that have msg in database
async function getAllMsgUsers(): Promise<IMessageModel[]> {

    // get the userName without duplication
    return MessageModel.aggregate([
        {
            $group: {
                _id: {
                    userId: "$userId",
                    userName: "$userName",
                },
            },
            

        },
    ]);




}
























// Insert:
async function addMessage(message: IMessageModel): Promise<IMessageModel> {

    // Validation:
    const errors = message.validateSync();
    if (errors) throw new ClientError(400, errors.message);

    // socketLogic.newMessage(message);
    // Add:
    return message.save();
}

// Update:
async function updateCart(cart: ICartModel): Promise<ICartModel> {

    if (!mongoose.Types.ObjectId.isValid(cart._id)) throw new ClientError(404, `_id ${cart._id} not valid`);

    // Validation:
    const errors = cart.validateSync();
    if (errors) throw new ClientError(400, errors.message);

    // Update:
    const updatedCart = await CartModel.findByIdAndUpdate(cart._id, cart, { returnOriginal: false }).exec();
    if (!updatedCart) throw new ClientError(404, `_id ${cart._id} not found`);

    // Return updated cart:
    return updatedCart;
}

// Delete:
async function deleteCart(_id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`);
    const deletedCart = await CartModel.findByIdAndDelete(_id).exec();
    if (!deletedCart) throw new ClientError(404, `_id ${_id} not found`);
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
    getOneMsg,
    addMessage,
    updateCart,
    deleteCart,
    getPartialProducts,
    getSomeProducts,
    getPagedProducts,
    getProductsUsingRegex,
    getAllMsgUsers,
    getMsgByUserId,
    getLatestMsg
};
