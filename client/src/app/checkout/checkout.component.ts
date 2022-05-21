import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  public user: any;
  constructor(public myAuthService: AuthService) { }

  ngOnInit(): void {
    this.user = this.myAuthService.getUser();
  }

}
