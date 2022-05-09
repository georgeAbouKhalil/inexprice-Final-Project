import { CartItemModel } from './../models/cartItem.model';
import { CartModel } from './../models/cart.model';
import { Component, Input, OnInit } from '@angular/core';
import { CategoryModel } from '../models/category.model';
import { ProductModel } from '../models/product.model';
import { CartsService } from '../services/cart.service';
import { CategoriesService } from '../services/categories.service';
import { NotifyService } from '../services/notify.service';
import { ProductsService } from '../services/products.service';
import { isNgTemplate } from '@angular/compiler';

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
          // console.log({res});
          
          this.cartsService.cartItems = res;

          
          // console.log('1   ',this.cartsService.cartItems);
          
    if (

      this.cartsService.cartItems.some((item) =>      item.product_id.toString().valueOf() === product._id.toString().valueOf()  )
    ) {
      ifInCart = true;
//       let oldProduct = this.cartsService.cartItems.find(
//         (item) => {console.log(item); console.log({product});
//            ;item.product_id === product._id}
//       );
// console.log({oldProduct});

      // this.cartsService.total -= oldProduct.totalPrice;
      // this.cartsService.total -= oldProduct.totalPrice;
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
              //search the product in the cart
              let oldProduct = this.cartsService.cartItems.find(
                (productCart) =>
                  productCart.product_id === product._id
              );

      let productToUpdate = {
        _id: oldProduct._id,
        quantity: this.amount,
        totalPrice: this.amount * product.price,
        product_id: product._id,
        cart_id: this.cart._id,

        img: product.img,
        name: product.name,
      };
console.log({productToUpdate});



        if (productToUpdate.quantity != oldProduct.amount) {       
          productToUpdate._id = oldProduct._id;
      this.cartsService.updateOnCart(productToUpdate).subscribe(
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
  });
  }


  // public async addToCart(product) {
  //   try{
  //     let productToAdd = {
  //       quantity: this.amount,
  //       totalPrice: this.amount * product.price,
  //       product_id: product._id,
  //       cart_id: this.cart._id,

  //       img: product.img,
  //       name: product.name,
  //     };

  //     console.log({});
      
  //     await this.cartsService.addToCart(productToAdd);
  //     this.notify.success("This product ha been added to your shopping cart");

  //   }


  //   catch(err: any) {
  //     this.notify.error(err);
  //   }
  // }

}
