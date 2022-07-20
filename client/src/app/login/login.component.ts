import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CredentialsModel } from 'src/app/models/credentials.model';
import { CartsService } from '../services/cart.service';
import { NotifyService } from '../services/notify.service';

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
  public date: string;

  constructor(public myAuthService: AuthService, private myRouter: Router, public cartsService: CartsService, private notify: NotifyService,) { this.date = this.getCurrentDate(); }

  ngOnInit(): void {
  }

  private getCurrentDate(): string {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const monthIndex = now.getMonth();
    const year = now.getFullYear();
    return months[monthIndex] + " " + year;
  }

  public async login() {
    try {
      await this.myAuthService.login(this.credentials);
      this.notify.success("You are logged-in ");
      window.location.href = "home";
      this.myAuthService.isLoggedIn = true;
    }
    catch (err) {
      this.notify.error("wrong username or password");
    }
  }
}
