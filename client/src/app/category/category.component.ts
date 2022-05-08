import { CartItemModel } from './../models/cartItem.model';
import { CartModel } from './../models/cart.model';
import { Component, Input, OnInit } from '@angular/core';
import { CategoryModel } from '../models/category.model';
import { ProductModel } from '../models/product.model';
import { CartsService } from '../services/cart.service';
import { CategoriesService } from '../services/categories.service';
import { NotifyService } from '../services/notify.service';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  public categories: CategoryModel[];
  public cart: any;
  public error: string = '';
  public count: number = 0;
  public amount: number = 1;
  @Input() product: ProductModel = new ProductModel();
  public productToAdd: ProductModel;

  constructor(private notify: NotifyService, public categoriesService: CategoriesService, public productsService: ProductsService, public cartsService: CartsService,) {

  }

  async ngOnInit() {
    this.cart = JSON.parse(localStorage.getItem("cart"));

    this.categories = await this.categoriesService.getAllCategories();


    // get products
    this.productsService.getProducts().subscribe(
      (productsList) => {
        this.productsService.products = productsList;
      },
      (serverErrorResponse) => {
        this.error = serverErrorResponse.error.error;
      }
    );

  }


  async filterCategories(categoryId: any) {
    this.productsService.productsCategory = categoryId;
    this.productsService.products = await this.categoriesService.getProductsByCategory(categoryId);
  }


  public addToCart(product) {
    if (this.amount < 0) {
      this.notify.error("Positive Quantity only allowed");
      this.amount = 1;
      return;
    };

    //If product already in cart
    let ifInCart = false;
        // Get PRODUCTS FROM CART
        this.cartsService.getCartItemsByCartId(this.cart.id).subscribe(res => {
          this.cartsService.cartItems = res; });

          
    if (
      this.cartsService.cartItems.some((item) => {console.log({item});item._id === product.product_id})
    ) {
      ifInCart = true;
      let oldProduct = this.cartsService.cartItems.find(
        (product) => product._id === this.product._id
      );

      this.cartsService.total -= oldProduct.totalPrice;
    }

    if (!ifInCart) {
      let productToAdd = {
        quantity: this.amount,
        total_price: this.amount * product.price,
        product_id: product._id,
        cart_id: this.cart._id,

        img: product.img,
        name: product.name,
      };

      this.cartsService.addToCart(productToAdd).subscribe(
        (newProductInCart) => {
          this.notify.success("This product has been added to your shopping cart");
          //Get updated cart items
          this.cartsService.getCartItems().subscribe(
            (cartItems) => {
              this.cartsService.cartItems = cartItems;
              this.cartsService.total += newProductInCart.totalPrice;
            },
            (serverErrorResponse) => {
              this.error = serverErrorResponse.error.error;
            }
          );
        },
        (serverErrorResponse) => {
          this.error = serverErrorResponse.error.error;
        }
      );
    } else if (ifInCart) {
      let productToAdd = {
        quantity: this.amount,
        total_price: this.amount * product.price,
        product_id: product._id,
        cart_id: this.cart._id,

        img: product.img,
        name: product.name,
      };
console.log({productToAdd});

      this.cartsService.updateOnCart(productToAdd).subscribe(
        (newProductInCart) => {
          this.notify.success("This product has been updated in your shopping cart");

          //Get updated cart items
          this.cartsService.getCartItems().subscribe(
            (cartItems) => {
              this.cartsService.cartItems = cartItems;
              this.cartsService.total += newProductInCart.totalPrice;
            },
            (serverErrorResponse) => {
              this.error = serverErrorResponse.error.error;
            }
          );
        },
        (serverErrorResponse) => {
          this.error = serverErrorResponse.error.error;
        }
      );
    }
  }



}
