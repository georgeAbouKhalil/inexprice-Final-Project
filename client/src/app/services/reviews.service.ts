import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ReviewModel } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  reviews: ReviewModel[] = [];
  public productsCategory: number;
  public selectedProduct: ReviewModel;

  constructor(private http: HttpClient) { }

  public async getReviews(productId) {
    return await this.http.get<ReviewModel[]>(environment.reviewUrl + productId).toPromise();
  }

  public async addReview(review: any) {
    return await this.http.post<ReviewModel>(environment.reviewUrl, review).toPromise();

  }

}