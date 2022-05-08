import { ICartItemModel } from './../03-models/cartItem-model';

function checkIfProductIdAlreadyInCart(cartProducts: ICartItemModel[], cartProduct: ICartItemModel): boolean{
    for(let product of cartProducts) {
        if(product.product_id.toString() === cartProduct.product_id.toString()) return true;
    }
    return false;
}

function increaseCartProductQuantity(oldCartProduct: ICartItemModel, newCartProduct: ICartItemModel) {
    oldCartProduct.quantity = oldCartProduct.quantity + newCartProduct.quantity;
    updateCartProductPrice(oldCartProduct, newCartProduct);
}

function updateCartProductPrice(oldCartProduct: ICartItemModel, newCartProduct: ICartItemModel) {
    oldCartProduct.totalPrice = oldCartProduct.totalPrice + newCartProduct.totalPrice;
}

export default {
    checkIfProductIdAlreadyInCart,
    increaseCartProductQuantity,
}