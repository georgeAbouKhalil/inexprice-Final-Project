import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CredentialsModel } from 'src/app/models/credentials.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public credentials = new CredentialsModel();
  
  constructor(public myAuthService: AuthService,private myRouter: Router,) { }

  ngOnInit(): void {
  }

  public async login() {
    try {
      await this.myAuthService.login(this.credentials);
      // this.notify.success("You are logged-in 😊 ");
      // this.myRouter.navigateByUrl("/home");
      window.location.href = "home"

    }
    catch (err) {
      // this.notify.error(err);
      alert(err)
    }
  }

}
