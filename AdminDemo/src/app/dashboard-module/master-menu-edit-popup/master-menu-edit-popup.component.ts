import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DecryptionDTO } from 'src/app/decryption-dto';
import { EncryptAndDecryptResponse } from 'src/app/encrypt-and-decrypt-response';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';


import { EncryptionDTO } from 'src/app/encryption-dto';
import { IconName } from 'src/app/icon-name';

import { ParentMenu } from 'src/app/parent-menu';
import { PopupResponse } from 'src/app/popup-response';
import { ResponseContentParentMenus } from 'src/app/response-content-parent-menus';
import { RoleGroupClass } from 'src/app/role-group-class';
import { ServicesService } from 'src/app/services.service';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';




@Component({
  selector: 'app-master-menu-edit-popup',
  templateUrl: './master-menu-edit-popup.component.html',
  styleUrls: ['./master-menu-edit-popup.component.scss']
})
export class MasterMenuEditPopupComponent implements OnInit {



  parentMenuRequest: ParentMenu = new ParentMenu();



  mastermenuname!: boolean;
  navigationurl!: boolean;
  iconName!: boolean;
  modifiedname!: boolean;
  changed1!: boolean;

  encryptandDecryptkey!:string;


  groupId!: any;
  parentMenuId: any;

  hideRequiredMarker = "true";

  modiname = new FormControl();
  iconnamevalue = new FormControl();
  naviurl = new FormControl();
  mastermenunameform = new FormControl();

  EncryptDTO : EncryptionDTO  = new EncryptionDTO();

  decryptDTO :DecryptionDTO = new DecryptionDTO();

  //encryptAndDecrypt : EncryptionAndDecryption= new EncryptionAndDecryption();
  
  encryptAndDecryptResposne : EncryptAndDecryptResponse = new EncryptAndDecryptResponse(); 

  userDetails:ResponseContentParentMenus = new ResponseContentParentMenus();

  userDetails1:ResponseContentParentMenus = new ResponseContentParentMenus();


  selectedmasterMenuName = this.data.masterMenuName;

  selectedNavigationURL = this.data.navigationUrl;

  selectedIconName = this.data.iconName;

  selectedModifiedName = this.data.modifiedBy;

  popUpResponse: PopupResponse = new PopupResponse();

  iconName1:IconName[]=[];

  iconName2:Record<any,any>[]=this.popUpResponse.responseContent;
  iconName3:Record<any,any>[]=this.popUpResponse.responseContent;


  roleMenuRequest: RoleGroupClass = new RoleGroupClass();
  signInNavResponse: SignInNavResponse = new SignInNavResponse();
  encryptAndDecrypt:EncryptionAndDecryption = new EncryptionAndDecryption();

  constructor(public dialogRef: MatDialogRef<MasterMenuEditPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public Service: ServicesService, private cdref: ChangeDetectorRef,private snackBar: MatSnackBar, private router: Router) {

      this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');
     }


  mastermenunameenter(mastername: string) {
    this.mastermenuname = false;

    this.selectedmasterMenuName = mastername;

  }

  letterOnly(event: any) {
    event.target.maxLength=10;

    var charCode = event.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)

      return true;
    else
      return false;
  }

  navigationurlEnter(navigation: string) {

    this.navigationurl = false;
    this.selectedNavigationURL = navigation;
  }

  iconnameEnter(iconname: string) {

    this.iconName = false;
    this.selectedIconName = iconname;
  }

  modifiednameEnter(modifiedname: string) {

    this.modifiedname = false;

    this.selectedModifiedName = modifiedname;
  }

  submit() {
    if (this.selectedmasterMenuName == null || this.selectedmasterMenuName == "") {

      this.mastermenuname = true;
      if (this.selectedNavigationURL == null || this.selectedNavigationURL == "") {
        this.navigationurl = true;
      }

      if (this.selectedIconName == null || this.selectedIconName == "") {
        this.iconName = true;
      }
    }

    else if (this.selectedNavigationURL == null || this.selectedNavigationURL == "") {
      this.navigationurl = true;

      if (this.selectedmasterMenuName == null || this.selectedmasterMenuName == "") {
        this.mastermenuname = true;
      }

      if (this.selectedIconName == null || this.selectedIconName == "") {
        this.iconName = true;
      }
    }
    else if (this.selectedIconName == null || this.selectedIconName == "") {
      this.iconName = true;

      if (this.selectedmasterMenuName == null || this.selectedmasterMenuName == "") {
        this.mastermenuname = true;
      }

      if (this.selectedNavigationURL == null || this.selectedNavigationURL == "") {
        this.navigationurl = true;
      }

    }
    else {
      if (this.parentMenuRequest.parentMenuId == null) {
        this.serviceCall();
      }

      else if (this.roleMenuRequest.roleGroupId == null) {
        this.serviceCall();
      }

      else {

        this.parentMenuId = this.parentMenuRequest.parentMenuId;
        this.groupId = this.roleMenuRequest.roleGroupId;
        this.data.modifiedBy=this.signInNavResponse.responseContent.username;


        this.userDetails.groupId =this.data.roleGroupId
        this.userDetails.parentMenuId =this.parentMenuId
        this.userDetails.oldMasterMenuId =this.data.masterMenuId

        const output = this.data.masterMenuName.replace(/\b\w/g, (x: string) => x.toUpperCase());

        this.userDetails.newMasterMenuName =output.trim();

        this.userDetails.navigateUrl =this.data.navigationUrl
        this.userDetails.iconName = this.data.iconName
        this.userDetails.iconClassName 
        this.userDetails.modifiedBy =this.data.modifiedBy
        this.userDetails.newGroupId =this.groupId;
        this.userDetails.newParentMenuId =this.parentMenuId;


        const encryptValue = this.data.roleGroupId+","+this.data.parentMenuId+","+this.data.masterMenuId+","+output+","+this.data.navigationUrl
        +","+this.data.iconName+","+this.groupId+","+this.parentMenuId+","+this.data.modifiedBy;
         

        
        const encryptData = this.encryptAndDecrypt.encryptfinal(encryptValue,this.encryptandDecryptkey);
       


        this.Service.masterMenuUpdate(encryptData).subscribe(MasterUpdatedResponse => {


          const decryptData = this.encryptAndDecrypt.decryptfinal(MasterUpdatedResponse.data,this.encryptandDecryptkey);

           this.encryptAndDecryptResposne = JSON.parse(decryptData);

          
          if ( this.encryptAndDecryptResposne.statusCode == "200") {
            this.snackBar.open( this.encryptAndDecryptResposne.message, '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',


              });

              this.onNoClick();
          }
          else {

            this.snackBar.open( this.encryptAndDecryptResposne.message, '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',
              });
          }
          this.onNoClick();
        })

        this.onNoClick();

      }

    }

  }


  serviceCall() {
    this.parentMenuId = "";
    this.groupId = "";

    if(this.iconnamevalue.valid && this.naviurl.valid && this.mastermenunameform.valid)
    {
      this.data.modifiedBy=this.signInNavResponse.responseContent.id+"/"+this.signInNavResponse.responseContent.username;

      this.userDetails1.groupId =this.data.roleGroupId
      this.userDetails1.parentMenuId =this.parentMenuId
      this.userDetails1.oldMasterMenuId =this.data.masterMenuId
      const output = this.data.masterMenuName.replace(/\b\w/g, (x: string) => x.toUpperCase());

      this.userDetails1.newMasterMenuName =output.trim();

      
      this.userDetails1.navigateUrl =this.data.navigationUrl
      this.userDetails1.iconName = this.data.iconName
      this.userDetails1.iconClassName;
      this.userDetails1.modifiedBy =this.data.modifiedBy;
      this.userDetails1.newGroupId =this.groupId;
      this.userDetails1.newParentMenuId =this.parentMenuId;

      const encryptValue = this.data.roleGroupId+","+this.data.parentMenuId+","+this.data.masterMenuId+","+output+","+this.data.navigationUrl
      +","+this.data.iconName+","+this.groupId+","+this.parentMenuId+","+this.data.modifiedBy;
     

      

      


      const encryptData = this.encryptAndDecrypt.encryptfinal(encryptValue,this.encryptandDecryptkey);

      


      this.Service.masterMenuUpdate(encryptData).subscribe(MasterUpdatedResponse => {

      
        const decryptData = this.encryptAndDecrypt.decryptfinal(MasterUpdatedResponse.data,this.encryptandDecryptkey);

        this.encryptAndDecryptResposne = JSON.parse(decryptData);
  
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
  
      });
  
  
      this.onNoClick();

    }

    
  else{

  }
   
    

   
  }


  onNoClick(): void {
    this.dialogRef.close();
     //this.reloadCurrentRoute();
  }

  stopEdit(): void {
    //this.dataService.updateView(this.data);

    // service calling
  }
  ngAfterContentChecked() {
    
    this.cdref.detectChanges();
 }
  ngOnInit() {

    

    this.mastermenuname = false;
    this.navigationurl = false;
    this.iconName = false;
    this.modifiedname = false;

    this.Service.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;
      const keyValue1 = keys.split("//");
      const firstDecrypt = this.encryptAndDecrypt.decryptfinal(keyValue1[1].trim(),keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      const finalkeyValue1 = finalkeyValue;

      this.encryptandDecryptkey = finalkeyValue1[0].trim();

      if(this.encryptandDecryptkey !=null || this.encryptandDecryptkey !="")
      {
        this.getValue(this.encryptandDecryptkey);
      }
      
    });

    


    

   

   



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
    var del='Delete'

    var arrowLeft = 'ArrowLeft'
    var arrowRight = 'ArrowRight'
    var arrow : any

    var dot = ".";
    var underscore = "_";
   
  
    if (evt.key==arrowRight||evt.key == arrowLeft || evt.key == underscore || evt.key == dot ||evt.key == del|| evt.key=='.' || evt.key=='/' ||evt.key=='\\' || evt.key=='-' ||evt.key=='_'){
      arrow = false;
  
    }else {
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


  getValue(keyvalue:string)
  {
  
    this.Service.masterIcon().subscribe(data =>{
      const decryptData = this.encryptAndDecrypt.decryptfinal(data.data,keyvalue);
      this.popUpResponse = JSON.parse(decryptData);
       this.iconName1 = this.popUpResponse.responseContent;
 
    } );

  }



}
