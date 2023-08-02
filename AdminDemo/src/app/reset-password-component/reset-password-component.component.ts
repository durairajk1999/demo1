import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { login } from '../login';
import { PasswordReset } from '../password-reset';
import { PasswordValidation } from '../password-validation';
import { ServicesService } from '../services.service';
import { SignInNavResponse } from '../sign-in-nav-response';
import { Usermenudetails } from '../usermenudetails';

import { EncryptionDTO } from '../encryption-dto';
import { DecryptionDTO } from '../decryption-dto';
import { EncryptionAndDecryption } from '../encryption-and-decryption';



@Component({
  selector: 'app-reset-password-component',
  templateUrl: './reset-password-component.component.html',
  styleUrls: ['./reset-password-component.component.scss']
})
export class ResetPasswordComponentComponent implements OnInit {

  passwordReset: PasswordReset = new PasswordReset();
  signInNavResponse: SignInNavResponse = new SignInNavResponse();

  public formGroup!: FormGroup;

  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  encryptDTO: EncryptionDTO = new EncryptionDTO();
  decryptDTO: DecryptionDTO = new DecryptionDTO();

  encryptandDecryptkey!: string;

  hide = true;
  hide1 = true;
  hide2 = true;

  email = new FormControl();


  hideRequiredMarker = true;
  constructor(private formBuilder: FormBuilder, private userservice: ServicesService, private cdref: ChangeDetectorRef, private spinnerService: NgxSpinnerService, private snackBar: MatSnackBar, private router: Router,) {

    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');


    this.formGroup = formBuilder.group({



      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$#!%*?&]).{8,15}')]],
      confirm_password: ['', [Validators.required]]
    }, {
      validator: PasswordValidation('password', 'confirm_password')
    })
  }
  oldPassword = new FormControl('', [Validators.required]);


  password = new FormControl('', [Validators.required]);


  confirmPassword = new FormControl('', [Validators.required]);


  ngOnInit(): void {




    this.userservice.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;
      const keyValue1 = keys.split("//");
      const firstDecrypt = this.encryptAndDecrypt.decryptfinal(keyValue1[1].trim(), keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      const finalkeyValue1 = finalkeyValue;

      this.encryptandDecryptkey = finalkeyValue1[0].trim();

      // if (this.encryptandDecryptkey != "" || this.encryptandDecryptkey != null) {
      //   this.getValue();
      // }
    });





  }

  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }
  get f() {
    return this.formGroup.controls;
  }
  passwordError() {
    return 'Old password is required';
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
  resetPassword() {
    if (this.passwordReset.oldPassword == "" || this.passwordReset.oldPassword == null || this.passwordReset.confirmPassword == "" || this.passwordReset.confirmPassword == null
      || this.passwordReset.password == "" || this.passwordReset.password == null) {
      this.snackBar.open('Please fill all required fields', '', {

        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'center',


      });
    }


    else if (this.password.invalid || this.oldPassword.invalid) {
      
    }

    else {




      if (this.passwordReset.password == this.passwordReset.confirmPassword) {


        if (this.password.valid) {

          this.spinnerService.show();
          this.passwordReset.userId = this.signInNavResponse.responseContent.id;

          const encryptData = this.encryptAndDecrypt.encryptfinal(this.passwordReset, this.encryptandDecryptkey);

          this.encryptDTO.data = encryptData;

          this.userservice.passwordReset(this.encryptDTO).subscribe(data => {


            this.spinnerService.hide();



            var decryptData = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptandDecryptkey);

            
            this.decryptDTO = JSON.parse(decryptData);

            this.snackBar.open(this.decryptDTO.message, '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',


              });


            if (this.decryptDTO.statusCode == 200) {
              localStorage.clear();
              sessionStorage.clear();
              // this.userservice.passwordChangeRequestUpdate(this.signInNavResponse.responseContent.email).subscribe(data => {
              // })
              this.router.navigate(['/']);

            }

            else if (this.decryptDTO.statusCode == 401) {
              
            }

            else if (this.decryptDTO.statusCode == 409) {
              

            }

            else {
              
            }





          })


        }
        else {
          
        }









      }

      else {
        
      }







    }


  }




  onBlur(): void {
    this.oldPassword.markAsUntouched();

  }
}