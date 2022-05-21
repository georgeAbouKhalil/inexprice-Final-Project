import { UserModel } from './user.model';
export class CreditCardModel {
    _id?: string;
    user_id?: UserModel;
    card_number: string;
    card_holder: string;
    cvv: string;
    date_mm: string;
    date_yyyy: string;
}