import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectUnsubscribedError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { CategoryModel } from '../models/category.model';
import { ProductModel } from '../models/product.model';
// import { categoryDownloadedAction } from '../redux/category-state';
// import store from '../redux/store';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
    public categories: CategoryModel[];

    constructor(private http: HttpClient) {}

    // getAllCategories(): Observable<CategoryModel[]> {
    //   return this.http.get<CategoryModel[]>(
    //     'http://localhost:3001/api/categories'
    //   );
    // }


    public async getAllCategories() {
        return await this.http.get<CategoryModel[]>(environment.categories).toPromise();
    }
    
    public async getProductsByCategory(categoryId: string) {
        return await this.http.get<ProductModel[]>(environment.prodByCat + categoryId ).toPromise();
    }



//   getProductsByCategory(categoryId: number): Observable<ProductModel[]> {
//     return this.http.get<ProductModel[]>("http://localhost:3001/categories/" + categoryId);
//   }
  }