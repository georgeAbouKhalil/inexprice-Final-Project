import { CartItemModel } from './../models/cartItem.model';
import { CartModel } from './../models/cart.model';
import { Component, Input, OnInit } from '@angular/core';
import { CategoryModel } from '../models/category.model';
import { ProductModel } from '../models/product.model';
import { CartsService } from '../services/cart.service';
import { CategoriesService } from '../services/categories.service';
import { NotifyService } from '../services/notify.service';
import { ProductsService } from '../services/products.service';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../models/user.model';
import { WishListModel } from '../models/wishlist.model';
import { WishListService } from '../services/wishlist.service';

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
  // @Input() product: ProductModel = new ProductModel();
  public productToAdd: ProductModel;
  cartProducts: any;
  cartP: any[];
  products: any;
  updateStockProduct: ProductModel;
  stock: any;
  getProduct: any;
  productStock: number;
  sum: number;
  quantityCart: number;
  isWishProduct: WishListModel[];
  isWish: boolean = false;
  user: UserModel;
  wishProduct: WishListModel[] = [];
  clicked: boolean = false;

  constructor(private wishListService: WishListService, private authService: AuthService, private notify: NotifyService, public categoriesService: CategoriesService, public productsService: ProductsService, public cartsService: CartsService,) {

  }

  async ngOnInit() {
    this.cart = JSON.parse(localStorage.getItem("cart"));
    this.categories = await this.categoriesService.getAllCategories();
    this.user = this.authService.getUser();

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
    console.log({ product });

    // Get PRODUCTS FROM CART
    this.cartProducts = await this.cartsService.getCartItems(this.cart._id);
    console.log('cartproduct ', this.cartProducts);

    this.cartP = this.cartProducts.filter((a: any) => {
      return a.product_id === product._id;
    });
    console.log(this.cartP);

    this.getProduct = await this.productsService.getOneProduct(product._id);
    console.log(this.getProduct);

    if (this.amount < 0) {
      this.amount = 1;
      this.notify.error("Positive Quantity only allowed");
      return;
    };

    // this.stock = this.productsService.products.find((item) => item._id === product._id);
    // console.log(this.stock);

    // console.log('11111 ', this.getProduct.inStock);
    // console.log('22222222 ', this.cartP[0]?.quantity);

    if (!this.cartP[0]?.quantity || this.cartP[0]?.quantity === undefined) {
      this.quantityCart = 0
    } else {
      this.quantityCart = this.cartP[0]?.quantity
    };
    this.sum = this.getProduct.inStock + this.quantityCart;
    if (this.amount > this.sum) {
      this.amount = 1;
      this.notify.error("max quantity to order is " + this.sum);
      return;
    }

    //If product already in cart
    let ifInCart = false;
    // // Get PRODUCTS FROM CART
    // this.cartProducts = await this.cartsService.getCartItems(this.cart._id);
    // console.log('cartprodct ', this.cartProducts);

    // this.cartP = this.cartProducts.filter((a: any) => {
    //   return a.product_id === product._id;
    // });
    // console.log(this.cartP);

    if (this.cartP.length > 0) {
      ifInCart = true;
    }

    if (!ifInCart) {
      let productToAdd = {
        quantity: this.amount,
        totalPrice: this.amount * product.price,
        product_id: product._id,
        cart_id: this.cart._id,
        price: product.price,
        discount: product.discount,
        img: product.img,
        name: product.name,
      };
      console.log({ productToAdd });

      this.cartsService.addToCart(productToAdd);
      this.updateStockProduct = this.productsService.products.find((product) => product._id === productToAdd.product_id);
      this.notify.success("This product has been added to your shopping cart");
      // this.updateStockProduct.inStock = this.updateStockProduct.inStock - productToAdd.quantity;
      this.updateStockProduct.inStock = this.getProduct.inStock - productToAdd.quantity;

      const indexToDelete = this.productsService.products.findIndex(t => t._id === productToAdd.product_id);
      this.productsService.products[indexToDelete].inStock = this.updateStockProduct.inStock;
      console.log(this.productsService.products[indexToDelete].inStock);

      this.productStock = this.productsService.products[indexToDelete].inStock;
      console.log(this.productStock);


    } else if (ifInCart) {

      let productToUpdate = {
        _id: this.cartP[0]._id,
        quantity: this.amount,
        totalPrice: this.amount * product.price,
        product_id: product._id,
        cart_id: this.cart._id,
        price: product.price,
        discount: product.discount,
        img: product.img,
        name: product.name,
      };
      console.log({ productToUpdate });

      console.log(this.cartP[0]);
      console.log(this.getProduct);
      console.log(this.updateStockProduct);

      this.updateStockProduct = this.productsService.products.find((product) => product._id === productToUpdate.product_id);

      this.updateStockProduct.inStock = this.getProduct.inStock + this.cartP[0].quantity;
      console.log('--111--    ', this.updateStockProduct.inStock);

      if (productToUpdate.quantity != this.cartP[0].amount) {
        this.cartsService.updateOnCart(productToUpdate).subscribe(
          (newProductInCart) => {
            this.notify.success("This product has been updated in your shopping cart");
            // this.updateStockProduct = this.productsService.products.find((product) => product._id === productToUpdate.product_id);
            // this.updateStockProduct = this.productsService.products.find((product) => product._id === productToUpdate.product_id);
            console.log(this.updateStockProduct);
            console.log(this.getProduct.inStock);
            console.log(productToUpdate.quantity);
            console.log('--------', this.getProduct.inStock);


            // this.updateStockProduct.inStock = this.getProduct.inStock + this.amount;
            // this.updateStockProduct.inStock = this.getProduct.inStock + productToUpdate.quantity;
            // this.updateStockProduct.inStock = this.getProduct.inStock + this.cartP[0].quantity;

            // this.updateStockProduct.inStock = this.getProduct.inStock - productToUpdate.quantity;
            this.updateStockProduct.inStock = this.updateStockProduct.inStock - productToUpdate.quantity;
            console.log('--222--    ', this.updateStockProduct.inStock);

            // this.updateStockProduct.inStock = this.updateStockProduct.inStock + productToUpdate.quantity;
            // this.updateStockProduct.inStock = this.updateStockProduct.inStock - productToUpdate.quantity;

            console.log('********  ', this.updateStockProduct.inStock);

            const indexToDelete = this.productsService.products.findIndex(t => t._id === productToUpdate.product_id);
            this.productsService.products[indexToDelete].inStock = this.updateStockProduct.inStock;
            this.productStock = this.productsService.products[indexToDelete].inStock;
          },
          (serverErrorResponse) => {
            this.error = serverErrorResponse.error.error;
          }
        );
      }
    }
  }

  public async wish(product) {

    if (this.clicked) {
      this.clicked = false
    }
    else { this.clicked = true };

    this.wishProduct = await this.wishListService.getAllWishListByUserId(this.user._id);


    const follow = new WishListModel();
    follow.productId = product._id;
    follow.userId = this.user._id;

    this.isWishProduct = this.wishProduct.filter((a: any) => {
      return a.productId === product._id;
    });

    // if product is already in wishlist
    if (this.isWishProduct.length > 0) {
      await this.wishListService.removeWishList(this.isWishProduct[0]);
      this.notify.error("product has removed from wishlist");
      this.isWish = false;
      return;
    }

    // if product is NOT in wishlist
    this.isWish = true;
    await this.wishListService.addToWishList(follow);
    this.notify.success("product has added from wishlist");

  }

}
