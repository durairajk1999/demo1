import { animate } from '@angular/animations';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, Form, FormBuilder, FormControl, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmailResponse } from 'src/app/email-response';
import { PasswordReset } from 'src/app/password-reset';
import { PasswordValidation } from 'src/app/password-validation';
import { ServicesService } from 'src/app/services.service';
import { UrlVerificationResponse } from './url-verification-response';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';



@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
  providers: [DatePipe]
})
export class NewPasswordComponent implements OnInit {

  newPass = false;
  conpass = false;

  public formGroup!: FormGroup;
  hide = true;
  hide1 = true;
  hide2 = true;

  newPassword!: string;
  rePassword!: string;
  userName !: string;
  emailMessage!: string;

  today = new Date();
  encryptandDecryptkey!: string;



  resposeValue: any;

  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();


  oneTimeURL !: any;
  urlVerificationResponse !: UrlVerificationResponse;

  emailResponse: EmailResponse = new EmailResponse();
  hideRequiredMarker = true;
  constructor(private datepipe: DatePipe, private cdref: ChangeDetectorRef, private formBuilder: FormBuilder, private service: ServicesService, private snackBar: MatSnackBar, private router: Router, private spinnerService: NgxSpinnerService, private route: ActivatedRoute) {
    this.formGroup = formBuilder.group({
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$#!%*?&]).{8,15}')]],
      confirm_password: ['', [Validators.required]]
    }, {
      validator: PasswordValidation('password', 'confirm_password')
    })
  }
  oldPassword = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$#!%*?&]).{8,15}')]);


  // password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&]).{8,15}')]],



  confirmPassword = new FormControl('', [Validators.required]);
  ngOnInit() {



   


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

  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }
  get f() {
    this.conpass = false;
    return this.formGroup.controls;
  }
  passwordError() {
    return 'Password is required';
  }
  newPasswordError() {
    if (this.password.hasError('required')) {
      return 'New password is required';
    }
    return this.password.hasError('pattern') ? 'Enter valid password' : '';
  }














  confirmPasswordError() {
    return 'Confirm password is required';
  }

  updatePassword() {
    if ((this.newPassword == "" || this.newPassword == null) && (this.rePassword == "" || this.rePassword == null)) {
      this.newPass = true;
    }
    else if (this.rePassword == "" || this.rePassword == null) {
      //  this.NewPassword = false;
      this.conpass = true;
    }
    else {
      this.spinnerService.show();
      if (this.formGroup.valid) {

        

        const userData = this.userName + " " + this.newPassword

        const encryptData = this.encryptAndDecrypt.encryptfinal(userData, this.encryptandDecryptkey);


        const encodeValue = encodeURIComponent(encryptData);


        this.service.updatePassword(encodeValue).subscribe(data => {
          this.spinnerService.hide();


          var decryptData = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptandDecryptkey)

          this.emailResponse = JSON.parse(decryptData);


          //this.emailResponse = data;
          if (this.emailResponse.statusCode == 200) {
            this.spinnerService.hide();
            this.emailMessage = this.emailResponse.message;
            this.snackBar.open(this.emailMessage, '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',
              });

            localStorage.clear();
            sessionStorage.clear();
            this.service.passwordChangeRequestUpdate(this.userName).subscribe(data => {
            })
            this.router.navigate(['/']);
          } else if (this.emailResponse.statusCode == 400) {
            this.emailMessage = this.emailResponse.message;
            this.snackBar.open(this.emailMessage, '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',
              });
          }
          else {
            this.emailMessage = this.emailResponse.message;
            this.snackBar.open(this.emailMessage, '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',
              });
          }
        })
      }
      else {
        this.spinnerService.hide();
      }
    }
  }








  // date time different 


  dateTimediffrent(linkDate: Date, sysDate: Date) {
    var diff = (sysDate.getTime() - linkDate.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));

  }



  getValue() {
    this.oneTimeURL = this.route.snapshot.paramMap.get('id');

    var datewithTime = this.oneTimeURL.split("!");

    var linkDate = new Date(datewithTime[1] + " " + datewithTime[2])

    this.resposeValue = this.dateTimediffrent(linkDate, this.today)

    if (this.resposeValue < 10) {
      this.service.getURLVerification(datewithTime[0]).subscribe(data => {


        const decryptData = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptandDecryptkey);

        this.urlVerificationResponse = JSON.parse(decryptData);


        

        if (this.urlVerificationResponse.statusCode == 200) {
          this.userName = this.urlVerificationResponse.responseContent;
          this.router.navigateByUrl('password_reset/' + this.oneTimeURL);
        }
        // else {
        //   this.router.navigateByUrl('password_reset');
        // }
        
        else {
          this.router.navigateByUrl('linkExpired');
        }

      });

    }
    else {
      this.router.navigateByUrl('linkExpired');
    }
  }

}