import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CartsService } from '../services/cart.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {
        showError: true,
        displayDefaultIndicatorType: false
      }
    }
  ]
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  formBuilder: FormBuilder;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourFormGroup: FormGroup;

  completed = false;
  constructor( private cartsService: CartsService , private _formBuilder: FormBuilder, private myAuthService: AuthService,private myRouter: Router,) { }

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm() {
    this.firstFormGroup = this._formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('^[A-Z|a-z| ]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[A-Z|a-z| ]+$')]],
    });
    this.secondFormGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required, Validators.pattern('^[A-Z|a-z| ]+$')]],
      country: ['', [Validators.required, Validators.pattern('^[A-Z|a-z| ]+$')]]
    });
    this.thirdFormGroup = this._formBuilder.group({
      birthday: ['', [Validators.required]],
      gender: ['', [Validators.required, Validators.pattern('^Male$|^Female$')]],
    });
    this.fourFormGroup = this._formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(19)]],
      business: ['', [Validators.required, Validators.pattern('^Business$|^Private$')]],
    });
  }
  async onSubmit() {
    try {
      if (this.firstFormGroup.valid && this.secondFormGroup.valid && this.thirdFormGroup.valid && this.fourFormGroup.valid) {
        console.log(this.firstFormGroup.value);
        console.log(this.secondFormGroup.value);
        console.log(this.thirdFormGroup.value);
        console.log(this.fourFormGroup.value);

        await this.myAuthService.register({ ...this.firstFormGroup.value, ...this.secondFormGroup.value , ...this.thirdFormGroup.value, ...this.fourFormGroup.value  });
        this.myRouter.navigate(['/login']);
        this.cartsService.cartItems = [];
      }

    } catch (err) {
      alert(err)
    }


  }

  public mask = [/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

}
