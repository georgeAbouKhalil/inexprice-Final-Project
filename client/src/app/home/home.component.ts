import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription , interval } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CartModel } from '../models/cart.model';
import { CategoryModel } from '../models/category.model';
import { ProductModel } from '../models/product.model';
import { AuthService } from '../services/auth.service';
import { CartsService } from '../services/cart.service';
import { CategoriesService } from '../services/categories.service';
import { NotifyService } from '../services/notify.service';
import { ProductsService } from '../services/products.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public user: any;
  public error: string = '';

  public cart: any;
  public count: number = 0;
  public amount: number = 1;
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
  disProducts:any[] = [];
  chepProducts:any[] = [];

  selectedWord: string;
  categories: CategoryModel[];
  categoryDetails: CategoryModel;

  private subscription: Subscription;
  constructor(private myRouter: Router, public categoriesService: CategoriesService, private notify: NotifyService,public myAuthService: AuthService, public cartsService: CartsService,public productsService: ProductsService) { }

  dateNow = new Date('Mar 19 2022 23:07:00');
  dDay = new Date(this.dateNow.getTime() + (30 * 24 * 60 * 60 * 1000));
  
  timeDifference;
  seconds;
  minutes;
  hours;
  days;



  private getTimeDifference () {
    this.timeDifference = this.dDay.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
}

private allocateTimeUnits (timeDifference) {
    this.seconds = Math.floor((timeDifference) / (1000) % 60);
    this.minutes = Math.floor((timeDifference) / (1000 * 60) % 60);
    this.hours = Math.floor((timeDifference) / (1000 * 60 * 60) % 24);
    this.days = Math.floor((timeDifference) / (1000 * 60 * 60 * 24));
}
  

  ngOnInit(): void {

    this.getTimeDifference();
    
    
    this.subscription = interval(1000).subscribe(x => { 
        this.getTimeDifference(); 
        if( this.days < 0 && this.hours < 0 && this.minutes < 0 && this.seconds < 0){
        this.dateNow = new Date(this.dateNow.getTime() + (30 * 24 * 60 * 60 * 1000));
        this.dDay = new Date(this.dateNow.getTime() + (30 * 24 * 60 * 60 * 1000));

        this.getTimeDifference();  
      }
        });
        this.user = this.myAuthService.getUser();

if (this.user){
        this.getCart();
        // this.getCartItems();
}

//get the products
this.productsService.getProducts().subscribe(
  (productsList) => {
    this.productsService.products = productsList;
    //get product they have discount
    this.disProducts = this.productsService.products.filter((product) => product.discount > 0 );
    this.chepProducts = this.productsService.products.filter((product) => product.price < 20);
    console.log(this.chepProducts);
    
  },
  (serverErrorResponse) => {
    this.error = serverErrorResponse.error.error;
  }
  
);



}


private getCart() {

  this.cartsService.getCart(this.user?._id).subscribe(
    (cart) => {
        if (cart) {
          this.cartsService.cart = cart
        }
        else {
          const userCart = new CartModel();
          userCart.user_id = this.user._id;
          this.createNewCart(userCart);
          this.getCart();
        }

        localStorage.setItem("cart", JSON.stringify(this.cartsService.cart));
    },
    (serverErrorResponse) => {
      this.error = serverErrorResponse.error.error;
    }
  );
}

public createNewCart(userCart): void {
  this.cartsService.createCart(userCart).subscribe(
    (cart) => (this.cartsService.cart = cart),
    (serverErrorResponse) => {
      this.error = serverErrorResponse.error.error;
    }
  );
}

async categoryFilter(e: Event) {

  // get all categories
  this.categories = await this.categoriesService.getAllCategories();
 
  // get the category name from html
  const categoryName = (e.target as any).innerHTML;

  // get the category Id and store in sessionStorage
  this.categoryDetails = this.categories.find((category) => category.name === categoryName);
  
  sessionStorage.setItem('categoryId', this.categoryDetails._id);

  window.location.href = "/category";
           
}


ngOnDestroy() {
  this.subscription.unsubscribe();
  }
}