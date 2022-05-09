import { Component, OnInit } from '@angular/core';
import { Subscription , interval } from 'rxjs';
import { CartModel } from '../models/cart.model';
import { AuthService } from '../services/auth.service';
import { CartsService } from '../services/cart.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public user: any;
  public error: string = '';

  private subscription: Subscription;
  constructor(public myAuthService: AuthService, public cartsService: CartsService) { }

  public dateNow = new Date('Mar 19 2022 23:07:00');
  public dDay = new Date(this.dateNow.getTime() + (30 * 24 * 60 * 60 * 1000));
  
  public timeDifference;
  public seconds;
  public minutes;
  public hours;
  public days;


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
        this.getCartItems();
}
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



public getCartItems(): void {
  this.cartsService.getCartItems().subscribe(
    (cartItems) => {       
      this.cartsService.total = 0;
      this.cartsService.cartItems = cartItems;
      cartItems.map(
        (product) => (this.cartsService.total += product.totalPrice)
      );
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


ngOnDestroy() {
  this.subscription.unsubscribe();
  }

}