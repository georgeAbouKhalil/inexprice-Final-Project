import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CredentialsModel } from '../models/credentials.model';
import { UserModel } from '../models/user.model';
import jwtDecode from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAdmin: boolean = false;
  public isLoggedIn: boolean = false;

  public userFirstName: string;

  constructor(private http: HttpClient) {
    if (localStorage.getItem('user')) {
      this.isLoggedIn = true;
    }
  }

  public async register(user: UserModel) {
    const addedUser = await this.http.post<UserModel>(environment.registerUrl, user).toPromise();
    return addedUser;
  }

  public async login(credentials: CredentialsModel) {
    const loggedInUser = await this.http.post<UserModel>(environment.loginUrl, credentials).toPromise();
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    return loggedInUser;
  }



  public clearUserDataFromServerCache() {
    localStorage.removeItem("user");
    return this.http.delete<void>("http://localhost:3001/api/auth/logout");
  }


  public logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("rates");
  }

  public getUserDetails() {
    return this.http.get('http://localhost:3001/api/auth');
  }


  async getUserDetail(userName){
    return await this.http.get('http://localhost:3001/api/auth/user/' + userName).toPromise();
  }

  public async getUserRating(userName) {
    const rates = await this.http.get('http://localhost:3001/api/auth/rating/' + userName).toPromise();
    localStorage.setItem("rates", JSON.stringify(rates));
    return rates;

  }

  public getUser() {
    const token = localStorage.getItem("user");
    if (token) {
      const decodedData = jwtDecode(token);
      const user = (decodedData as any).user;
      return user;
    }

  }

  // public async changePassword(password: any) {
  public async changePassword(user: any) {
    return await this.http.put<UserModel>('http://localhost:3001/api/auth/' + user._id, user).toPromise();
  }

  public async changeUserDetails(user: any, newDetails) {
    return await this.http.patch<UserModel>('http://localhost:3001/api/auth/' + user._id, newDetails).toPromise();
  }


  public async updateUser(user: any) {
    const updateUserRate =  await this.http.put<UserModel>('http://localhost:3001/api/auth/' + user._id, user).toPromise();
    setTimeout(() => { localStorage.setItem("rates", JSON.stringify(updateUserRate)) },1)
    return updateUserRate;

  }

}