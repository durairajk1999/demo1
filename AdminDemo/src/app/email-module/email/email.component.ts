import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationStart, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { EmailResponse } from 'src/app/email-response';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';


import { ServicesService } from 'src/app/services.service';


@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {

  public formGroup!: FormGroup;

  hide = true;
  hide1 = true;
  hide2 = true;
  hideRequiredMarker = true;
  encryptandDecryptkey!: string;


  emailResponse: EmailResponse = new EmailResponse();


  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  emailAddress = false;
  email!: string;
  responseMessage!: string;
  constructor(private service: ServicesService, private cdref: ChangeDetectorRef, private router: Router, private snackBar: MatSnackBar, private spinnerService: NgxSpinnerService) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        if (event.navigationTrigger === 'popstate') {
          if (this.router.url === "/admin") {
            this.router.navigateByUrl('/')
            this.reloadCurrentRoute();
          }
        }
      }
    });
  }

  ngOnInit(): void {


    this.service.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;
      const keyValue1 = keys.split("//");
      const firstDecrypt = this.encryptAndDecrypt.decryptfinal(keyValue1[1].trim(), keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      this.encryptandDecryptkey = finalkeyValue[0].trim();



    });





  }
  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }

  //emailID = new FormControl('', { validators: [Validators.required, Validators.pattern('[a-zA-Z0-9.]{1,30}@anniyam.com$')] });


  emailID = new FormControl('', { validators: [Validators.required, Validators.pattern('^[a-z]{2,30}[a-zA-Z0-9.]{0,15}@anniyam.com$')] });


  //emailID = new FormControl('', { validators: [Validators.required, Validators.pattern('^[a-zA-Z]+([.-]?[a-zA-Z0-9]+)*@([a-zA-Z]+([.-]?[a-zA-Z]))[.]{1}[a-zA-Z]{3}$')] });


  sendPasswordResetEmail() {

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

        const encryptData = this.encryptAndDecrypt.encryptfinal(this.email, this.encryptandDecryptkey);
        const encryptDataValue = encodeURIComponent(encryptData);


        

        this.service.sendPasswordResetEmail(encryptDataValue).subscribe(data => {

          const decryptData = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptandDecryptkey);


          const jsonValue = JSON.parse(decryptData);

          this.emailResponse = jsonValue;
          if (this.emailResponse.statusCode == 200) {
            this.spinnerService.hide();
            this.responseMessage = this.emailResponse.message;
            this.snackBar.open(this.responseMessage, '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',


              });

            this.router.navigate(['admin'])

            this.reloadCurrentRoute();

          } else if (this.emailResponse.statusCode == 409) {
            this.spinnerService.hide();

            if (this.emailResponse.message == "Email ID not exist") {
              this.snackBar.open("Email ID not exists", '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',
                });

            }

            else {

              this.responseMessage = this.emailResponse.message;

              this.snackBar.open(this.responseMessage, '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',
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
                panelClass: 'center',
              });
            this.router.navigate(['password_reset'])
          }

        })

      }

    }



  }


  getEmailError() {
    if (this.emailID.hasError('required')) {
      return 'Email ID is required';
    }
    return this.emailID.hasError('pattern') ? 'Enter valid Email ID' : '';
  }




  onBlur(): void {
    this.emailID.markAsUntouched();

  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}