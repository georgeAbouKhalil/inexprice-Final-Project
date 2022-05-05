import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CredentialsModel } from '../models/credentials.model';
import { UserModel } from '../models/user.model';
// import { userLoggedInAction, userLoggedOutAction, userRegisteredAction } from '../redux/auth-state';
// import store from '../redux/store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAdmin: boolean = false;

  public userFirstName: string;
  
  constructor(private http: HttpClient) { }

  public async register(user: UserModel) {
    const addedUser = await this.http.post<UserModel>(environment.registerUrl, user).toPromise();
    // store.dispatch(userRegisteredAction(addedUser));
    return addedUser;
}

public async login(credentials: CredentialsModel) {
    const loggedInUser = await this.http.post<UserModel>(environment.loginUrl, credentials).toPromise();
    // store.dispatch(userLoggedInAction(loggedInUser));
    return loggedInUser;
}



public clearUserDataFromServerCache() {
  return this.http.delete<void>("http://localhost:3001/api/auth/logout");
}


public logout(){
//   store.dispatch(userLoggedOutAction());
}

public getUserDetails() {
  return this.http.get('http://localhost:3001/api/auth');
}

}