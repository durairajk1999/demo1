import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AddAccountRequest } from '../payment-add-account-component/AddAccountRequest';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ServicesService } from 'src/app/services.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';
import { Router } from '@angular/router';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';
import { EncryptionDTO } from 'src/app/encryption-dto';
import { ParentMenu } from 'src/app/parent-menu';
import { ParentMenus } from 'src/app/parent-menus';
import { Subscription, timer } from 'rxjs';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'app-add-account-pop-up-component',
  templateUrl: './add-account-pop-up-component.component.html',
  styleUrls: ['./add-account-pop-up-component.component.scss']
})
export class AddAccountPopUpComponentComponent implements OnInit, OnDestroy {

  hideRequiredMarker = true;

  message!: string;

  finalkeyValue1!: string;

  keyValue1!: string;

  amountValue: any;

  resposneData: ParentMenus = new ParentMenus();

  otpresposneData: ParentMenus = new ParentMenus();

  AccountNumber = "";
  Bank = "";
  IFSC = "";
  BeneficiaryName = "";
  branch = "";
  otpMessage = "";

  encryptDTO: EncryptionDTO = new EncryptionDTO();

  encryptandDecryptkey!: string;


  validatebutton = true;

  confirmButton = false;
  otpfieldcheck = true;



  otpvalid = false;
  mobile!: any;
  mobile1!: any;
  referenceID = "";
  remarks = "";
  amount = ".00";
  optval = "";
  optenterValue = "";
  maxLimit = "";
  transferType = "";

  userId!: any;

  username!: any;

  otpfield = false;

  btnValidbutton!: boolean;

  btnValid = true;

  request: AddAccountRequest = new AddAccountRequest();

  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();
  proceedButton = true;

  commentFC = new FormControl();

  otp = new FormControl();

  signInNavResponse: SignInNavResponse = new SignInNavResponse();

  onBlur(): void {
    this.commentFC.markAsUntouched()
  }

  constructor(public dialogRef: MatDialogRef<AddAccountPopUpComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private service: ServicesService, private spinnerService: NgxSpinnerService, private snackBar: MatSnackBar, private router: Router) {




    this.request = data.BeneAccInfo;


  }
  ngOnDestroy(): void {
    this.countDown.unsubscribe();
  }


  otpEnter(optvalue: string) {

    this.optval = optvalue;
    this.otpfield = false;
    this.otpMessage = "";

    // if(this.optval.length == 6)
    // {



    // }
    // else{

    //   (document.getElementById("proceedbutton") as HTMLElement).style.backgroundColor ="#636370";
    // }




  }

  countDown!: Subscription;
  counter = 300;
  tick = 1000;

  isOtpExpired: any

  startTimer() {
    this.counter = 300;
    this.tick = 1000;
    this.isOtpExpired = false
    this.countDown = timer(0, this.tick).subscribe(() => {
      --this.counter
      if (this.counter === 0) {
        this.isOtpExpired = true;

        this.btnValidbutton = false;
        this.otpfield = false;
        this.otp.reset();
        this.countDown.unsubscribe();
      }
    });
  }




  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  validate() {
    if (this.optval.length == 0) {

      this.otpfield = true;


    }
    else {
      if (this.optval.length == 6) {

        this.otpValidation();

      }

    }
  }

  otpValidation() {
    this.spinnerService.show();

    this.request.otp = this.optval;
    this.request.mobileNumber = this.signInNavResponse.responseContent.mobileNo;

    const optValidateRequest = this.encryptAndDecrypt.encryptfinal(this.request, this.encryptandDecryptkey);

    this.encryptDTO.data = optValidateRequest;
    this.service.otpValidation(this.encryptDTO).subscribe(response => {


      const otpValidateResponse = this.encryptAndDecrypt.decryptfinal(response.data, this.encryptandDecryptkey);



      this.otpresposneData = JSON.parse(otpValidateResponse);

      this.spinnerService.hide();

      if (this.otpresposneData.statusCode == 200) {
        this.proceedButton = false;

        this.otpvalid = true;
        this.btnValid = false;
        this.proceedButton = false;
        this.snackBar.open("OTP is valid", "",
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
            panelClass: 'center',
          });
        this.optval = "";

        this.btnValidbutton=false;
        this.validatebutton = false;

        this.confirmButton = true;
        this.otpfieldcheck = false;




      }
      else if (this.otpresposneData.statusCode == 409) {
        this.optenterValue = "";
        this.optval = "";

        this.proceedButton = true;
        this.btnValidbutton=true;

        this.snackBar.open("OTP is invalid. Please enter valid OTP", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
            panelClass: 'center',
          });
      }
      else if (this.otpresposneData.statusCode == 404) {
        this.proceedButton = true;
        this.optval = "";
        this.optenterValue = "";
        this.btnValidbutton=true;
        this.snackBar.open("OTP is expired", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
            panelClass: 'center',
          });

      }
      else if (this.otpresposneData.statusCode == 500) {
        this.proceedButton = true;
        this.optval = "";
        this.optenterValue = "";
        this.btnValidbutton=true;
        this.snackBar.open("Failure", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
            panelClass: 'center',
          });
      }
      else {
      }
    })

  }

  requestSuccess() {

    this.spinnerService.show();

    const accAddRequest = this.encryptAndDecrypt.encryptfinal(this.request, this.encryptandDecryptkey);


    this.encryptDTO.data = accAddRequest;

    this.service.beneficiaryAddMethod(this.encryptDTO).subscribe(response => {

      const accAddResposnedecrypt = this.encryptAndDecrypt.decryptfinal(response.data, this.encryptandDecryptkey);


      this.otpresposneData = JSON.parse(accAddResposnedecrypt);
      this.message = this.otpresposneData.message;

      this.spinnerService.hide();

      if (this.otpresposneData.statusCode == 200) {
        this.snackBar.open(this.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center'
          });

        this.dialogRef.close(true);
        this.reloadCurrentRoute();
      }
      else {

        if (this.otpresposneData.statusCode == 429) {

          this.snackBar.open(this.message, '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center'
            });
          this.dialogRef.close(true);
          this.reloadCurrentRoute();
        }
        else {

          this.snackBar.open(this.message, '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center'
            });
          this.dialogRef.close(true);
          this.reloadCurrentRoute();
        }
      }

    })
  }
  ngOnInit() {
    this.btnValidbutton = true;
    this.startTimer();

    this.getKey();

    this.initiation();

  }

  proceed() {
    this.requestSuccess();
  }

  cancel() {
    this.dialogRef.close(true);
  }
  resetOTP() {

    this.countDown.unsubscribe();


    this.btnValidbutton = true;
    this.spinnerService.show();

    this.proceedButton = true;
    this.otpfield = false;

    this.btnValidbutton=true;

    this.request.mobileNumber = this.signInNavResponse.responseContent.mobileNo;

    const otpResendRequest = this.encryptAndDecrypt.encryptfinal(this.request, this.encryptandDecryptkey);

    this.encryptDTO.data = otpResendRequest;

    this.service.otpResend(this.encryptDTO).subscribe(res => {


      const decryptReposne = this.encryptAndDecrypt.decryptfinal(res.data, this.encryptandDecryptkey);

      this.resposneData = JSON.parse(decryptReposne);

      this.spinnerService.hide();

      if (this.resposneData.statusCode == 200) {
        this.startTimer();

        this.snackBar.open(this.resposneData.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center'
          });

        this.optenterValue = "";
        this.otpvalid = false;


      }
      else if (this.resposneData.statusCode == 404) {

        this.snackBar.open(this.resposneData.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center'
          });
      }
      else {

        this.snackBar.open(this.resposneData.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center'
          });

      }

    });
  }



  initiation() {
    // this.AccountNumber = this.data.details.beneficiaryAccountNumber;
    // this.Bank = this.data.Bank;
    // this.branch = this.data.branch;
    // this.IFSC = this.data.details.beneficiaryIFSC;
    // this.BeneficiaryName = this.data.details.beneficiaryName;
    // this.remarks = this.data.details.remarks;


    // const amountval = this.request.maxlimit.toString();

    var stringToConvert = this.request.maxlimit;
    var numberValue = Number(stringToConvert);

    let formatAmo = formatNumber(numberValue, 'en-US', '1.2');
    var wholeAmo = formatAmo.replace(/,/g, "")
    var deciAmo = Number(wholeAmo)
    var conv = deciAmo.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    this.amountValue = conv;

















  }


  validateOTP() {




    if (this.optval == "" || this.optval == null) {
      // otp requred
      this.otpfield = true;
      this.otpMessage = " OTP required";

    }
    else {

      if (this.optval.length == 6) {

        this.otpValidation();




      }
      else {


        this.otpMessage = "Enter valid OTP";

      }
    }




  }

  getKey() {

    this.service.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;
      this.keyValue1 = keys.split("//");
      const firstDecrypt = this.encryptAndDecrypt.decryptfinal(this.keyValue1[1].trim(), this.keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      this.finalkeyValue1 = finalkeyValue;

      this.encryptandDecryptkey = this.finalkeyValue1[0].trim();

      if (this.encryptandDecryptkey != "" || this.encryptandDecryptkey != null) {
        this.getValue();
      }
    });


  }


  getValue() {


    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');

    this.userId = this.signInNavResponse.responseContent.id;

    this.username = this.signInNavResponse.responseContent.username;

    this.mobile = this.signInNavResponse.responseContent.mobileNo;
    this.mobile1 = this.mobile.substring(this.mobile.length - 4, this.mobile.length);
  }

}
