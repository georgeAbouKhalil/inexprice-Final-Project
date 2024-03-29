import mongoose from "mongoose";
import ClientError from "../03-models/client-error";
import { IOrderModel, OrderModel } from "../03-models/order-model";

// Get all:
async function getAllOrders(): Promise<IOrderModel[]> {
    return OrderModel.find().exec();
}

 // Get all Orders by user ID
 async function getAllOrdersByUserId(user_id: string): Promise<IOrderModel[]> {
    return await OrderModel.find({"user_id": user_id}).exec();
}

// Get one:
async function getOneOrder(_id: string): Promise<IOrderModel> {

    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`); 

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

export default {
    getAllOrders,
    getOneOrder,
    addOrder,
    updateOrder,
    deleteOrder,
    getAllOrdersByUserId,
};
