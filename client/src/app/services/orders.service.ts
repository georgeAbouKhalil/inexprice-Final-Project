import { environment } from 'src/environments/environment';
import { UserModel } from 'src/app/models/user.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { OrderModel } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) {}

  public async order( orderDetails: OrderModel){
    const orderrr = await this.http.post<UserModel>(environment.orderUrl,orderDetails).toPromise();
console.log({orderrr});

    return orderrr
  }



}