import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { CategoryComponent } from './category/category.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ContactComponent } from './contact/contact.component';
import { CartComponent } from './cart/cart.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ViewMoreComponent } from './view-more/view-more.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { HttpClientModule } from '@angular/common/http';
import { WishlistComponent } from './wishlist/wishlist.component';
import { MessagesComponent } from './messages/messages.component';
import { OrderComponent } from './order/order.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { UpdateProductComponent } from './admin/update-product/update-product.component';
import { DialogComponent } from './dialog/dialog.component';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    CategoryComponent,
    FooterComponent,
    NavbarComponent,
    ContactComponent,
    CartComponent,
    PageNotFoundComponent,
    ViewMoreComponent,
    CheckoutComponent,
    AccountSettingComponent,
    WishlistComponent,
    MessagesComponent,
    OrderComponent,
    AddProductComponent,
    UpdateProductComponent,
    DialogComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    HttpClientModule,
    NgxPaginationModule,
    MatDialogModule,
    


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
