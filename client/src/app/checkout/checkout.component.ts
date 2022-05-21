import { OrdersService } from './../services/orders.service';
import { Component, OnInit } from '@angular/core';
import { OrderModel } from '../models/order.model';
import { AuthService } from '../services/auth.service';
import { CartsService } from '../services/cart.service';
import { CreditCardService } from '../services/creditCard.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  public user: any;
  creditCards: any; 
  cart: any;
  cartItems: any[] = [];
  total: any;
 orderDetails: OrderModel;

  myRadio: string = ''
  public receiptTrustedUrl: {};

  constructor(private cartsService: CartsService,public myAuthService: AuthService ,private creditService: CreditCardService, private orderService: OrdersService, private sanitizer: DomSanitizer,) { }

  async ngOnInit() {
    this.user = this.myAuthService.getUser();
    this.creditCards = await this.creditService.getCreditCardById(this.user._id);
    this.cart = JSON.parse(localStorage.getItem("cart"));
    this.cartItems = await this.cartsService.getCartItems(this.cart._id);
    this.total = this.cartItems.map(product => (product.totalPrice)).reduce((a, b) => a + b, 0);
    this.cartItems = await this.cartsService.getCartItems(this.cart._id);
console.log(this.cartItems);

  }


  public async makeOrder() {
    const dateNow = new Date();

    let order: OrderModel = {
      cart_id: this.cart._id,
      user_id: this.user._id,
      firstName: this.user.firstName ,
      lastName: this.user.lastName,
      final_price: this.total , 
      delivery_city: this.user.city ,
      credit_card: this.myRadio,
    order_date: dateNow,
    };

    this.orderDetails = order;

    await this.orderService.order(order)
        this.createReceiptFile();
   }


   
  public createReceiptFile(): void {
    let receipt = `Thank you for buying from InexPrice!\n` +
      `Here is your order from ${this.orderDetails.order_date.toLocaleString()}: \n\n`;

    for (let item of this.cartItems) {    
      receipt += `${item.product.name.toUpperCase()} - Amount: ${item.quantity} -  Price: ${item.totalPrice}$ \n`;
    }

    receipt +=
      `\n Total Price: ${this.orderDetails.final_price}$  \n\n\n` +
      `Shipping destination: ${this.orderDetails.delivery_city} \n ` +
      `Thanks for buying from us ${this.user.firstName} ${this.user.lastName} 😃`;

    let data = new Blob([receipt], { type: 'text/plain' });

    let receiptFileUrl = URL.createObjectURL(data);

    this.receiptTrustedUrl = this.sanitizer.bypassSecurityTrustUrl(receiptFileUrl);
  }


  public close() {
    this.cartsService.total = 0;
    this.cartsService.cartItems = [];
    this.cartsService.cart = {};
    window.location.href = "home";

    // this.router.navigate(['/home']);
  }


}
