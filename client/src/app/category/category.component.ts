import { Component, OnInit } from '@angular/core';
import { CategoryModel } from '../models/category.model';
import { CategoriesService } from '../services/categories.service';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  public categories: CategoryModel[];
  public error: string = '';
  public count: number = 0;

  constructor(public categoriesService: CategoriesService, public productsService: ProductsService,) { }

  async ngOnInit() {
    this.categories = await this.categoriesService.getAllCategories();



    let observable = this.productsService.getProducts();

    observable.subscribe(
      (productsList) => {
        this.productsService.products = productsList;
      },
      (serverErrorResponse) => {
        this.error = serverErrorResponse.error.error;
      }
    );



  }


  // filterCategories(categoryId: any) {
  //   this.productsService.productsCategory = categoryId;
  //   let observable = this.productsService.getProductsByCategory(
  //     this.productsService.productsCategory
  //   );

  //   observable.subscribe(
  //     (productsList) => {
  //       this.productsService.products = productsList; console.log({productsList});

  //     },
  //     (serverErrorResponse) => {
  //       this.error = serverErrorResponse.error.error;
  //     }
  //   );
  // }

  async filterCategories(categoryId: any) {
    this.productsService.productsCategory = categoryId;
    this.productsService.products = await this.categoriesService.getProductsByCategory(categoryId);
    console.log(this.productsService.products)



    //   this.productsService.productsCategory
    // );

    // observable.subscribe(
    //   (productsList) => {
    //     this.productsService.products = productsList; 
    //   },
    //   (serverErrorResponse) => {
    //     this.error = serverErrorResponse.error.error;
    //   }
    // );
  }


}
