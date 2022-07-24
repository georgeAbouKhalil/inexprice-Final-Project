import mongoose from "mongoose";
import ClientError from "../03-models/client-error";
import { ICartModel, CartModel } from "../03-models/cart-model";

// Get all:
async function getAllCarts(): Promise<ICartModel[]> {
    return CartModel.find().exec();
}

// Get one:
async function getOneCart(_id: string): Promise<ICartModel> {

    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`); 
    const cart = await CartModel.findById(_id).exec();
    if (!cart) throw new ClientError(404, `_id ${_id} not found`);
    return cart;
}

async function getOneCartByUserId(user_id: string): Promise<ICartModel | any> {
    // Validate _id:
    if (!mongoose.isValidObjectId(user_id)) throw new ClientError(404, `user_id ${user_id} is invalid`);
    const cart = await CartModel.findOne({"user_id": user_id, "status": "open"}).exec();
    return cart;
}

// Insert:
async function addCart(cart: ICartModel): Promise<ICartModel> {

    // Validation:
    const errors = cart.validateSync();
    if (errors) throw new ClientError(400, errors.message);

    // Add:
    return cart.save();
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

export default {
    getAllCarts,
    getOneCart,
    addCart,
    updateCart,
    deleteCart,
    getOneCartByUserId
};
