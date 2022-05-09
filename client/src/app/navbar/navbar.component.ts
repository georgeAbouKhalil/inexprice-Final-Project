import { CartsService } from './../services/cart.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

public user;
  constructor(public authservice: AuthService, private cartsService: CartsService) { }

  ngOnInit(): void {
    this.user = this.authservice.getUser();
  }

  logout() {
    this.authservice.logout();
    // this.cartsService.cart = {};
    this.cartsService.cartItems = [];
    window.location.href = "home"
  }

}
