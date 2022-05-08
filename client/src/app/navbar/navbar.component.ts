import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

public user;
  constructor(public authservice: AuthService) { }

  ngOnInit(): void {
    this.user = this.authservice.getUser();
  }

  logout() {
    this.authservice.logout();
    window.location.href = "home"
  }

}
