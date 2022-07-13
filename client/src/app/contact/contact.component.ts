import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserModel } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { MailService } from '../services/mail.service';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  user: UserModel;
  userEmail: any;
  userFullName: any;
  userDetails: FormGroup;

  constructor(private mailService: MailService, private _formBuilder: FormBuilder, private authService: AuthService,private notify: NotifyService) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.userFormDetailsValid();
  }


  getUserFullName() {
    if(this.user)
      this.userFullName = this.user.userName + " " + this.user.lastName;
  }
  getUserEmail() {
    if(this.user)
      this.userEmail = this.user.email;
  }

  userFormDetailsValid() {
    this.userDetails = this._formBuilder.group({
      userFullName2: [this.userFullName, [Validators.required]],
      email: [this.userEmail, [Validators.required]]
    });
  }
  async sendMessage() {
     await this.mailService.sendEmail(this.userDetails.value.email);

     this.notify.success("Email sent successfully");
     this.userDetails.reset();

    // here to continue send email to user

  }

}
