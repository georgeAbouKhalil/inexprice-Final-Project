import { ProductModel } from 'src/app/models/product.model';
export class WishListModel {
    _id?: string;
    public productId: string;
    public userId: string;
    product :ProductModel;
}