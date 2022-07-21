import { Component, OnInit } from '@angular/core';
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
import { ReviewsService } from '../services/reviews.service';
import { ReviewModel } from '../models/review.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  currentPg: number = 1;
  categories: CategoryModel[];
  cart: any;
  error: string = '';
  count: number = 0;
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
  isWishProduct: WishListModel[];
  isWish: boolean = false;
  user: UserModel;
  wishProduct: WishListModel[] = [];
  clicked: boolean = false;
  stockCheck: any = "";
  correctNameCategory: string;
  ratesUser: any;
  reviews: ReviewModel[];
  averageRating: number;

  constructor(private reviewsService: ReviewsService, private wishListService: WishListService, private authService: AuthService, private notify: NotifyService, public categoriesService: CategoriesService, public productsService: ProductsService, public cartsService: CartsService,) {

  }

  async ngOnInit() {
    this.cart = JSON.parse(localStorage.getItem("cart"));
    this.categories = await this.categoriesService.getAllCategories();
    this.user = this.authService.getUser();
    this.ratesUser = JSON.parse(localStorage.getItem("rates"));
    // get products
    this.productsService.getProducts().subscribe(
      async (productsList) => {
        this.productsService.products = productsList;
        this.productsService.products.forEach(async product => {

          // get all reviews          
          this.reviews = await this.reviewsService.getReviews(product._id);
          this.averageRating = (this.reviews.map(review => (review.rating)).reduce((a, b) => a + b, 0)) / this.reviews.length;
          product.rating = this.averageRating;

        })



        // check if categoryid in sessionStorage from home sent and get filtered category products
        let categoryId = sessionStorage.getItem('categoryId');
        if (categoryId) {
          this.productsService.products = await this.categoriesService.getProductsByCategory(categoryId);
          sessionStorage.clear();
        }


        if (this.user) {
          // get all wishlist array
          this.wishProduct = await this.wishListService.getAllWishListByUserId(this.user._id);

          // for each product in wishlist in all products array = productsService.products
          this.wishProduct.forEach((follower) => {
            this.productsService.products.forEach(product => {
              if (follower.product._id === product._id) {
                product.follow = true;
              }
            })
          })

        }
      },
      (serverErrorResponse) => {
        this.error = serverErrorResponse.error.error;
      }
    );
  }




  public setCallToAction(): string {
    return this.isWish ? 'red' : 'white';
  }







  async filterCategories(categoryId: any) {
    this.productsService.productsCategory = categoryId;
    this.productsService.products = await this.categoriesService.getProductsByCategory(categoryId);

    this.productsService.products.forEach(async product => {
      // get all reviews          
      this.reviews = await this.reviewsService.getReviews(product._id);
      this.averageRating = (this.reviews.map(review => (review.rating)).reduce((a, b) => a + b, 0)) / this.reviews.length;
      product.rating = this.averageRating;

    })

    // for each product in wishlist in all products array = productsService.products
    this.wishProduct.forEach((follower) => {
      this.productsService.products.forEach(product => {
        if (follower.product._id === product._id) {
          product.follow = true;
        }
      })
    })

    for (let item in this.categories) {
      if (this.categories[item]._id === categoryId)
        this.correctNameCategory = this.categories[item].name; //insert the name we click to the variable

    }

    if (this.user) {
      for (let item in this.user.favorite) {
        if (this.user.favorite[item].name == this.correctNameCategory) {
          // console.log("item ", this.user.favorite[item].name);
          // console.log("rating ", this.user.favorite[item].rating);
          // this.user.favorite[item].rating = this.user.favorite[item].rating + 1;
          this.user.favorite[item].rating += 1;
          // console.log("after ", this.user.favorite[item].rating);
        }
      }
      await this.authService.updateUser(this.user);
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
      this.isWish = false;
      product.follow = false;
      return;
    }

    // if product is NOT in wishlist
    this.isWish = true;
    await this.wishListService.addToWishList(follow);
    product.follow = true;

  }

  public async delete(product) {
    try {
      const answer = confirm("Are you sure?");
      if (!answer) return;
      await this.productsService.deleteProduct(product._id);
      this.notify.success("Product has been deleted.")
      const index = this.productsService.products.findIndex(p => p._id === product._id);
      this.productsService.products.splice(index, 1);
    }
    catch (err) {
      this.notify.error(err);
    }
  }

}
