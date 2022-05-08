import { ProductModel } from 'src/app/models/product.model';
import { CartModel } from './cart.model';
export class CartItemModel {
    _id?: string;
    quantity: number;
    totalPrice: number;
    cart_id: CartModel;
    product_id: ProductModel;

    name: string;
    img: string;
    productId: string;
    itemPrice: number

}


