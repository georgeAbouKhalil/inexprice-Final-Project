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
    // return this.http.get<ProductModel[]>('http://localhost:3001/api/products');
    return this.http.get<ProductModel[]>(environment.productUrl);
  }

  public async getOneProduct(id:string) {
    //  return await this.http.get<ProductModel>('http://localhost:3001/api/products/'+ id).toPromise();
     return await this.http.get<ProductModel>(environment.productUrl+ id).toPromise();

  }

  public getProductsByCategory(productsCategory?: number): Observable<ProductModel[]> {
    // return this.http.get<ProductModel[]>('http://localhost:3001/api/categories/' + productsCategory);
    return this.http.get<ProductModel[]>(environment.categories + productsCategory);
  }


  public async addProduct(product: any) {
        // // Handle FormData for images:
        // const myFormData = new FormData();
        // myFormData.append("type", product.type);
        // myFormData.append("brand", product.brand);
        // myFormData.append("name", product.name);
        // myFormData.append("size", product.size);
        // myFormData.append("color", product.color);
        // myFormData.append("img", product.img);
        // myFormData.append("price", product.price.toString());
        // myFormData.append("desciption", product.desciption);
        // myFormData.append("inStock", product.inStock);
        // myFormData.append("discount", product.discount);
    return await this.http.post<ProductModel>(environment.productUrl, product).toPromise();   

  }

  public async updateProduct(product: any) { 
    // return this.http.put<ProductModel>('http://localhost:3001/api/products', product);
    return await this.http.put<ProductModel>(environment.productUrl, product).toPromise();   

  }

  searchProduct(searchInput: string): Observable<ProductModel[]> {
    // return this.http.get<ProductModel[]>('http://localhost:3001/api/products/search/' + searchInput);
    return this.http.get<ProductModel[]>(environment.productUrl +'/search/' + searchInput);
  }

      // Delete product: 
      public async deleteProduct(id: number) {
        await this.http.delete(environment.productUrl + id).toPromise();
    }


}