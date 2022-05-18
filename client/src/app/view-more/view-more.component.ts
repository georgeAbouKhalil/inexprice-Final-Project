import { NumberSymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductModel } from '../models/product.model';
import { CartsService } from '../services/cart.service';
import { NotifyService } from '../services/notify.service';
import { ProductsService } from '../services/products.service';


@Component({
  selector: 'app-view-more',
  templateUrl: './view-more.component.html',
  styleUrls: ['./view-more.component.css']
})
export class ViewMoreComponent implements OnInit {
  // productID: Number;
  currentProduct: any;
  product: ProductModel;

  public cart: any;
  public error: string = '';
  public count: number = 0;
  public amount: number = 1;
  public productToAdd: ProductModel;
  cartProducts: any;
  cartP: any[];


  constructor(public cartsService: CartsService, private notify: NotifyService, private actRoute: ActivatedRoute, private productsService: ProductsService) { }

  async ngOnInit() {
    try {
      this.cart = JSON.parse(localStorage.getItem("cart"));
      const productID = this.actRoute.snapshot.params['id'];
      this.product = await this.productsService.getOneProduct(productID);
      console.log(this.product);

    }
    catch (err) {
      this.notify.error(err)
    }
  }

  public async addToCart(product) {
    if (this.amount < 0) {
      this.notify.error("Positive Quantity only allowed");
      this.amount = 1;
      return;
    };

    //If product already in cart
    let ifInCart = false;
    // Get PRODUCTS FROM CART
    this.cartProducts = await this.cartsService.getCartItems(this.cart._id);
    console.log('cartprodct ', this.cartProducts);

    this.cartP = this.cartProducts.filter((a: any) => {
      return a.product_id === product._id;
    });
    console.log(this.cartP);

    if (this.cartP.length > 0) {
      ifInCart = true;
    }

    if (!ifInCart) {
      let productToAdd = {
        quantity: this.amount,
        totalPrice: this.amount * product.price,
        product_id: product._id,
        cart_id: this.cart._id,

        img: product.img,
        name: product.name,
      };
      console.log({ productToAdd });

      this.cartsService.addToCart(productToAdd);

      this.notify.success("This product has been added to your shopping cart");
    } else if (ifInCart) {

      let productToUpdate = {
        _id: this.cartP[0]._id,
        quantity: this.amount,
        totalPrice: this.amount * product.price,
        product_id: product._id,
        cart_id: this.cart._id,

        img: product.img,
        name: product.name,
      };
      console.log({ productToUpdate });


      if (productToUpdate.quantity != this.cartP[0].amount) {
        this.cartsService.updateOnCart(productToUpdate).subscribe(
          (newProductInCart) => {
            this.notify.success("This product has been updated in your shopping cart");
          },
          (serverErrorResponse) => {
            this.error = serverErrorResponse.error.error;
          }
        );
      }
    }
  }
}
