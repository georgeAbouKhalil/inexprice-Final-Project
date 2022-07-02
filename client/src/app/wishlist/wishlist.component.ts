import { Component, OnInit } from '@angular/core';
import { ProductModel } from '../models/product.model';
import { UserModel } from '../models/user.model';
import { WishListModel } from '../models/wishlist.model';
import { AuthService } from '../services/auth.service';
import { CartsService } from '../services/cart.service';
import { NotifyService } from '../services/notify.service';
import { ProductsService } from '../services/products.service';
import { WishListService } from '../services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishProducts: WishListModel[] = [];
  user: UserModel;
  isWishProduct: WishListModel[];
  arrayLength: any;

  amount: number = 1;
  productToAdd: ProductModel;
  cartProducts: any;
  cartP: any[];
  products: any;
  updateStockProduct: ProductModel;
  stock: any;
  getProduct: any;
  productStock: number;
  sum: number;
  quantityCart: number;
  cart: any;
  error: string = '';


  constructor(private wishListService: WishListService, private notify: NotifyService, private authService: AuthService, public cartsService: CartsService, public productsService: ProductsService) { }

  async ngOnInit() {
    this.cart = JSON.parse(localStorage.getItem("cart"));
    this.user = await this.authService.getUser();
    this.wishProducts = await this.wishListService.getAllWishListByUserId(this.user._id);
    this.arrayLength = this.wishProducts.length;

    

  }


  public async addToCart(product) {
    

    // Get PRODUCTS FROM CART
    this.cartProducts = await this.cartsService.getCartItems(this.cart._id);
    

    this.cartP = this.cartProducts.filter((a: any) => {
      return a.product_id === product._id;
    });
    

    this.getProduct = await this.productsService.getOneProduct(product._id);
    

    if (this.amount < 0) {
      this.amount = 1;
      this.notify.error("Positive Quantity only allowed");
      return;
    };

    

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
     

      this.cartsService.addToCart(productToAdd);
      // this.updateStockProduct = this.productsService.products.find((product) => product._id === productToAdd.product_id);
      this.updateStockProduct = this.wishProducts.find((product) => product.productId === productToAdd.product_id);
      this.notify.success("This product has been added to your shopping cart");
      // this.updateStockProduct.inStock = this.updateStockProduct.inStock - productToAdd.quantity;
      
      
      
      this.updateStockProduct.inStock = this.getProduct.inStock - productToAdd.quantity;

      const indexToDelete = this.wishProducts.findIndex(t => t.productId === productToAdd.product_id);
     
      
      
      this.wishProducts[indexToDelete].inStock = this.updateStockProduct.inStock;

      this.productStock = this.wishProducts[indexToDelete].inStock;
     


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
      

      this.updateStockProduct = this.wishProducts.find((product) => product.productId === productToUpdate.product_id);

      this.updateStockProduct.inStock = this.getProduct.inStock + this.cartP[0].quantity;
     

      if (productToUpdate.quantity != this.cartP[0].amount) {
        this.cartsService.updateOnCart(productToUpdate).subscribe(
          (newProductInCart) => {
            this.notify.success("This product has been updated in your shopping cart");
            // this.updateStockProduct = this.productsService.products.find((product) => product._id === productToUpdate.product_id);
            // this.updateStockProduct = this.productsService.products.find((product) => product._id === productToUpdate.product_id);
            


            // this.updateStockProduct.inStock = this.getProduct.inStock + this.amount;
            // this.updateStockProduct.inStock = this.getProduct.inStock + productToUpdate.quantity;
            // this.updateStockProduct.inStock = this.getProduct.inStock + this.cartP[0].quantity;

            // this.updateStockProduct.inStock = this.getProduct.inStock - productToUpdate.quantity;
            this.updateStockProduct.inStock = this.updateStockProduct.inStock - productToUpdate.quantity;
            

            // this.updateStockProduct.inStock = this.updateStockProduct.inStock + productToUpdate.quantity;
            // this.updateStockProduct.inStock = this.updateStockProduct.inStock - productToUpdate.quantity;

            

            const indexToDelete = this.wishProducts.findIndex(t => t.productId === productToUpdate.product_id);
            this.wishProducts[indexToDelete].inStock = this.updateStockProduct.inStock;
            this.productStock = this.wishProducts[indexToDelete].inStock;
          },
          (serverErrorResponse) => {
            this.error = serverErrorResponse.error.error;
          }
        );
      }
    }
  }


  public async wish(product) {

    this.isWishProduct = this.wishProducts.filter((a: any) => {
      return a.productId === product._id;
    });

    await this.wishListService.removeWishList(this.isWishProduct[0]);

    const indexToDelete = this.wishProducts.findIndex(t => t.product._id === product._id);
    this.wishProducts.splice(indexToDelete, 1);
  }

}
