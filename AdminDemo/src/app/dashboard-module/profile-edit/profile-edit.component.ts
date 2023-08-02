import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServicesService } from 'src/app/services.service';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';
import { Usermenudetails } from 'src/app/usermenudetails';
import { UserUpdateRequest } from 'src/app/user-update-request';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/User';
import { Router } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

import { EncryptAndDecryptResponse } from 'src/app/encrypt-and-decrypt-response';
import { EncryptionDTO } from 'src/app/encryption-dto';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';


@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {

  email!: string;
  mobileNumber!: string;
  userName!: string;
  firstName!: string;
  lastName!: string;
  userId!: number;

  name: any
  lastname: any
  user: User = new User()
  public formGroup!: FormGroup;

  number!: string;
  hideRequiredMarker = true;
  form: any;


  fname!: boolean;

  lname!: boolean;

  selectedfirstname = "";
  selectedlastename = "";

  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();
  encryptAndDecryptResponse: EncryptAndDecryptResponse = new EncryptAndDecryptResponse();

  encryptDTO: EncryptionDTO = new EncryptionDTO();



  userNameform = new FormControl();

  lastnameform = new FormControl();
  encryptandDecryptkey!: string;


  constructor(private titlecasePipe: TitleCasePipe, public dialogRef: MatDialogRef<ProfileEditComponent>, private cdref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any, private service: ServicesService, private router: Router, private snackBar: MatSnackBar, private spinnerService: NgxSpinnerService, private formBuilder: FormBuilder) {

  }
  userUpdate: UserUpdateRequest = new UserUpdateRequest();
  signInDetail: Usermenudetails = new Usermenudetails();
  signInNavResponse: SignInNavResponse = new SignInNavResponse();

  ngOnInit() {




    this.service.checkPass().subscribe(encryptKeys => {
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






    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');
    // this.firstName =this.signInNavResponse.responseContent.firstName;
    // this.lastName = this.signInNavResponse.responseContent.lastName;
    this.userId = this.signInNavResponse.responseContent.id;
    // this.userName = this.signInNavResponse.responseContent.username;
    // this.mobileNumber = this.signInNavResponse.responseContent.mobileNo;
    // this.email = this.signInNavResponse.responseContent.email;


  }

  emailAddress = new FormControl('', { validators: [Validators.pattern('[a-zA-Z0-9.-]{4,}@([a-zA-Z]+([.-]?[a-zA-Z])){2,}[.]{1}[a-zA-Z]{3}$')] });
  mobile = new FormControl('', [Validators.pattern('^[6-9][0-9]{9}$')]);

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  getMobileError() {
    if (this.mobile.hasError('required')) {
      return 'Mobile number is required';
    }
    return this.mobile.hasError('pattern') ? 'Enter valid mobile number' : '';
  }
  getEmailError() {

    return this.emailAddress.hasError('pattern') ? 'Enter valid Email ID' : '';
  }

  get value() {
    return this.formGroup.controls;
  }
  save() {


    if (this.selectedfirstname == null || this.selectedfirstname == "") {

      this.fname = true;


      if (this.selectedlastename == null || this.selectedlastename == "") {
        this.lname = true;
      }
    }

    else if (this.selectedlastename == null || this.selectedlastename == "") {
      this.lname = true;

      if (this.selectedfirstname == null || this.selectedfirstname == "") {
        this.fname = true;

      }
    }



    else {
      if ((this.userUpdate.userName != null || this.userUpdate.email != null || this.userUpdate.firstName != null || this.userUpdate.mobileNo != null || this.userUpdate.lastName != null) && (this.emailAddress.valid)) {
        if (this.mobile.valid && this.emailAddress.valid && this.userNameform.valid && this.lastnameform.valid) {
          //this.spinnerService.show();

          this.userUpdate.email = this.data.email;

          //this.namef = this.titlecasePipe.transform(this.selectedfirstname);
          

          //this.lastnamef = this.titlecasePipe.transform(this.selectedlastename);
        


          const firstbeneName = this.selectedfirstname.replace(/\b\w/g, (x: string) => x.toUpperCase());

          const lastbeneName = this.selectedlastename.replace(/\b\w/g, (x: string) => x.toUpperCase());

          this.userUpdate.firstName = firstbeneName.trim();
          this.userUpdate.lastName = lastbeneName.trim();

          this.userUpdate.mobileNo = this.data.mobileNo;

          //this.userUpdate.userName = this.data.username

          this.userUpdate.userID = this.userId;


          var encryptData = this.encryptAndDecrypt.encryptfinal(this.userUpdate, this.encryptandDecryptkey);


          this.encryptDTO.data = encryptData;

          this.spinnerService.show();




          this.service.userUpdate(this.encryptDTO).subscribe(data => {


            const decryptData = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptandDecryptkey);


            this.user = JSON.parse(decryptData);

            this.encryptAndDecryptResponse = JSON.parse(decryptData);


            this.spinnerService.hide();

            this.dialogRef.close();
            this.spinnerService.hide();
            if (this.encryptAndDecryptResponse.statusCode == 200) {



              this.signInNavResponse.responseContent.firstName = this.userUpdate.firstName;
              this.signInNavResponse.responseContent.lastName = this.userUpdate.lastName

              // this.signInNavResponse.responseContent.username=this.userUpdate.userName
              this.signInNavResponse.responseContent.mobileNo = this.userUpdate.mobileNo
              sessionStorage.setItem('UserDetails', JSON.stringify(this.signInNavResponse))

              this.snackBar.open(this.encryptAndDecryptResponse.message, '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',
                })
             this.reloadCurrentRoute()
            } else {
              this.snackBar.open(this.encryptAndDecryptResponse.message, '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',
                })
            }
          })

        }

        else {
        }

      }


    }









  }




  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }

  firstNameEnter(firstname: string) {



    this.selectedfirstname = firstname;
    //this.userUpdate.firstName = this.data.firstName=firstname;

    this.fname = false;

  }

  lastNameEnter(lastname: string) {

    this.lname = false;
    this.selectedlastename = lastname;
    //this.userUpdate.lastName = this.data.lastName=lastname;
  }

  usernameEnter(username: string) {
    this.userUpdate.userName = this.data.userName = username;

  }

  mobileNumberEnter(mobileNO: string) {




    this.userUpdate.mobileNo = this.data.mobileNumber = mobileNO;
  }

  emailEnter(email: string) {
    this.userUpdate.email = this.data.email = email;

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


  isAlfa(evt: any) {

    evt = (evt || window.event);
    var charCode = (evt.which || evt.keyCode);
    var del = 'Delete'

    var arrowLeft = 'ArrowLeft'
    var arrowRight = 'ArrowRight'
    var arrow: any

    if (evt.key == arrowRight || evt.key == arrowLeft || evt.key == del) {
      arrow = false;

    } else {
      arrow = true;
    }


    return ((
      (charCode > 32)
      && (charCode < 65 || charCode > 90)
      && (charCode < 97 || charCode > 122) && (arrow)

    ) || this.willCreateWhitespaceSequence(evt)) ? false : true;
  }



  handleInput(event: any) {
    if (event.target.selectionEnd === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }

  onBlur(): void {

    this.userNameform.markAsUntouched();

  }

  onBlur1(): void {

    this.lastnameform.markAsUntouched();

  }


}