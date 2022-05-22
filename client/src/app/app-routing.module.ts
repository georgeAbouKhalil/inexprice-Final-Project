import { WishlistComponent } from './wishlist/wishlist.component';
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountSettingComponent } from './account-setting/account-setting.component';
import { CartComponent } from './cart/cart.component';
import { CategoryComponent } from './category/category.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SignupComponent } from './signup/signup.component';
import { ViewMoreComponent } from './view-more/view-more.component';

const routes: Routes = [
  {path:'',pathMatch:'full',redirectTo:'home'},
  {path:'home',component: HomeComponent},
  {path:'home/:id',component: ViewMoreComponent},
  {path:'category',component: CategoryComponent},
  {path:'cart',component: CartComponent},
  {path:'signup',component: SignupComponent},
  {path:'login',component: LoginComponent},
  {path:'contact',component:ContactComponent},
  {path:'category/:id',component:ViewMoreComponent},
  {path:'checkout',component:CheckoutComponent},
  {path:'pageNotFound',component: PageNotFoundComponent},
  {path:'account-setting',component:AccountSettingComponent},
  {path:'wishlist',component:WishlistComponent},
  
  {path: '**',component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
 }
