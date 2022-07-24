import mongoose from "mongoose";
import ClientError from "../03-models/client-error";
import { ICartItemModel, CartItemModel } from "../03-models/cartItem-model";

// Get all:s
async function getAllCartItem(cart_id: string): Promise<ICartItemModel[]> {
    return await CartItemModel.find({"cart_id": cart_id}).populate("product").populate("cart").exec();
}

// Get all:s
async function getAll(): Promise<ICartItemModel[]> {
    return await CartItemModel.find().populate("product").populate("cart").exec();
}

// Get one:
async function getOneCartItem(_id: string): Promise<ICartItemModel> {

    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`);

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

async function checkIfProductExistInCart(product) {
    
    return CartItemModel.findOne({ "cart_id": product.cart_id, "product_id": product.product_id, "quantity" : product.quantity})
}

// Update:
async function updateCartItem(product: ICartItemModel): Promise<ICartItemModel> {

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

async function emptyCart(cartId) {
  
    if (!mongoose.Types.ObjectId.isValid(cartId)) throw new ClientError(404, `_id ${cartId} not valid`);
    await CartItemModel.deleteMany({"cart_id" : cartId}).exec();
  };

export default {
    getAllCartItem,
    checkIfProductExistInCart,
    getOneCartItem,
    addCartItem,
    updateCartItem,
    deleteCartItem,
    emptyCart,getAll
};
