import { Component, Inject, OnInit ,OnDestroy} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, combineLatest, elementAt, timer } from 'rxjs';
import { PopUpComponent } from 'src/app/pop-up-component';
import { ServicesService } from 'src/app/services.service';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';
import { AddAccountRequest } from '../payment-add-account-component/AddAccountRequest';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';
import { EncryptionDTO } from 'src/app/encryption-dto';
import { ParentMenus } from 'src/app/parent-menus';


@Component({
  selector: 'app-payment-confirmation-popup',
  templateUrl: './payment-confirmation-popup.component.html',
  styleUrls: ['./payment-confirmation-popup.component.scss']
})
export class PaymentConfirmationPopupComponent implements OnInit ,OnDestroy {

  commentRequired!: boolean
  commentLen!: boolean
  myForm!: FormGroup;
  hideRequiredMarker = true;
  AccountNumber = "";
  Bank = "";
  IFSC = "";
  BeneficiaryName = "";
  branch = "";
  otpandresend = true;
  validatebutton = true;
  proceedandcancel = false;

  countDown!: Subscription;
  counter = 300;
  tick = 1000;

  isOtpExpired:any

  decryptResposne: ParentMenus = new ParentMenus();
  otpResposne: ParentMenus = new ParentMenus();

  encryptDTO: EncryptionDTO = new EncryptionDTO();

  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  encryptandDecryptkey!: string;

  mobile: any;
  mobile1: any;

  otpvalid = false;
  referenceID = "";
  remarks = "";
  amount = "";
  optval = "";
  optenterValue = "";
  otpMessage = "";

  proceedButton = true;

  otpfield = false;

  request: AddAccountRequest = new AddAccountRequest();

  payment!: FormGroup;
  referenceNumber: any;
  referenceNumberValue: any;
  referenceNumberGeneratedValue: any;
  signInNavResponse: SignInNavResponse = new SignInNavResponse();

  // commentFC = new FormControl('', [Validators.required, Validators.pattern('^([0-9]+(\.?[0-9]{2}?)?)')]);

  commentFC = new FormControl();

  otp = new FormControl();

  // commentFC = new FormControl('', [
  //   Validators.required, 
  //   //Validators.maxLength(6)
  // ]);
  onBlur(): void {
    this.commentFC.markAsUntouched()
  }
  constructor(
    public dialogRef: MatDialogRef<PopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private service: ServicesService, private spinnerService: NgxSpinnerService, private snackBar: MatSnackBar,) {
    // dialogRef.disableClose = true;

   
    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');
  }
  ngOnDestroy(): void {
    this.countDown.unsubscribe();
  }
  onCommentChange() {
  }
  // onNoClick(): void {
  //   this.dialogRef.close();
  // }


  //   myMethod(val:any){ 
  // if(this.commentFC.valid){
  // let enterAmount = Number(val);
  // let maxamount = Number(this.data.maxamount);
  // var stringToConvert =this.data.maxamount ;
  //       var numberValue = Number(stringToConvert);
  //       let num = numberValue;
  //       let Amount = num.toLocaleString("en-IN");
  //       //this.data.comment=Amount;
  // if( enterAmount<= maxamount)
  // {
  //   this.dialogRef.close(val);
  //   this.data=val
  // }
  // else{
  //   var stringToConvert =this.data.maxamount ;
  //       var numberValue = Number(stringToConvert);
  //       let num = numberValue;
  //       let Amount = num.toLocaleString("en-IN");
  //       //this.data.comment=Amount;
  //   this.snackBar.open("Payment can't be more than"+"    "+"₹"+"  "+Amount+".00",'' ,
  //     {
  //     horizontalPosition:'center',
  //     verticalPosition:'top',
  //     duration: 2000,
  //     panelClass: 'center',
  //     });
  // }
  // }
  // else{

  // }
  //   }
  ngOnInit(): void {

    this.service.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;
      const keyValue1 = keys.split("//");
      const firstDecrypt = this.encryptAndDecrypt.decryptfinal(keyValue1[1].trim(), keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      const finalkeyValue1 = finalkeyValue;

      this.encryptandDecryptkey = finalkeyValue1[0].trim();

      if (this.encryptandDecryptkey != "" || this.encryptandDecryptkey != null) {
        this.getValue();
      }
    });

    
   
    
  }
  checkstuff(event: any) {
    if (event.target.value.substr(-1) === ' ' && event.code === 'Space') {
      
    }
  }
  isWhiteSpace(char: any) {
    return (/\s/).test(char);
  }
  willCreateWhitespaceSequence(evt: any) {
    var willCreateWSS = false;
    if (this.isWhiteSpace(evt.key)) {
      var elmInput = evt.currentTarget;
      var content = elmInput.value;
      var posStart = elmInput.selectionStart;
      var posEnd = elmInput.selectionEnd;
      willCreateWSS = (
        this.isWhiteSpace(content[posStart - 1] || '')
        || this.isWhiteSpace(content[posEnd] || '')
      );
    }
    return willCreateWSS;
  }
  handleInput(event: any) {
    if (event.target.selectionEnd === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }
  // getMobileError() {
  //   if (this.commentFC.hasError('required')) {
  //     return 'Amount is required';
  //   }
  //   return this.commentFC.hasError('pattern') ? 'Enter valid Amount ' : '';
  // }
  referenceNumberGeneration(): string {
    this.referenceNumber = Math.floor(Math.random() * 12345678910);
    this.referenceNumberValue = "AE" + this.referenceNumber.toString();
    return this.referenceNumberValue;
  }
  optgenerate() {
  }
  otpEnter(optvalue: string) {

   
    this.optval = optvalue;
    this.otpfield = false;

    this.data.details.otp = optvalue;
    // if(this.optval.length == 6)
    // {
    //   
    //   this.otpValidation();

    // }
    // else{
    //   
    //   (document.getElementById("proceedbutton") as HTMLElement).style.backgroundColor ="#636370";
    // }




  }
  resetOTP() {

    ////"otp reset");
this.countDown.unsubscribe();
    this.spinnerService.show();

    this.proceedButton = true;
    this.otpfield = false;

    this.validatebutton=true;

    const encryptData = this.encryptAndDecrypt.encryptfinal(this.data.details, this.encryptandDecryptkey);


    this.encryptDTO.data = encryptData;

    this.service.otpResend(this.encryptDTO).subscribe(res => {
      // this.openAddFileDialog();


      const decryptData = this.encryptAndDecrypt.decryptfinal(res.data, this.encryptandDecryptkey);




      this.decryptResposne = JSON.parse(decryptData);


      ////res);
      this.spinnerService.hide();

      if (this.decryptResposne.statusCode == 200) {


        this.startTimer();
        this.optenterValue = "";
        this.otpvalid = false;

        this.snackBar.open(this.decryptResposne.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
            panelClass: 'center',
          });


      }
      else if (this.decryptResposne.statusCode == 404) {

        this.snackBar.open(this.decryptResposne.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
            panelClass: 'center',
          });
      }
      else {

        this.snackBar.open(this.decryptResposne.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
            panelClass: 'center',
          });
      }

    });
  }




  proceed() {
    this.dialogRef.close(true);

    // if (this.optenterValue == "" || this.optenterValue == null) {
    //   this.otpfield = true;
    // }

    // else {

    //   if (this.optenterValue != "" || this.optenterValue != null) {
    //     this.otpfield = false;



    //   }

    // }







  }

  cancel() {
    this.dialogRef.close(false);

    ////"cancel")

  }

  submit() {
    ////"submit")
  }

  otpValidation() {

    //"final out put")
    //this.data.details);
    this.spinnerService.show();


    //this.service.otpValidation(this.AccountNumber,this.optval,this.signInNavResponse.responseContent.id,this.signInNavResponse.responseContent.username ).subscribe(response=>


    const encryptOPTRequest = this.encryptAndDecrypt.encryptfinal(this.data.details, this.encryptandDecryptkey);

    this.encryptDTO.data = encryptOPTRequest;


    this.service.otpValidation(this.encryptDTO).subscribe(response => {
      ////response)


      const otpResponse = this.encryptAndDecrypt.decryptfinal(response.data, this.encryptandDecryptkey);
      this.otpResposne = JSON.parse(otpResponse);


      this.spinnerService.hide();

      if (this.otpResposne.statusCode == 200) {

        this.proceedButton = false;

        this.otpvalid = true;
        this.snackBar.open("OTP is valid ", "",
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
            panelClass: 'center',
          });

        this.otpandresend = false;
        this.validatebutton = false;
        this.proceedandcancel = true;


      }
      else if (this.otpResposne.statusCode == 409) {

        this.optenterValue = "";
        this.snackBar.open("OTP is invalid. Please enter valid OTP", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
            panelClass: 'center',
          });
      }
      else if (this.otpResposne.statusCode == 404) {


        this.optenterValue = "";
        this.snackBar.open("OTP is expired", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
            panelClass: 'center',
          });

      }
      else if (this.otpResposne.statusCode == 500) {

        this.optenterValue = "";
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



  initiation() {
    this.AccountNumber = this.data.details.beneficiaryAccountNumber;
    this.Bank = this.data.Bank;
    this.branch = this.data.branch;
    this.IFSC = this.data.details.beneficiaryIFSC;
    this.BeneficiaryName = this.data.details.beneficiaryName;
    this.remarks = this.data.details.remarks;

    this.mobile = this.signInNavResponse.responseContent.mobileNo;
    this.mobile1 = this.mobile.substring(this.mobile.length - 4, this.mobile.length);


    const amountval = this.data.details.transferAmount.toString();

    if (amountval.includes(".")) {
      this.amount = this.data.details.transferAmount;

    }
    else {
      this.amount = this.data.details.transferAmount + ".00";
    }

    this.referenceNumberGeneratedValue = this.referenceNumberGeneration();
    this.referenceID = this.data.details.customerRequestReferenceNumber;

    // if(this.data.details.transferAmount.include("."))
    // {
    //   ////"dot. contains ");
    // }


    this.startTimer();



   
  }

  validateOTP() {

    // if(this.optval == ""|| this.optval == null)
    // {
    //   // otp requred
    //   this.otpfield=true;
    //   this.otpMessage =" OTP required";

    //   ////"otp is required");
    // }
    // else{

    //   if(this.optval.length == 6)
    // {
    //   //////////////"length 6");
    //   this.otpValidation();

    //   ////"otp is fine");


    // }
    // else{

    //   ////"otp shoul 6 digit");
    //   this.otpMessage =" OTP should be 6 digit";

    // }
    // }

    // kaviya

    if (this.optval.length == 0) {
      // otp requred
      this.otpfield = true;
      // this.otpMessage = " OTP required";
      ////"otp is required");
    }
    // else if (this.optval.length < 6 && this.optval.length != 0) {

    //   ////"otp shoul 6 digit");
    //   // this.otpfield = true;
    //   this.otpMessage = " OTP should be 6 digit";

    // }
    else if (this.optval.length == 6) {
      //////////////"length 6");
      this.otpValidation();

      //"otp is fine");

    }



  }

  getValue()
  {
    this.initiation();
  }

  

  startTimer() {
    this.counter=300;
    this.isOtpExpired=false
    this.countDown = timer(0, this.tick).subscribe(() => {--this.counter
      if (this.counter === 0) {
        this.isOtpExpired=true;
        this.validatebutton=false;
        this.otp.reset();
        this.countDown.unsubscribe();
      }

    });
  }
}