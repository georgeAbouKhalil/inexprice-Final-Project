import { DialogComponent } from './../dialog/dialog.component';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { CartModel } from '../models/cart.model';
import { CategoryModel } from '../models/category.model';
import { ProductModel } from '../models/product.model';
import { AuthService } from '../services/auth.service';
import { CartsService } from '../services/cart.service';
import { CategoriesService } from '../services/categories.service';
import { NotifyService } from '../services/notify.service';
import { ProductsService } from '../services/products.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: any;
  error: string = '';
  cart: any;
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
  disProducts: any[] = [];
  chepProducts: any[] = [];
  selectedWord: string;
  categories: CategoryModel[];
  categoryDetails: CategoryModel;
  allcategorys: CategoryModel[];
  categoryID: any = "";
  recomendProducts: ProductModel[] = [];
  ratesUser: any;
  private subscription: Subscription;
  DialogP = 'No';
  date: string;
  holidayImage: string = "";

  constructor(public dialog: MatDialog, private authService: AuthService, private myRouter: Router, public categoriesService: CategoriesService, private notify: NotifyService, public myAuthService: AuthService, public cartsService: CartsService, public productsService: ProductsService) {
    this.date = this.getCurrentDate();
  }

  dateNow = new Date('Mar 19 2022 23:07:00');
  dDay = new Date(this.dateNow.getTime() + (30 * 24 * 60 * 60 * 1000));

  timeDifference;
  seconds;
  minutes;
  hours;
  days;

  private getTimeDifference() {
    this.timeDifference = this.dDay.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
  }

  private allocateTimeUnits(timeDifference) {
    this.seconds = Math.floor((timeDifference) / (1000) % 60);
    this.minutes = Math.floor((timeDifference) / (1000 * 60) % 60);
    this.hours = Math.floor((timeDifference) / (1000 * 60 * 60) % 24);
    this.days = Math.floor((timeDifference) / (1000 * 60 * 60 * 24));
  }


  async ngOnInit() {
    this.user = this.myAuthService.getUser();
    this.allcategorys = await this.categoriesService.getAllCategories();


    if (this.user) {
      this.ratesUser = await this.authService.getUserRating(this.user.userName);
    }

    this.getTimeDifference();

    if (this.user != undefined)
      this.getMax();


    this.subscription = interval(1000).subscribe(x => {
      this.getTimeDifference();
      if (this.days < 0 && this.hours < 0 && this.minutes < 0 && this.seconds < 0) {
        this.dateNow = new Date(this.dateNow.getTime() + (30 * 24 * 60 * 60 * 1000));
        this.dDay = new Date(this.dateNow.getTime() + (30 * 24 * 60 * 60 * 1000));

        this.getTimeDifference();
      }
    });
    this.user = this.myAuthService.getUser();

    if (this.user) {
      this.getCart();
    }

    //get the products
    this.productsService.getProducts().subscribe(
      (productsList) => {
        this.productsService.products = productsList;
        this.disProducts = this.productsService.products.filter((product) => product.discount > 0);
        this.chepProducts = this.productsService.products.filter((product) => product.price < 20);
      },
      (serverErrorResponse) => {
        this.error = serverErrorResponse.error.error;
      }

    );

    this.changeHolidayImage();

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

    if (!this.user){
      return;
    }

    // get all categories
    this.categories = await this.categoriesService.getAllCategories();

    // get the category name from html
    const categoryName = (e.target as any).innerHTML;

    // get the category Id and store in sessionStorage
    this.categoryDetails = this.categories.find((category) => category.name === categoryName.trim());

    sessionStorage.setItem('categoryId', this.categoryDetails._id);

    window.location.href = "/category";

  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }



  async getMax() {
    var max: any = 0;
    var index: any = 0;
    var mostViewCategoryName: any = "";

    if (this.user.role === 'user') {
      for (let item in this.ratesUser) {
        if (this.ratesUser[item].rating > max) {
          max = this.ratesUser[item].rating; //get the max rating number
          index = item; //get the index of the product
          mostViewCategoryName = this.ratesUser[item].name // get the name of the product
        }
      }
      for (let item in this.allcategorys) {
        if (this.allcategorys[item].name == mostViewCategoryName)
          this.categoryID = this.allcategorys[item]._id;
      }
      this.recomendProducts = await this.categoriesService.getProductsByCategory(this.categoryID);
    }
  }

  //dialog for register
  openDialog() {
    if (!this.user) {
      this.dialog.open(DialogComponent, {
        width: '400px',
        height: '300px',
      });

    }

  }

  private getCurrentDate(): string {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const monthIndex = now.getMonth();
    const year = now.getFullYear();
    return months[monthIndex] + " " + year;
  }


  changeHolidayImage() {
    switch (this.date) {
      case "Jan":
        this.holidayImage = "https://i.imgur.com/D5emcSG.jpg";
        break;

      case "Feb":
        this.holidayImage = "https://i.imgur.com/PLVvLRD.jpg";
        break;

      case "Apr":
        this.holidayImage = "https://i.imgur.com/MfaarxZ.jpg";
        break;

      case "May":
        this.holidayImage = "assets/img/category/c5.jpg";
        break;

      case "Jun":
        this.holidayImage = "https://i.imgur.com/Ax1r6bj.jpg";
        break;

      case "Oct":
        this.holidayImage = "https://i.imgur.com/w752PtS.jpg";
        break;

      case "Nov":
        this.holidayImage = "assets/img/category/c5.jpg";
        break;

      case "Dec":
        this.holidayImage = "https://i.imgur.com/FlWyuuo.jpg";
        break;

      default:
        this.holidayImage = "https://i.imgur.com/u9LABbF.jpg";
        break;
    }
  }
}
