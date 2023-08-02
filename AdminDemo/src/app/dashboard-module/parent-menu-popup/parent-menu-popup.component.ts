import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EncryptAndDecryptResponse } from 'src/app/encrypt-and-decrypt-response';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';


import { EncryptionDTO } from 'src/app/encryption-dto';
import { IconName } from 'src/app/icon-name';
import { Mastermenudetails } from 'src/app/mastermenudetails';
import { PopupResponse } from 'src/app/popup-response';
import { ResponseContentParentMenus } from 'src/app/response-content-parent-menus';
import { ServicesService } from 'src/app/services.service';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';


@Component({
  selector: 'app-parent-menu-popup',
  templateUrl: './parent-menu-popup.component.html',
  styleUrls: ['./parent-menu-popup.component.scss']
})
export class ParentMenuPopupComponent implements OnInit {


  parentmenuname!: boolean;
  iconname!: boolean;
  modifiedname!: boolean;

  selectedParentMenuName = this.data.parentMenuName;
  selectedIconName = "";
  selectedModifiedName = "";
  hideRequiredMarker = true;




  parentmenu = new FormControl();
  icon = new FormControl();
  modified = new FormControl();


  popResponse: PopupResponse = new PopupResponse();

  responseContent: IconName[] = [];

  iconName1: IconName[] = [];

  userMenu1: Mastermenudetails[] = [];

  userMenu2: Mastermenudetails[] = [];

  // encryptAndDecrypt :EncryptionAndDecryption = new EncryptionAndDecryption();
  encryptDTO: EncryptionDTO = new EncryptionDTO();
  encryptAndDecryptResposne: EncryptAndDecryptResponse = new EncryptAndDecryptResponse();


  parentmenurequest: ResponseContentParentMenus = new ResponseContentParentMenus();



  signInNavResponse: SignInNavResponse = new SignInNavResponse();
  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  iconName2: Record<any, any>[] = this.popResponse.responseContent;
  iconName3: Record<any, any>[] = this.popResponse.responseContent;

  encryptandDecryptkey!: string;
  constructor(public dialogRef: MatDialogRef<ParentMenuPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public Service: ServicesService, private snackBar: MatSnackBar, private cdref: ChangeDetectorRef, private spinnerService: NgxSpinnerService, private router: Router) {
    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');

   
  }

  letterOnly(event: any) {
    event.target.maxLength = 10;

    var charCode = event.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)

      return true;
    else
      return false;
  }
  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }
  submit() {
    if (this.selectedParentMenuName == null || this.selectedParentMenuName == "") {
      this.parentmenuname = true;

    
      if (this.selectedIconName == null || this.selectedIconName == "") {
        this.iconname = true;
        
      }

    }
    else if (this.selectedIconName == null || this.selectedIconName == "") {

     
      this.iconname = true;

      if (this.selectedParentMenuName == null || this.selectedParentMenuName == "") {
        this.parentmenuname = true;
        

      }

      if (this.selectedIconName == null || this.selectedIconName == "") {
        this.iconname = true;
        

      }
    }
    else {

     


      if (this.parentmenu.valid && this.icon.valid) {

        this.spinnerService.show();
        const output = this.data.parentMenuName.replace(/\b\w/g, (x: string) => x.toUpperCase());

        this.parentmenurequest.parentMenuName = output.trim();
        this.parentmenurequest.modifiedBy = this.signInNavResponse.responseContent.username;
        this.parentmenurequest.groupID = this.data.roleGroupId;
        this.parentmenurequest.parentMenuID = this.data.parentMenuId;



        const encryptData = this.encryptAndDecrypt.encryptfinal(this.parentmenurequest, this.encryptandDecryptkey);

        this.encryptDTO.data = encryptData;



        this.Service.parentMenuNameUpdate(this.encryptDTO).subscribe(parentmenuResponse => {


          const decryptData = this.encryptAndDecrypt.decryptfinal(parentmenuResponse.data, this.encryptandDecryptkey);
          this.encryptAndDecryptResposne = JSON.parse(decryptData);

          this.spinnerService.hide();
          if (this.encryptAndDecryptResposne.statusCode == "200") {

            this.snackBar.open(this.encryptAndDecryptResposne.message, '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',


              });
            this.onNoClick();
          }

          else {

            this.snackBar.open(this.encryptAndDecryptResposne.message, '',
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




  }

  onNoClick(): void {
    this.dialogRef.close();

    // this.reloadCurrentRoute();
  }

  stopEdit(): void {
    //this.dataService.updateView(this.data);

    // service calling
  }

  ngOnInit() {


    this.userMenu1 = this.signInNavResponse.responseContent.userMenuDtos;
    this.userMenu2 = this.signInNavResponse.responseContent.userMenuDtos;

    this.parentmenuname = false;
    this.iconname = false;
    this.modifiedname = false;

    this.Service.checkPass().subscribe(encryptKeys => {
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
  parentmenunameEnter(parentmenuName: string) {
    this.selectedParentMenuName = parentmenuName;

    this.parentmenuname = false;
  }

  iconnameEnter(iconName: string) {
    this.selectedIconName = iconName;
    this.iconname = false;
  }
  modifiedby(modifiedName: string) {
    this.selectedModifiedName = modifiedName;
    this.modifiedname = false;
  }



  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }



  handleInput(event: any) {
    if (event.target.selectionEnd === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }

  isAlfa(evt: any) {

    evt = (evt || window.event);
    var charCode = (evt.which || evt.keyCode);
    var del = 'Delete'

    var arrowLeft = 'ArrowLeft'
    var arrowRight = 'ArrowRight'
    var arrow: any

    if (evt.key == arrowRight || evt.key == arrowLeft || evt.key == del || evt.key == '.' || evt.key == '/' || evt.key == '\\' || evt.key == '-' || evt.key == '_') {
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


  isWhiteSpace(char: any) {
    return (/\s/).test(char);
  }


  getValue() {

    this.Service.IconFetch().subscribe(data => {

      const decryptData = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptandDecryptkey);

      

      this.popResponse = JSON.parse(decryptData);
      this.responseContent = this.popResponse.responseContent;
      this.iconName1 = this.popResponse.responseContent;

    })
  }

}
