import { ProductModel } from 'src/app/models/product.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  products: ProductModel[] = [];
  public productsCategory: number;
  public selectedProduct: ProductModel;

  constructor(private http: HttpClient) { }

  public getProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>('http://localhost:3001/api/products');
  }

  
  public getProductsByCategory(productsCategory?: number): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>('http://localhost:3001/api/categories/' + productsCategory);
  }


  public addProduct(product: any) {
    return this.http.post<ProductModel>('http://localhost:3001/api/products', product);
  }

  public updateProduct(product: any) { 
    return this.http.put<ProductModel>('http://localhost:3001/api/products', product);
  }

  searchProduct(searchInput: string): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>('http://localhost:3001/api/products/search/' + searchInput);
  }



}