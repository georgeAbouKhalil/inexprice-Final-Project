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
  cartItems: any[] = [];
  total: any;

  constructor(private notify: NotifyService, private cartsService: CartsService, public usersService: AuthService, public productsService: ProductsService,) { }

  async ngOnInit() {

    this.cart = JSON.parse(localStorage.getItem("cart"));
    this.cartItems = await this.cartsService.getCartItems(this.cart._id);
    this.total = this.cartItems.map(product => (product.totalPrice)).reduce((a, b) => a + b, 0);
  }

  public async deleteProductFromCart(cartProduct: CartItemModel) {
    try {

      await this.cartsService.removeFromCart(cartProduct._id);
      const indexToDelete = this.cartItems.findIndex(t => t._id === cartProduct.product_id);
      this.cartsService.cartItems = this.cartItems.splice(indexToDelete, 1);
      this.total = this.cartItems.map(product => (product.totalPrice)).reduce((a, b) => a + b, 0);
    }
    catch (err: any) {
      this.notify.error(err);
    }
  }

  public emptyCart(): void {

    this.cartsService.emptyCart(this.cart._id).subscribe(
      () => {
        this.cartsService.cartItems = [];
        this.cartItems = [];
        this.total = 0;
      },
      (serverErrorResponse) => {
        this.error = serverErrorResponse.error.error;
      }
    );
  }


}
