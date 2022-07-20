import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductModel } from '../models/product.model';
import { ReviewModel } from '../models/review.model';
import { UserModel } from '../models/user.model';
import { WishListModel } from '../models/wishlist.model';
import { AuthService } from '../services/auth.service';
import { CartsService } from '../services/cart.service';
import { NotifyService } from '../services/notify.service';
import { ProductsService } from '../services/products.service';
import { ReviewsService } from '../services/reviews.service';
import { WishListService } from '../services/wishlist.service';


@Component({
  selector: 'app-view-more',
  templateUrl: './view-more.component.html',
  styleUrls: ['./view-more.component.css']
})
export class ViewMoreComponent implements OnInit {
  currentProduct: any;
  product: ProductModel;
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
  clicked: boolean = false;
  wishProduct: WishListModel[] = [];
  isWishProduct: WishListModel[];
  isWish: boolean = false;
  user: UserModel;
  stockCheck: any = "";
  reviews: ReviewModel[];
  review = new ReviewModel();
  averageRating: number;

  constructor(private reviewsService: ReviewsService, private authService: AuthService, public cartsService: CartsService, private notify: NotifyService, private actRoute: ActivatedRoute, private productsService: ProductsService, private wishListService: WishListService) { }

  async ngOnInit() {
    this.user = this.authService.getUser();

    try {
      this.cart = JSON.parse(localStorage.getItem("cart"));
      const productID = this.actRoute.snapshot.params['id'];
      this.product = await this.productsService.getOneProduct(productID);

      //get all reviews of product
      this.reviews = await this.reviewsService.getReviews(productID);
      //get the average of star rating
      this.averageRating = (this.reviews.map(review => (review.rating)).reduce((a, b) => a + b, 0)) / this.reviews.length;


      if (this.product.inStock > 0) {
        this.stockCheck = "In Stock";
      }
      else {
        this.stockCheck = "Not Available";
      }


    }
    catch (err) {
      this.notify.error(err)
    }
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
      this.updateStockProduct = this.productsService.products.find((product) => product._id === productToAdd.product_id);
      this.notify.success("This product has been added to your shopping cart");
      this.updateStockProduct.inStock = this.getProduct.inStock - productToAdd.quantity;
      const indexToDelete = this.productsService.products.findIndex(t => t._id === productToAdd.product_id);
      this.productsService.products[indexToDelete].inStock = this.updateStockProduct.inStock;
      this.productStock = this.productsService.products[indexToDelete].inStock;
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
      this.updateStockProduct = this.productsService.products.find((product) => product._id === productToUpdate.product_id);
      this.updateStockProduct.inStock = this.getProduct.inStock + this.cartP[0].quantity;
      if (productToUpdate.quantity != this.cartP[0].amount) {
        this.cartsService.updateOnCart(productToUpdate).subscribe(
          (newProductInCart) => {
            this.notify.success("This product has been updated in your shopping cart");
            this.updateStockProduct.inStock = this.updateStockProduct.inStock - productToUpdate.quantity;
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

  async addReview() {
    this.review.userId = this.user._id;
    this.review.productId = this.actRoute.snapshot.params['id'];
    if (this.review.review === undefined || this.review.review.trim() === "" || isNaN(this.review.rating)) {
      return;

    }

    await this.reviewsService.addReview(this.review)

    // to update the reviews in page
    this.reviews = await this.reviewsService.getReviews(this.review.productId);
    this.averageRating = (this.reviews.map(review => (review.rating)).reduce((a, b) => a + b, 0)) / this.reviews.length;

    // reset the review textarea
    this.review.review = "";
    this.review.rating = 0;
  }
}
