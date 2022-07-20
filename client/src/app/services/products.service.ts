import { ProductModel } from 'src/app/models/product.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  products: ProductModel[] = [];
  public productsCategory: number;
  public selectedProduct: ProductModel;

  constructor(private http: HttpClient) { }

  public getProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(environment.productUrl);
  }

  public async getOneProduct(id: string) {
    return await this.http.get<ProductModel>(environment.productUrl + id).toPromise();

  }

  public getProductsByCategory(productsCategory?: number): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(environment.categories + productsCategory);
  }


  public async addProduct(product: any) {
    return await this.http.post<ProductModel>(environment.productUrl, product).toPromise();

  }

  public async updateProduct(product: any) {
    console.log({ product });
    return await this.http.put<ProductModel>(environment.productUrl + product._id, product).toPromise();
  }

  searchProduct(searchInput: string): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(environment.productUrl + '/search/' + searchInput);
  }

  // Delete product: 
  public async deleteProduct(id: number) {
    await this.http.delete(environment.productUrl + id).toPromise();
  }


}