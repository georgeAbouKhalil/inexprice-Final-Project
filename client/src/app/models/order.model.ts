import { UserModel } from './user.model';
import { CartModel } from './cart.model';

export class OrderModel {
     cart_id: CartModel;
     user_id: UserModel;
     firstName: UserModel;
     lastName: UserModel;
     final_price : number;
     delivery_city: string;
     order_date: Date;
     credit_card: string;
     order_number?: number;
}