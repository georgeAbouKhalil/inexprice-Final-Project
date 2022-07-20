import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CategoryModel } from '../models/category.model';
import { ProductModel } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
    public categories: CategoryModel[];
  categoryDetails : CategoryModel;

    constructor(private http: HttpClient) {}

    public async getAllCategories() {
        return await this.http.get<CategoryModel[]>(environment.categories).toPromise();
    }
    
    public async getProductsByCategory(categoryId: string) {
        return await this.http.get<ProductModel[]>(environment.prodByCat + categoryId ).toPromise();
    }

  }