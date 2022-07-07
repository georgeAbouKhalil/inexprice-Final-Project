import { CategoryModel } from "./category.model";

export class ProductModel {
    _id?: string;
    type?: string;
    brand?: string;
    name?: string;
    size?: string;
    color?: string;
    img?: string;
    price?: number;
    description?: string;
    inStock?: number;
    discount?: number;
    category?: CategoryModel;
    amount?: number;
    totalPrice?:number;
    product_id?: string;
    product?: ProductModel;
    wishlist?: boolean;
    follow?: boolean

}