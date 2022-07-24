import { UserModel } from 'src/app/models/user.model';
import { CreditCardModel } from './../models/creditCard.model';
import { CreditCardService } from './../services/creditCard.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { stringify } from 'querystring';
import { NotifyService } from '../services/notify.service';
import { AuthService } from '../services/auth.service';
import { style } from '@angular/animations';
import { async } from 'rxjs';


@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent implements OnInit {
  public user: any;

  credit_card: FormGroup;
  Password_valid: FormGroup;
  oldPassword: String = "";
  confrimPassword: String = "";
  oldPasswordFromDB: string = "";

  cardNumber: string = "";
  cardHolder: string = "";
  cardDateMM: string = "";
  cardDateYYYY: string = "";
  cardCVV: string = "";
  rotato: any;
  creditCards: any = [] = [];


  clickUpdate: boolean = false;

  userImage: string = ""

  newDetail = new UserModel();
  mask = [/[0-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(public myAuthService: AuthService, private cr: FormBuilder, private ps: FormBuilder, private notify: NotifyService, private creditService: CreditCardService) { }

  async ngOnInit() {
    this.user = this.myAuthService.getUser();

    if (this.user.gender === "Male")
      this.userImage = "assets/img/product/review-1.png"
    else
      this.userImage = "assets/img/blog/c3.jpg"

    this.validCreditCard();
    this.validPasswordUser();
    this.creditCards = await this.creditService.getCreditCardById(this.user._id);



  }


  changeCardNumber(updateNumberValue) {
    var cardNumber2 = updateNumberValue;
    // Do not allow users to write invalid characters
    var formattedCardNumber = cardNumber2?.replace(/[^\d]/g, "");
    formattedCardNumber = formattedCardNumber?.substring(0, 16);

    // Split the card number is groups of 4
    var cardNumberSections = formattedCardNumber?.match(/\d{1,4}/g);
    if (cardNumberSections !== null) {
      formattedCardNumber = cardNumberSections?.join(' ');
    }
    this.cardNumber = formattedCardNumber;

    // If the formmattedCardNumber is different to what is shown, change the value
    if (cardNumber2 !== formattedCardNumber) {
      this.cardNumber = formattedCardNumber;
    }
  }

  changeCardHolder(updateHolderValue) {
    var cardholder2 = updateHolderValue;
    // var cardHolderSections = cardholder2.match('^[A-Z|a-z| ]+$');
    this.cardHolder = updateHolderValue;
    // If the formmattedCardNumber is different to what is shown, change the value
    if (cardholder2 !== updateHolderValue) {
      this.cardHolder = updateHolderValue;
    }
  }

  changeCardDateMM(updateDateMM) {
    var cardDateMM2 = updateDateMM;

    var formattedCardDateMM = cardDateMM2?.replace(/[^\d]/g, "");
    formattedCardDateMM = formattedCardDateMM?.substring(0, 2);

    this.cardDateMM = formattedCardDateMM;

    if (cardDateMM2 !== formattedCardDateMM) {
      this.cardDateMM = formattedCardDateMM;
    }
  }

  changeCardDateYYYY(updateDateYYYY) {
    var cardDateYYYY2 = updateDateYYYY;

    var formattedCardDateYYYY = cardDateYYYY2?.replace(/[^\d]/g, "");
    formattedCardDateYYYY = formattedCardDateYYYY?.substring(0, 2);

    this.cardDateYYYY = formattedCardDateYYYY;

    if (cardDateYYYY2 !== formattedCardDateYYYY) {
      this.cardDateYYYY = formattedCardDateYYYY;
    }
  }

  changeCardCvv(updateCvv) {

    var cardCVV2 = updateCvv;

    var formattedCardCvv = cardCVV2?.substring(0, 3);

    this.cardCVV = formattedCardCvv;

    if (cardCVV2 !== formattedCardCvv) {
      this.cardCVV = formattedCardCvv;
    }
  }

  validCreditCard() {
    this.credit_card = this.cr.group({
      user_id: [this.user._id],
      card_number: ['', [Validators.required, Validators.pattern('^[0-9| ]+$'), Validators.maxLength(19), Validators.minLength(19)]],
      card_holder: ['', [Validators.required, Validators.pattern('^[A-Z|a-z| ]+$'), Validators.maxLength(25), Validators.minLength(4)]],
      cvv: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(3), Validators.maxLength(3)]],
      date_mm: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])$'), Validators.minLength(2), Validators.maxLength(2)]],
      date_yyyy: ['', [Validators.required, Validators.pattern('^(2[2-9])$'), Validators.minLength(2), Validators.maxLength(2)]],
    });
  }
  async onSubmit() {
    try {
      if (this.credit_card.valid) {
        this.credit_card.value.card_number = this.credit_card.value.card_number.slice(14, 19).trim();
        const newCard = await this.creditService.addCreditCard({ ...this.credit_card.value });
        this.notify.success("credit card successfuly added");
        this.creditCards.push(newCard);
        this.credit_card.reset();

      }

    } catch (err) {
      alert(err)
    }
  }

  public async deleteCreditCart(creditCard: CreditCardModel) {
    try {

      await this.creditService.deleteCreditCard(creditCard._id);
      const indexToDelete = this.creditCards.findIndex(t => t._id === creditCard._id);
      this.creditCards.splice(indexToDelete, 1);

    }
    catch (err: any) {
      this.notify.error(err);
    }
  }

  validPasswordUser() {
    this.Password_valid = this.ps.group({
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]],
      oldPassword: [this.oldPassword],
      confrimPassword: [this.confrimPassword]
    });
  }

  sendOldPassword(updateOldPassword) {
    this.oldPassword = updateOldPassword;

  }
  sendConfrimPassword(updateConfirmPassword) {
    this.confrimPassword = updateConfirmPassword;
  }



  async onSubmitPassword() {

    try {
      if (this.oldPassword === this.user.password && this.oldPassword !== this.confrimPassword) {
        if (this.Password_valid.valid) {
          this.user.password = this.confrimPassword;
          await this.myAuthService.changePassword(this.user);
          this.Password_valid.reset();
          this.notify.success("password has been changed please login again")
          this.myAuthService.logout();
          window.location.href = "home";
        }
      } else {
        this.notify.error("wrong password");
      }
    } catch (err) {
      this.notify.error("something wrong");
    }
  }





  async updateUserDetail(user) {
    //check the new object of user (updated field if are empty or made change)
    if (Object.keys(this.newDetail).length === 0) {
      this.clickUpdate = false;
      return;
    }
    await this.myAuthService.changeUserDetails(user, this.newDetail);
    this.notify.success("Please login again")
    this.myAuthService.logout();
    window.location.href = "home";


  }


  async onSubmitUser() {
    this.clickUpdate = true;
  }

}
