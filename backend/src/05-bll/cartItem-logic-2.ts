import ClientError from '../03-models/client-error';
import mongoose from 'mongoose';
import { CartItemModel, ICartItemModel } from '../03-models/cartItem-model';
import logicHelpers from "./cartProductsHelper";
import productLogic from "./products-logic";

async function getAllCartProducts(cartId: string): Promise<ICartItemModel[]> {
    return CartItemModel.find({"shoppingCartId": cartId}).populate("product").populate("shoppingCart");
}

async function addCartProduct(cartProduct: ICartItemModel): Promise<ICartItemModel> {
    
    // Getting the price of the prod:
    const productPrice = (await productLogic.getOneProduct(cartProduct.product_id.toString())).price;
    // Setting total price for cart prod
    cartProduct.totalPrice = cartProduct.quantity * productPrice;
    // Validate:
    const errors = cartProduct.validateSync();
    if(errors) throw new ClientError(400, errors.message);
    // Get all cart products:
    const cartProducts = await getAllCartProducts(cartProduct.cart_id.toString());
    // Check if product already in cart:
    const isInCart = logicHelpers.checkIfProductIdAlreadyInCart(cartProducts, cartProduct);
    // If in cart, get the existing product:
    if(isInCart) {
        const existingProduct = cartProducts.find(product => product.product_id.toString() === cartProduct.product_id.toString());
        // If so, increase quantity:
        logicHelpers.increaseCartProductQuantity(existingProduct, cartProduct);
        // update Cart Product:
        const updatedProduct = await updateCartProduct(existingProduct);
        // console.log({updatedProduct});
        
        return updatedProduct
    }
    // If not, add to db ad new cart product:
    const addedCartProd = cartProduct.save();
    return addedCartProd;
}

async function updateCartProduct(cartProd: ICartItemModel): Promise<ICartItemModel> {
    // Validate cart:
    const errors = cartProd.validateSync();
    if(errors) throw new ClientError(400, errors.message);

    // update:
    const updatedCartProd = await CartItemModel.findByIdAndUpdate(cartProd._id, cartProd, {returnOriginal: false}).exec();

    // Validate if cart exist in DB:
    if(!updatedCartProd) throw new ClientError(404, "Cart Product is not found");

    return updatedCartProd;
}

async function deleteCartProduct(_id: string) {
    // Validate _id:
    if(!mongoose.isValidObjectId(_id)) throw new ClientError(404, `_id ${_id} is not valid`);

    // Delete:
    const deletedCartProd = await CartItemModel.findByIdAndDelete(_id);

    // Validate cart found:
    if(!deletedCartProd) throw new ClientError(404, "Cart Product not found");
}

export default {
    getAllCartProducts,
    // getOneCartProduct,
    addCartProduct,
    updateCartProduct,
    deleteCartProduct
}