import { NumberSymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductModel } from '../models/product.model';
import { NotifyService } from '../services/notify.service';
import { ProductsService } from '../services/products.service';


@Component({
  selector: 'app-view-more',
  templateUrl: './view-more.component.html',
  styleUrls: ['./view-more.component.css']
})
export class ViewMoreComponent implements OnInit {
  // productID: Number;
  currentProduct: any;
  product: ProductModel;


  constructor(private notify: NotifyService, private actRoute: ActivatedRoute , private productsService: ProductsService) { }

  async ngOnInit() {
    try {
    const productID = this.actRoute.snapshot.params['id'];
    this.product = await this.productsService.getOneProduct(productID);
    console.log(this.product);
    
    }
    catch (err) {
      this.notify.error(err)
    }
  }


}
