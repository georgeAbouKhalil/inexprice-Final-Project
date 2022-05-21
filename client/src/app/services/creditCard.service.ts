import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreditCardModel } from '../models/creditCard.model';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService {

  constructor(private http: HttpClient) { }

  public async getCreditCards(){
    return this.http.get<CreditCardModel[]>(environment.creditCardUrl).toPromise();
  }

  public async getOneCreditCard(id:string) {
    return this.http.get<CreditCardModel>(environment.creditCardUrl+ id).toPromise();
  }

    // CART Credit by id
    public async getCreditCardById(userId: string) {
      return await this.http.get<CreditCardModel[]>(
        environment.creditCardUrl + 'by-user/' + userId
      ).toPromise();
    }

  public async addCreditCard(credit: any) {
    return this.http.post<CreditCardModel>(environment.creditCardUrl, credit).toPromise();
  }

  public async updateCreditCard(credit: any) { 
    return this.http.put<CreditCardModel>(environment.creditCardUrl, credit).toPromise();
  }

  public async deleteCreditCard(creditId: string) {
    return await this.http.delete<void>( environment.creditCardUrl + creditId).toPromise();
  }

  



}