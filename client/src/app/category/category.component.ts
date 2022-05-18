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
  cartProducts: any;
  cartP: any[];
  products: any;
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

  public async addToCart(product) {

    if (this.amount < 0) {
      this.notify.error("Positive Quantity only allowed");
      this.amount = 1;
      return;
    };

    let stock1 = this.productsService.products.find((item) => item._id === product._id);
    if (this.amount > stock1.inStock) {
      this.notify.error("max quantity to order is " + stock1.inStock);
      this.amount = 1;
      return;
    }

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
//       let stock = this.productsService.products.find((product) => product._id === productToAdd.product_id)
//       console.log({stock});
//       stock.inStock = stock.inStock - productToAdd.quantity;
// console.log({stock});


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
        // this.cartP[0].inStock += productToUpdate.quantity;
        this.cartsService.updateOnCart(productToUpdate).subscribe(
          (newProductInCart) => {
            // let stock = this.productsService.products.find((product) => product._id === newProductInCart.product_id)
            // stock.inStock = stock.inStock - newProductInCart.amount;
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
