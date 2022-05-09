import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CredentialsModel } from 'src/app/models/credentials.model';
import { CartsService } from '../services/cart.service';
import { NotifyService } from '../services/notify.service';
import { CartModel } from '../models/cart.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public credentials = new CredentialsModel();
  public error: string = '';
  public cart: any;
  public user: any;

  constructor(public myAuthService: AuthService,private myRouter: Router,public cartsService: CartsService,private notify: NotifyService,) { }

  ngOnInit(): void {
    // this.cart = JSON.parse(localStorage.getItem("cart"));
  }

  public async login() {
    try {
      await this.myAuthService.login(this.credentials);
      this.notify.success("You are logged-in ");
      // this.myRouter.navigateByUrl("/home");

      
      // if (this.cartsService.cart?.status == 'open') {
      //   this.getCartItems();
  
      // } 
      // else {
        //   this.createNewCart();
      // }
      
      window.location.href = "home";
      this.myAuthService.isLoggedIn = true;
      
    }
    catch (err) {
      this.notify.error("wrong username or password");
    }
  }



}
