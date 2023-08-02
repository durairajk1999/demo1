import { state } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { strings } from '@material/select';
import { NavigationStart, Router } from '@angular/router';

import { error } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { Global } from '../globalComponent/Global';
import { login } from '../login';
import { HttpErrorResponse } from '../login-error';
import { Response } from '../response';


import { ServicesService } from '../services.service';

import { EncryptionDTO } from '../encryption-dto';
import { EncryptionAndDecryption } from '../encryption-and-decryption';
import { EnvService } from '../service/env.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  hide = true;

  hideRequiredMarker = true


  numboolean!: boolean;
  returnResponse!: boolean;

  statusCode!: string;

  status!: boolean;

  passwordValue = ""
  usernameValue = "";
  passwordvalue = false;
  usernameForm = false;

  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  encyptionrequest: EncryptionDTO = new EncryptionDTO();

  signInResponse: Response = new Response();

  

  /// durai//

  keyValue1!: string;
  finalkeyValue1!: string;

  signIn: login = new login();
  adminDetails: login = new login();
  loginerror: HttpErrorResponse = new HttpErrorResponse();

  constructor(private env: EnvService, private router: Router, private formBuilder: FormBuilder, private cdref: ChangeDetectorRef, private service: ServicesService, private snackBar: MatSnackBar, private spinnerService: NgxSpinnerService) {

    // router.events.forEach((event) => {
    //   if (event instanceof NavigationStart) {
    //     if (event.navigationTrigger === 'popstate') {
    //       

    //       if (this.router.url === "/admin") {
    //         this.router.navigateByUrl('/')
    //       }
    //     }
    //   }
    // });



    if (this.env.isExpired === true) {


      this.snackBar.open("Session expired", '',
        {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          // duration: 3000,
          panelClass: 'center',

        });
    }
  }

  ngOnInit() {


    // this.spinnerService.show();
    //  setTimeout(() => {

    //       this.spinnerService.hide();


    //       }, 5000);





  }

  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }

  //username = new FormControl();
  password = new FormControl();


  username = new FormControl();

  @ViewChild("myInput") private _inputElement!: ElementRef;


  @ViewChild('inputValue') private inputValue!: ElementRef<HTMLInputElement>;


  autofocus() {
    this.inputValue.nativeElement.focus();
  }

  getUserNameError() {
    if (this.username.hasError('required')) {
      return 'Username is required';
    }
    return this.username.hasError('pattern') ? 'Enter valid uername' : '';

  }

  focus() {
    this._inputElement.nativeElement.focus();

  }


  getPasswordError() {
    if (this.password.hasError('required')) {
      return 'Password is required';
    }
    return "";

  }



  signInCalling() {




    if (this.usernameValue == "" || this.usernameValue == null) {
      this.usernameForm = true;

      if (this.signIn.password == "" || this.signIn.password == null) {

        this.passwordvalue = true;
      }

    }

    else if (this.signIn.password == "" || this.signIn.password == null) {

      this.passwordvalue = true;

    }

    else {


      if (this.username.status == "INVALID") {

      }
      else {
        this.spinnerService.show();



        this.service.checkPass().subscribe(encryptKeys => {
          const keys = encryptKeys.data;
          this.keyValue1 = keys.split("//");
          const firstDecrypt = this.encryptAndDecrypt.decryptfinal(this.keyValue1[1].trim(), this.keyValue1[0].trim());
          const jsonString = JSON.parse(firstDecrypt);
          const finalkeyValue = jsonString.split("|");
          this.finalkeyValue1 = finalkeyValue;


          this.afterfetchKeys();
        });
      }



    }


  }


  email() {

    this.status = this.service.urlCalling(this.router.url)

    if (this.status == true) {


      this.router.navigateByUrl("/password_reset")
    }

    else {


      this.router.navigateByUrl('admin');
    }



  }

  onBlur(): void {

    this.username.markAsUntouched();

  }

  onBlur1(): void {

    this.password.markAsUntouched();

  }

  userNamePasswordIncorrect() {


    this.usernameValue = "";
    this.passwordValue = "";
    this.snackBar.open("Username or password is incorrect", '',
      {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'center',


      });
    this.autofocus();



  }



  passwordValueEnter(passvalue: string) {

    this.snackBar.dismiss();

    this.signIn.password = passvalue;

    this.passwordvalue = false;

  }

  userNameEnter(username: string) {



    this.snackBar.dismiss();
    this.usernameForm = false;
    this.signIn.username = username;

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








  // isAlfaPassword(evt: any) {


  //   evt = (evt || window.event);
  //   var charCode = (evt.which || evt.keyCode);
  //   var slash = "/";
  //   var hypen = "@";
  //   var openBracket = "(";
  //   var closeBracket = ")";
  //   var specialCharacters: any

  //   var arrowLeft = 'ArrowLeft';
  //   var arrowRight = 'ArrowRight';

  //   if ( evt.key==arrowRight||evt.key==arrowRight||evt.key == arrowLeft||slash == evt.key || hypen == evt.key || openBracket == evt.key || closeBracket == evt.key || evt.key == "." || evt.key == ",") {
  //     specialCharacters = false;
  //   }
  //   else {
  //     specialCharacters = true;
  //   }
  //   // number if
  //   var numberBoolean: any;
  //   if (evt.key == "0" || evt.key == "1" || evt.key == "2" || evt.key == "3" || evt.key == "4" || evt.key == "5" || evt.key == "6" || evt.key == "7" || evt.key == "8" || evt.key == "9") {
  //     ////;;.log("number enter")
  //     numberBoolean = false;
  //   }
  //   else {
  //     numberBoolean = true;
  //   }
  //   return (((charCode > 32) && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122) && (specialCharacters) && (numberBoolean)) || this.willCreateWhitespaceSequence(evt)) ? false : true;
  // }




  handleInput(event: any) {
    if (event.target.selectionEnd === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }



  isAlfaUserName(evt: any) {

    evt = (evt || window.event);
    var charCode = (evt.which || evt.keyCode);
    var dot = ".";
    var at = "@";

    var specialCharacters: any

    var arrowLeft = 'ArrowLeft';
    var arrowRight = 'ArrowRight';

    var numvalue = evt.code;



    if (numvalue.substring(0, 3) == "Num") {
      this.numboolean = true;
    }
    else {
      this.numboolean = false;
    }


    if (this.numboolean)  // num value enter true
    {

      if (evt.key == ".") {
        this.returnResponse = true;

      }
      else {

        this.returnResponse = false;

      }
      return this.returnResponse;

    }


    else {   // num value false

      if (evt.key == arrowRight || evt.key == arrowRight || evt.key == arrowLeft || dot == evt.key || at == evt.key || evt.key == "." || evt.key == ",") {
        specialCharacters = false;
      }

      else {
        specialCharacters = true;
      }
      // number if
      var numberBoolean: any;
      if (evt.key == "0" || evt.key == "1" || evt.key == "2" || evt.key == "3" || evt.key == "4" || evt.key == "5" || evt.key == "6" || evt.key == "7" || evt.key == "8" || evt.key == "9") {
        numberBoolean = false;
      }
      else {
        numberBoolean = true;
      }

      this.returnResponse = (((charCode > 32) && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122) && (specialCharacters) && (numberBoolean)) || this.willCreateWhitespaceSequence(evt)) ? false : true;
      return this.returnResponse;

    }





  }




  afterfetchKeys() {







    const encryptData = this.encryptAndDecrypt.encryptfinal(this.signIn, this.finalkeyValue1[0].trim());
    this.encyptionrequest.data = encryptData;
    this.service.signInCalling(this.encyptionrequest).subscribe(signInDetails => {
      ////;;.log(signInDetails)
      this.spinnerService.hide();
      var decryptResposne = this.encryptAndDecrypt.decryptfinal(signInDetails.data, this.finalkeyValue1[0].trim());

      var json = JSON.parse(decryptResposne);
      this.signInResponse = json;




      if (this.signInResponse.statusCode === 200) {

        // this.service.passwordChangeRequest(this.signIn.username).subscribe(data => {
        // });
        sessionStorage.setItem('UserDetails', JSON.stringify(json))

      }



      //this.signInResponse = signInDetails;

      this.adminDetails = this.signInResponse.responseContent;






      if (json.statusCode == "409") {

        this.userNamePasswordIncorrect();
      }


      if (typeof (this.adminDetails) == "undefined") {

      }


      else {



        if (this.adminDetails.loginCount == 0) {

          this.service.isLoggedIn.next(true);

          this.router.navigateByUrl('change_password')
        }
        else {


          this.service.isLoggedIn.next(true);



          if (this.adminDetails.userMenuUrl.includes('ia/view')) {
            this.adminDetails.userMenuUrl.push('ia/creation');
          }
          this.adminDetails.userMenuUrl.push('notification');

          sessionStorage.setItem('userMenuUrl', JSON.stringify(this.adminDetails.userMenuUrl));

          this.router.navigateByUrl('welcome');
          // this.router.navigateByUrl('Admin', { state: { json } });


        }


      }

    }, error => {

      this.spinnerService.hide();
      //this.password.reset();

      this.statusCode = error.status;


      if (this.statusCode == "400") {

        this.snackBar.open(error.error.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',
          });

      }

      else {


        this.snackBar.open("Username or password is incorrect", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });



      }






    });
  }


}