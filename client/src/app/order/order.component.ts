import { OrderModel } from './../models/order.model';
import { Component, OnInit } from '@angular/core';
import { UserModel } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orderList: OrderModel[] = [];
  user: UserModel;
  
  constructor(private authService: AuthService, private orderService: OrdersService) { }

  async ngOnInit() {
    this.user = await this.authService.getUser();
    this.orderList = await this.orderService.getOrderList(this.user._id);
  }

}
