import { WishListModel } from './../models/wishlist.model';
import { CartItemModel } from '../models/cartItem.model';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductModel } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class WishListService {

  public cart: WishListModel;
  public total: number;
  public cartItems: ProductModel[];
  public searchInCartResults: string[];

  constructor(private http: HttpClient) {
    this.total = 0;
    this.cartItems = [];
    this.searchInCartResults = [];
  }


  public async getAllWishListByUserId(userId: string) {
    return await this.http.get<WishListModel[]>(environment.wishListUrl + 'by-user/' + userId).toPromise();
  }

  public createCart(cart: WishListModel): Observable<WishListModel> {
    return this.http.post<WishListModel>(environment.cartUrl, cart);
  }



  // CART ITEMS
  public async getCartItems(cartId: string) {
    return await this.http.get<CartItemModel[]>(
      environment.cartItemUrl + '/by-cart/' + cartId
    ).toPromise();

  }


  public async addToWishList(Wishlist: WishListModel) {
    return await this.http.post<WishListModel>(environment.wishListUrl, Wishlist).toPromise();

  }


  public updateOnCart(productToUpdate: ProductModel): Observable<ProductModel> {

    return this.http.put<ProductModel>(
      environment.cartItemUrl,
      productToUpdate
    );
  }

  public async removeWishList(wishList: WishListModel) {
    return await this.http.delete<void>(environment.wishListUrl + wishList._id).toPromise();
  }


  public emptyCart(cartId: string): Observable<void> {
    return this.http.delete<void>(
      environment.cartItemUrl + '/by-cart/' + cartId
    );
  }

  public init(): void {
    this.cartItems = [];
    this.total = 0;
  }


  getCartItemsByCartId(_id: string): Observable<any> {
    return this.http.get(environment.cartItemUrl + _id);
  }

}