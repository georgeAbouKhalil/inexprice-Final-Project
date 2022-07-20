import { CartItemModel } from './../models/cartItem.model';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartModel } from '../models/cart.model';
import { ProductModel } from '../models/product.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CartsService {

  public cart: CartModel;
  public total: number;
  public cartItems: ProductModel[];
  public searchInCartResults: string[];

  constructor(private http: HttpClient) {
    this.total = 0;
    this.cartItems = [];
    this.searchInCartResults = [];
  }

  // CART
  public getCart(userId: string): Observable<CartModel> {
    return this.http.get<CartModel>(environment.cartUrl + 'by-user/' + userId);
  }

  public createCart(cart: CartModel): Observable<CartModel> {
    return this.http.post<CartModel>(environment.cartUrl, cart);
  }

  // GET SUM
  public getSum(): Observable<any> {
    return this.http.get<Array<{ totalPrice: number }>>(
      'http://localhost:3001/api/cartItems/' + this.cart?._id)
      .pipe(
        map(response => response.pop().totalPrice)
      )
  };



  // CART ITEMS
  public async getCartItems(cartId: string) {
    return await this.http.get<CartItemModel[]>(
      environment.cartItemUrl + '/by-cart/' + cartId
    ).toPromise();
  }

  public async addToCart(purchasedProduct: ProductModel) {
    console.log({ purchasedProduct });

    return await this.http.post<ProductModel>(
      environment.cartItemUrl,
      purchasedProduct
    ).toPromise();

  }

  public updateOnCart(productToUpdate: ProductModel): Observable<ProductModel> {

    return this.http.put<ProductModel>(
      environment.cartItemUrl,
      // 'http://localhost:3001/api/carts/items',
      productToUpdate
    );
  }

  public async removeFromCart(productId: string) {

    return await this.http.delete<void>(environment.cartItemUrl + productId).toPromise();
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