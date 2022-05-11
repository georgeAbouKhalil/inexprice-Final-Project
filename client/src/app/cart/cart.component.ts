import { CartItemModel } from './../models/cartItem.model';
import { CartsService } from './../services/cart.service';
import { Component, Input, OnInit } from '@angular/core';
import { ProductModel } from '../models/product.model';
import { AuthService } from '../services/auth.service';
import { ProductsService } from '../services/products.service';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  @Input() product: ProductModel = new ProductModel();
  public error: string = '';
  cart: any;
  cartItems: any;
  total:any;

  constructor(private notify: NotifyService, private cartsService: CartsService, public usersService: AuthService, public productsService: ProductsService, ) { }

  async ngOnInit(){

    this.cart = JSON.parse(localStorage.getItem("cart"));
    this.cartItems = await this.cartsService.getCartItems(this.cart._id);

   
if (this.cartItems.length > 0){
    this.total = this.cartItems.map(product => (product.totalPrice)).reduce((a, b) => a + b);
}
  }

  // public getCartItems(): void {
  //   let observable = this.cartsService.getCartItems(this.cart._id);

  //   observable.subscribe(
  //     (cartItems) => {
  //       this.cartsService.total = 0;
  //       this.cartsService.cartItems = cartItems;
  //       cartItems.map(
  //         (product) => (this.cartsService.total += product.totalPrice)
  //       );
  //     },
  //     (serverErrorResponse) => {
  //       this.error = serverErrorResponse.error.error;
  //     }
  //   );
  // }


  // public removeFromCart(product: ProductModel) {
  //   this.cartsService.removeFromCart(product);
  //   this.cartItem = this.cartsService.getCartItems(this.cart._id);
  // }

  public async deleteProductFromCart(cartProductId: string) {
    try{ 
    
     await this.cartsService.removeFromCart(cartProductId);
    const indexToDelete = this.cartItems.findIndex(t => t._id === cartProductId);
    this.cartsService.cartItems = this.cartItems.splice(indexToDelete, 1);
    
    }
    catch(err: any) {
      this.notify.error(err);
    }
  }


  // public removeFromCart(product: ProductModel) {
  //   this.cartsService.removeFromCart(product).subscribe(
  //     () => {
  //           this.cartItem = this.cartsService.getCartItems(this.cart._id);

  //         (serverErrorResponse) => { this.error = serverErrorResponse.error.error; }
        
  //     },
  //     (serverErrorResponse) => { this.error = serverErrorResponse.error.error; }
  //   );
  // }


}
