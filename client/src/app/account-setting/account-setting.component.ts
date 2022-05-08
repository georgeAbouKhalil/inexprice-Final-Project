import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { stringify } from 'querystring';
import { NotifyService } from '../services/notify.service';


@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.css']
})
export class AccountSettingComponent implements OnInit {
  
  credit_card: FormGroup;
  cardNumber:string = "";
  cardHolder:string = "";
  cardDateMM:string = "";
  cardDateYYYY:string = "";
  cardCVV:string = "";
  
  constructor(private cr: FormBuilder,private notify: NotifyService) { }

  ngOnInit(): void {
    this.validCreditCard();
  }
  

  changeCardNumber(updateNumberValue){
    var cardNumber2 = updateNumberValue;
    // Do not allow users to write invalid characters
    var formattedCardNumber = cardNumber2.replace(/[^\d]/g, "");
    formattedCardNumber = formattedCardNumber.substring(0, 16);

    // Split the card number is groups of 4
    var cardNumberSections = formattedCardNumber.match(/\d{1,4}/g);
    if (cardNumberSections !== null) {
        formattedCardNumber = cardNumberSections.join(' ');	
    }
    this.cardNumber = formattedCardNumber;

    // If the formmattedCardNumber is different to what is shown, change the value
    if (cardNumber2 !== formattedCardNumber) {
      this.cardNumber = formattedCardNumber;
    }
  }

  changeCardHolder(updateHolderValue){
    var cardholder2 = updateHolderValue;
    // var cardHolderSections = cardholder2.match('^[A-Z|a-z| ]+$');
    this.cardHolder = updateHolderValue;
    // If the formmattedCardNumber is different to what is shown, change the value
    if (cardholder2 !== updateHolderValue) {
      this.cardHolder = updateHolderValue;
    }
  }

  changeCardDateMM(updateDateMM){
    var cardDateMM2 = updateDateMM;

    var formattedCardDateMM = cardDateMM2.replace(/[^\d]/g, "");
    formattedCardDateMM =formattedCardDateMM.substring(0, 2);

    this.cardDateMM = formattedCardDateMM;

    if(cardDateMM2 !== formattedCardDateMM){
      this.cardDateMM = formattedCardDateMM;
    }
  }

  changeCardDateYYYY(updateDateYYYY){
    var cardDateYYYY2 = updateDateYYYY;

    var formattedCardDateYYYY = cardDateYYYY2.replace(/[^\d]/g, "");
    formattedCardDateYYYY = formattedCardDateYYYY.substring(0, 2);

    this.cardDateYYYY = formattedCardDateYYYY;

    if(cardDateYYYY2 !== formattedCardDateYYYY){
      this.cardDateYYYY = formattedCardDateYYYY;
    }
  }

  changeCardCvv(updateCvv){
    this.notify.success("hover the card to see the CVV");
    var cardCVV2 = updateCvv;
    // var formattedCardCvv = cardCVV2.replace(/[^\d]/g, "");
    var formattedCardCvv = cardCVV2.substring(0, 3);

    this.cardCVV = formattedCardCvv;

    if(cardCVV2 !== formattedCardCvv){
      this.cardCVV = formattedCardCvv;
    }
  }

  validCreditCard(){
    this.credit_card = this.cr.group({
      cardNumberValid: ['', [Validators.required, Validators.pattern('^[0-9| ]+$'),Validators.maxLength(19),Validators.minLength(19)]],
      cardHolderValid: ['', [Validators.required, Validators.pattern('^[A-Z|a-z| ]+$'),Validators.maxLength(25),Validators.minLength(4)]],
      cardDateMM: ['',[Validators.required,Validators.pattern('^[0-9| ]+$'),Validators.minLength(2),Validators.maxLength(2)]],
      cardDateYYYY: ['',[Validators.required]],
      cardCVVValid: ['',[Validators.required,Validators.pattern('^[0-9|]+$'),Validators.minLength(3),Validators.maxLength(3)]],
    });
  }
  

}
