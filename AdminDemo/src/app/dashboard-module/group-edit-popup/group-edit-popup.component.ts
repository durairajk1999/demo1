import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EncryptAndDecryptResponse } from 'src/app/encrypt-and-decrypt-response';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';


import { EncryptionDTO } from 'src/app/encryption-dto';

import { ResponseContentGroup } from 'src/app/response-content-group';
import { ServicesService } from 'src/app/services.service';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';


@Component({
  selector: 'app-group-edit-popup',
  templateUrl: './group-edit-popup.component.html',
  styleUrls: ['./group-edit-popup.component.scss']
})
export class GroupEditPopupComponent implements OnInit {



  group: ResponseContentGroup = new ResponseContentGroup();

  groupName!: boolean;

  selectedGroupName = this.data.groupName;
  username = false;
  userNamevalue = ""
  selectedUserName = ""
  hideRequiredMarker = true;

  encryptandDecryptkey!:string;

  groupname = new FormControl();
  userName = new FormControl();

  //encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  encryptDTO: EncryptionDTO = new EncryptionDTO();
  encryptAndDecryptResponse: EncryptAndDecryptResponse = new EncryptAndDecryptResponse();


  signInNavResponse: SignInNavResponse = new SignInNavResponse();
  encryptAndDecrypt:EncryptionAndDecryption = new EncryptionAndDecryption();

  constructor(public dialogRef: MatDialogRef<GroupEditPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public Service: ServicesService,private cdref: ChangeDetectorRef, private snackBar: MatSnackBar, private spinnerService: NgxSpinnerService, private router: Router) {

    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');

  }


  submit() {
    if (this.selectedGroupName == "" || this.selectedGroupName == null) {

      this.groupName = true;
    }
    else {

      this.group.roleGroupId = this.data.roleGroupId;

      this.group.roleGroupName = this.data.groupName;

      this.group.roleGroupName.trim();

      this.group.userName = this.signInNavResponse.responseContent.username;

      if (this.groupname.valid) {

        this.spinnerService.show();

        const output = this.group.roleGroupName.replace(/\b\w/g, (x: string) => x.toUpperCase());

        

        const encryptValue = this.group.roleGroupId + "," + output + "," + this.group.userName;

        const encryptDTO = this.encryptAndDecrypt.encryptfinal(encryptValue,this.encryptandDecryptkey);

        const encodeValue = encodeURIComponent(encryptDTO);


        this.encryptDTO.data = encryptDTO;

        this.Service.GroupNameUpdate(this.encryptDTO).subscribe(groupNameUpdatedresponse => {
          this.spinnerService.hide();

          const decryptData = this.encryptAndDecrypt.decryptfinal(groupNameUpdatedresponse.data,this.encryptandDecryptkey);


         
          this.encryptAndDecryptResponse = JSON.parse(decryptData);

          

          if (this.encryptAndDecryptResponse.statusCode == 200) {

          
            this.snackBar.open(this.encryptAndDecryptResponse.message, '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',


              });

            this.onNoClick();
          }
          else {

            this.snackBar.open(this.encryptAndDecryptResponse.message, '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',


              });

              this.onNoClick();

          }

        })

      }

      else {

      }







    }


    // "statusCode": 200,
    // "message": "group updated successfully",
    // "responseContent": {
    //   "createdDate": "2022-11-14 05:03:01",
    //   "createdBy": null,
    //   "modifiedDate": "2022-11-30 10:07:43",
    //   "modifiedBy": "gokul123",
    //   "roleGroupId": 28,
    //   "roleGroupName": "javaTeam",
    //   "active": true



  }

  groupNameEnter(groupname: string) {

    this.groupName = false;
    this.selectedGroupName = groupname;


  }

  onNoClick(): void {
    this.dialogRef.close();

    //this.reloadCurrentRoute();
  }

  stopEdit(): void {
    //this.dataService.updateView(this.data);

    // service calling
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

   
    });
    

   

    this.groupName = false;

  }
  ngAfterContentChecked() {
    
    this.cdref.detectChanges();
 }

  userNameEnter(username: string) {
    this.username = false;
    this.selectedUserName = username;
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
