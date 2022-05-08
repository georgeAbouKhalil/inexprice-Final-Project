import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CredentialsModel } from '../models/credentials.model';
import { UserModel } from '../models/user.model';
// import { userLoggedInAction, userLoggedOutAction, userRegisteredAction } from '../redux/auth-state';
// import store from '../redux/store';
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
      // this.isAdmin = store.getState().authState.user?.isAdmin;
    }
   }

  public async register(user: UserModel) {
    const addedUser = await this.http.post<UserModel>(environment.registerUrl, user).toPromise();
    // store.dispatch(userRegisteredAction(addedUser));
    return addedUser;
}

public async login(credentials: CredentialsModel) {
    const loggedInUser = await this.http.post<UserModel>(environment.loginUrl, credentials).toPromise();   
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    // store.dispatch(userLoggedInAction(loggedInUser));
    return loggedInUser;
}



public clearUserDataFromServerCache() {
  localStorage.removeItem("user");
  return this.http.delete<void>("http://localhost:3001/api/auth/logout");
}


public logout(){
  localStorage.removeItem("user");
  localStorage.removeItem("cart");
//   store.dispatch(userLoggedOutAction());
}

public getUserDetails() {
  return this.http.get('http://localhost:3001/api/auth');
}

public getUser() {
  const token = localStorage.getItem("user");
  if (token) {
    const decodedData = jwtDecode(token);
    const user = (decodedData as any).user;
    return user;
  }

}

}