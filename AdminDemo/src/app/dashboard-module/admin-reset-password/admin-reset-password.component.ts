import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmailResponse } from 'src/app/email-response';
import { EncryptAndDecryptResponse } from 'src/app/encrypt-and-decrypt-response';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';


import { ServicesService } from 'src/app/services.service';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';

@Component({
  selector: 'app-admin-reset-password',
  templateUrl: './admin-reset-password.component.html',
  styleUrls: ['./admin-reset-password.component.scss']
})
export class AdminResetPasswordComponent implements OnInit {


  public formGroup!: FormGroup;

  hideRequiredMarker = true;

  keyValue1!: string;

  finalkeyValue1!: string;

  signInNavResponse: SignInNavResponse = new SignInNavResponse();
  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  // encryptAndDecrypt:EncryptionAndDecryption = new EncryptionAndDecryption();

  encryptandDecryptkey!: string;
  emailResponse: EmailResponse = new EmailResponse();

  emailAddress = false;
  email!: string;
  responseMessage!: string;
  constructor(private service: ServicesService, private cdref: ChangeDetectorRef, private router: Router, private snackBar: MatSnackBar, private spinnerService: NgxSpinnerService) {
    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');

  }

  ngOnInit(): void {

    this.getkey();


   

  }
  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }

  userId: any

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  sendResetEmail() {
    this.userId = this.signInNavResponse.responseContent.id
    localStorage.setItem('email', this.email);

    this.service.updateApprovalMessage(this.email);
    if (this.email == "" || this.email == null) {
      this.emailAddress = true;
    } else {
      if (this.emailID.status == "INVALID") {
        // dont call 
      }
      else {
        this.spinnerService.show();

        const userValue = this.email + " " + this.userId;

        const encryptValue = this.encryptAndDecrypt.encryptfinal(userValue, this.encryptandDecryptkey);


        const encodeValue = encodeURIComponent(encryptValue);


        this.service.sendPasswordResetEmailByAdmin(encodeValue).subscribe(data => {


          const decrypData = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptandDecryptkey);



          this.emailResponse = JSON.parse(decrypData);
          if (this.emailResponse.statusCode == 200) {
            this.spinnerService.hide();
            this.responseMessage = this.emailResponse.message;
            this.snackBar.open(this.responseMessage, '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center'
              });
            this.reloadCurrentRoute()
          } else if (this.emailResponse.statusCode == 409) {
            this.spinnerService.hide();

            if (this.emailResponse.message == "Email ID not exist") {
              this.snackBar.open("Email ID not exists", '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center'
                });
            }
            else {
              this.spinnerService.hide();
              this.responseMessage = this.emailResponse.message;
              this.snackBar.open(this.responseMessage, '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center'
                });
            }
          }
          else {
            this.responseMessage = this.emailResponse.message;
            this.spinnerService.hide();
            this.snackBar.open(this.responseMessage, '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center'
              });
            this.reloadCurrentRoute()

          }
        })
      }
    }
  }

  //emailID = new FormControl('', { validators: [Validators.required, Validators.pattern('^[a-zA-Z]+([.-]?[a-zA-Z0-9]+)*@([a-zA-Z]+([.-]?[a-zA-Z]))[.]{1}[a-zA-Z]{3}$')] });


  //emailID = new FormControl('', { validators: [Validators.required, Validators.pattern('[a-zA-Z0-9.]{1,30}@anniyam.com$')] });

  emailID = new FormControl('', { validators: [Validators.required, Validators.pattern('^[a-z]{2,30}[a-zA-Z0-9.]{0,15}@anniyam.com$')] });



  getEmailError() {
    if (this.emailID.hasError('required')) {
      return 'Email ID is required';
    }
    return this.emailID.hasError('pattern') ? 'Enter valid Email ID' : '';
  }

  onBlur(): void {
    this.emailID.markAsUntouched();
  }

  getkey() {


    this.service.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;
      this.keyValue1 = keys.split("//");
      const firstDecrypt = this.encryptAndDecrypt.decryptfinal(this.keyValue1[1].trim(), this.keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      this.finalkeyValue1 = finalkeyValue;

      this.encryptandDecryptkey = this.finalkeyValue1[0].trim();


    });





  }
}



