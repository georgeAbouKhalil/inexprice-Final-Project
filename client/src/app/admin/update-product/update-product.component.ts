import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryModel } from 'src/app/models/category.model';
import { ProductModel } from 'src/app/models/product.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { NotifyService } from 'src/app/services/notify.service';
import { ProductsService } from 'src/app/services/products.service';

// For working with Reactive Forms we need ReactiveFormsModule

@Component({
    selector: 'app-update-product',
    templateUrl: './update-product.component.html',
    styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {

    private product = new ProductModel();
    public categories: CategoryModel[];

    // FormGroup is an object representing the <form> element: 
    public productForm: FormGroup;

    // FormControl is an object representing an <input>/<select>/<textarea> element:
    public typeControl: FormControl;
    public brandControl: FormControl;
    public nameControl: FormControl;
    public sizeControl: FormControl;
    public colorControl: FormControl;
    public imgControl: FormControl;
    public priceControl: FormControl;
    public descriptionControl: FormControl;
    public stockControl: FormControl;
    public discountControl: FormControl;

    constructor(
        private myActivatedRoute: ActivatedRoute,
        private myProductsService: ProductsService,
        private notify: NotifyService,
        public categoriesService: CategoriesService,) {
        this.typeControl = new FormControl(null, Validators.required);
        this.brandControl = new FormControl(null, Validators.required);
        this.nameControl = new FormControl(null, Validators.required);
        this.sizeControl = new FormControl(null, Validators.required);
        this.colorControl = new FormControl(null, Validators.required);
        this.imgControl = new FormControl(null, Validators.required);
        this.priceControl = new FormControl(null, Validators.required);
        this.descriptionControl = new FormControl(null, Validators.required);
        this.stockControl = new FormControl(null, Validators.required);
        this.discountControl = new FormControl(null, Validators.required);


        this.productForm = new FormGroup({
            typeControl: this.typeControl,
            brandControl: this.brandControl,
            nameControl: this.nameControl,
            sizeControl: this.sizeControl,
            colorControl: this.colorControl,
            imgControl: this.imgControl,
            priceControl: this.priceControl,
            descriptionControl: this.descriptionControl,
            stockControl: this.stockControl,
            discountControl: this.discountControl,
        });
    }

    async ngOnInit() {
        try {
            this.categories = await this.categoriesService.getAllCategories();

            this.product._id = this.myActivatedRoute.snapshot.params.id; // Take a route parameter named id.
            const product = await this.myProductsService.getOneProduct(this.product._id);
            this.typeControl.setValue(product.type);
            this.brandControl.setValue(product.brand);
            this.nameControl.setValue(product.name);
            this.sizeControl.setValue(product.size);
            this.colorControl.setValue(product.color);
            this.imgControl.setValue(product.img);
            this.priceControl.setValue(product.price);
            this.descriptionControl.setValue(product.description);
            this.stockControl.setValue(product.inStock);
            this.discountControl.setValue(product.discount);
        }
        catch (err) {
            this.notify.error(err);
        }
    }


    public async update() {
        try {
            this.product.type = this.typeControl.value;
            this.product.brand = this.brandControl.value;
            this.product.name = this.nameControl.value;
            this.product.size = this.sizeControl.value;
            this.product.color = this.colorControl.value;
            this.product.img = this.imgControl.value;
            this.product.price = this.priceControl.value;
            this.product.description = this.descriptionControl.value;
            this.product.inStock = this.stockControl.value;
            this.product.discount = this.discountControl.value;

            await this.myProductsService.updateProduct(this.product);
            this.notify.success("Product has been updated.");
            window.location.href = "/category";
        }
        catch (err) {
            this.notify.error(err);
        }
    }

}
