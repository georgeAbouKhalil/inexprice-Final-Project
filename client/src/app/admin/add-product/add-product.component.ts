import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryModel } from 'src/app/models/category.model';
import { ProductModel } from 'src/app/models/product.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

    // We must create an empty object for the Two-Way Binding:
    public product = new ProductModel();
    public categories: CategoryModel[];

    constructor(
        private myProductsService: ProductsService,
        private myRouter: Router,
        private notify: NotifyService, public categoriesService: CategoriesService,) { }

    async ngOnInit() {
        this.categories = await this.categoriesService.getAllCategories();
        
    }

    public async send() {
        
        try {
            await this.myProductsService.addProduct(this.product);
            this.notify.success("Product has been added.");
            window.location.href = "/category";

        }
        catch (err) {
            this.notify.error(err);
        }
    }

}
