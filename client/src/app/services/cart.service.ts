import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartModel } from '../models/cart.model';
import { ProductModel } from '../models/product.model';
// import { CartItem } from '../models/CartItem';
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
  public getCart(): Observable<CartModel> {
    return this.http.get<CartModel>(environment.cartUrl);
  }


  public createCart(cart: CartModel): Observable<CartModel> {
    return this.http.post<CartModel>( environment.cartUrl, cart );
  }



    // GET SUM
    public getSum(): Observable<any> {
      return this.http.get<Array<{totalPrice: number}>>(
        'http://localhost:3001/api/cartItems/' + this.cart?._id)
        .pipe(
          map(response => response.pop().totalPrice)
          )
    };



  // CART ITEMS
  public getCartItems(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(
      environment.cartItemUrl
      // 'http://localhost:3001/api/carts/items'
    );
  }

  public addToCart(purchasedProduct: ProductModel): Observable<ProductModel> {
   
    return this.http.post<ProductModel>(
      // 'http://localhost:3001/api/carts/items',
      environment.cartItemUrl,
      purchasedProduct
    );
  }

  public updateOnCart(productToUpdate: ProductModel): Observable<ProductModel> {
    return this.http.put<ProductModel>(
      environment.cartItemUrl,
      // 'http://localhost:3001/api/carts/items',
      productToUpdate
    );
  }

  public removeFromCart(product: ProductModel): Observable<void> {
    return this.http.delete<void>(
      // 'http://localhost:3001/api/carts/items/' + product._id
      environment.cartItemUrl + product._id
    );
  }

  public emptyCart(): Observable<void> {
    return this.http.delete<void>(
      // 'http://localhost:3001/api/carts/items'
      environment.cartItemUrl
    );
  }

  public init(): void {
    this.cartItems = [];
    this.total = 0;
  }


  getCartItemsByCartId(_id): Observable<any> {
    return this.http.get(environment.cartItemUrl + '?cart_id=' + _id);
  }

}