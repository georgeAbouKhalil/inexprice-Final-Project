import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private http: HttpClient) {}

  public async sendEmail( email){
    return await this.http.post(environment.mailUrl + email, email).toPromise();

  }

  public async sendEmailAfterBuying( email,cartItems,order){  
    return await this.http.post(environment.mailOrderUrl + email, {cartItems,order}).toPromise();

  }


}