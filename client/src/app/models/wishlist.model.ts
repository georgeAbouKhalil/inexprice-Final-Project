import { ProductModel } from 'src/app/models/product.model';
export class WishListModel {
    _id?: string;
    productId: string;
    userId: string;
    product :ProductModel;
    inStock?: number;
}