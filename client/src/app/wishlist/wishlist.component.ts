import { Component, OnInit } from '@angular/core';
import { UserModel } from '../models/user.model';
import { WishListModel } from '../models/wishlist.model';
import { AuthService } from '../services/auth.service';
import { WishListService } from '../services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  wishProducts: WishListModel[] = [];
  user: UserModel;
  isWishProduct: WishListModel[];
  public arrayLength:any;

  constructor(private wishListService: WishListService, private authService: AuthService) { }

  async ngOnInit() {

    this.user = await this.authService.getUser();
    this.wishProducts = await this.wishListService.getAllWishListByUserId(this.user._id);
    this.arrayLength = this.wishProducts.length;
    
  }


  public async wish(product) {

    this.isWishProduct = this.wishProducts.filter((a: any) => {
      return a.productId === product._id;
    });

    await this.wishListService.removeWishList(this.isWishProduct[0]);

    const indexToDelete = this.wishProducts.findIndex(t => t.product._id === product._id);
    this.wishProducts.splice(indexToDelete, 1);
  }

}
