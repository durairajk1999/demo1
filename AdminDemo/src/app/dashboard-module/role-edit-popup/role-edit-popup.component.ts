import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EncryptAndDecryptResponse } from 'src/app/encrypt-and-decrypt-response';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';


import { ServicesService } from 'src/app/services.service';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';

@Component({
  selector: 'app-role-edit-popup',
  templateUrl: './role-edit-popup.component.html',
  styleUrls: ['./role-edit-popup.component.scss']
})
export class RoleEditPopupComponent implements OnInit {


  roleNameValid = false;
  hideRequiredMarker = true;

  userName: any;
 //selectedRoleValue = this.data.oldRoleName;
  selectedUserName = "";

  selectedRoleValue="";
  userNamevalue = false;

  ceo = new FormControl();
  contact = new FormControl();


  signInNavResponse: SignInNavResponse = new SignInNavResponse();

  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  //encryptAndDecrypt:EncryptionAndDecryption = new EncryptionAndDecryption();

  encryptAndDecryptResponse: EncryptAndDecryptResponse = new EncryptAndDecryptResponse();

  encryptandDecryptkey!: string;

  constructor(public dialogRef: MatDialogRef<RoleEditPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public Service: ServicesService, private cdref: ChangeDetectorRef, private snackBar: MatSnackBar, private spinnerService: NgxSpinnerService, private router: Router) {
    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');

    

  }

  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }
  submit() {


    if (this.selectedRoleValue == null || this.selectedRoleValue == "") {

      this.roleNameValid = true;
    }

    else {


      if (this.ceo.valid) {
        // this.spinnerService.show();

        this.selectedRoleValue.trim();
        this.data.oldRoleName = this.selectedRoleValue;
        var roleNameNew=this.data.oldRoleName
        this.userName = this.signInNavResponse.responseContent.username;
        const output = roleNameNew.replace(/\b\w/g, (x: string) => x.toUpperCase());


        
        const userDatails = this.data.roleGroupId + "," + this.data.roleId + "," + output.trim() + "," + this.userName;
        const encryptData = this.encryptAndDecrypt.encryptfinal(userDatails, this.encryptandDecryptkey);

        this.Service.roleUpdate(encryptData).subscribe(roleUpdatedResponse => {


          const decryptData = this.encryptAndDecrypt.decryptfinal(roleUpdatedResponse.data, this.encryptandDecryptkey);

          this.encryptAndDecryptResponse = JSON.parse(decryptData);


          

          if (this.encryptAndDecryptResponse.statusCode == 200) {
            this.snackBar.open(this.encryptAndDecryptResponse.message, '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',


              });

            this.onNoClick()


          }
          else {

            this.snackBar.open(this.encryptAndDecryptResponse.message, '',
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

      }

    }

  }

  onNoClick(): void {

    this.dialogRef.close();
    //  this.reloadCurrentRoute();
  }

  stopEdit(): void {
    //this.dataService.updateView(this.data);

    // service calling
  }

  cancel(): void {

    this.dialogRef.close();


  }

  ngOnInit() {


    this.Service.checkPass().subscribe(encryptKeys => {
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

  roleNameEnter(roleName: string) {
    this.selectedRoleValue = roleName;
    this.roleNameValid = false;
  }



  userNameEnter(userName: string) {

    this.userNamevalue = false;
    this.selectedUserName = userName;

  }




  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
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


}
