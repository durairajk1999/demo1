import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Assignmenus } from 'src/app/assignmenus';
import { EncryptAndDecryptResponse } from 'src/app/encrypt-and-decrypt-response';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';


import { EncryptionDTO } from 'src/app/encryption-dto';
import { Group } from 'src/app/Group';
import { MasterMenuList } from 'src/app/master-menu-list';
import { ParentMenu } from 'src/app/parent-menu';
import { ParentMenus } from 'src/app/parent-menus';
import { ResponseContentGroup } from 'src/app/response-content-group';
import { ResponseContentParentMenus } from 'src/app/response-content-parent-menus';
import { ServicesService } from 'src/app/services.service';


@Component({
  selector: 'app-assign-menus',
  templateUrl: './assign-menus.component.html',
  styleUrls: ['./assign-menus.component.scss']
})
export class AssignMenusComponent implements OnInit {
  assignmenusform!: FormGroup;
  hideRequiredMarker = true;
  assignmenu: Assignmenus = new Assignmenus();

  groupname: Group = new Group();
  grouplist: ResponseContentGroup[] = [];
  groupnamelist1: Record<any, any>[] = this.groupname.responseContent;
  groupnamelist2: Record<any, any>[] = this.groupname.responseContent;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;

  opened = true;

  keyValue1!:string;

  groupNamevalue = false;
  roleNameValue = false;

  //encryptionAndDecryption: EncryptionAndDecryption = new EncryptionAndDecryption();

  responseData: EncryptAndDecryptResponse = new EncryptAndDecryptResponse();

  encryptDTO: EncryptionDTO = new EncryptionDTO();

  // validation 

  selecNameGroup = "";
  selectRoleName = "";

  finalkeyValue1!:string;

  mastermenudetails: MasterMenuList = new MasterMenuList();
  mastermenudetailValue: MasterMenuList[] = [];
  parentMenunames: ParentMenu = new ParentMenu();

  masterMenusSelected: number[] = [];
  parentmenuresponse: ParentMenus = new ParentMenus();

  masterMenuName: ParentMenus = new ParentMenus();

  encryptAndDecryptResposne: EncryptAndDecryptResponse = new EncryptAndDecryptResponse();

  roleresponse: ResponseContentParentMenus[] = [];

  rolenamelist1: Record<any, any>[] = this.roleresponse;
  rolenamelist2: Record<any, any>[] = this.roleresponse;

  masterMenuNameResponse: ResponseContentParentMenus[] = [];

  masterMenuNameResponseArraylist!: ResponseContentParentMenus[];

  parentMenusresponse: ParentMenus = new ParentMenus();
  encryptAndDecrypt:EncryptionAndDecryption = new EncryptionAndDecryption();

  response: ResponseContentGroup[] = [];

  selectedGroupId!: any;
  selectedRoleId!: any;
  encryptandDecryptkey="";

  constructor(private Service: ServicesService, private cdref: ChangeDetectorRef, private snackBar: MatSnackBar, private router: Router, private spinnerService: NgxSpinnerService) { }

  ngOnInit() {

    
    this.getkey();
}
  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }
  onBlur(): void {
    this.groupName.markAsUntouched();
    this.roleName.markAsUntouched();

  }


  fetchAllGroupName() {

   

    this.Service.fetchAllGroupName().subscribe(allgroupname => {

      const decryptData = this.encryptAndDecrypt.decryptfinal(allgroupname.data,this.encryptandDecryptkey);

      this.groupname = JSON.parse(decryptData);
      this.groupnamelist1 = this.groupname.responseContent;
      this.groupnamelist2 = this.groupname.responseContent;


    })

  }

  groupName = new FormControl();
  roleName = new FormControl();

  selectGroupName(groupNameId: any) {

    this.selecNameGroup = groupNameId;
    this.selectRoleName = "";
    this.panelOpenState = false

    this.groupNamevalue = false;




    this.roleName.reset()

    this.selectedGroupId = groupNameId;

    const encryptData = this.encryptAndDecrypt.encryptfinal(groupNameId,this.encryptandDecryptkey);

    const encodeValue = encodeURIComponent(encryptData);

    this.Service.selectRoleName(encodeValue).subscribe(roleNameResposnce => {


      const decrytData = this.encryptAndDecrypt.decryptfinal(roleNameResposnce.data,this.encryptandDecryptkey);

      this.parentmenuresponse = JSON.parse(decrytData);

      this.roleresponse = this.parentmenuresponse.responseContent;
      this.rolenamelist1 = this.roleresponse;
      this.rolenamelist2 = this.roleresponse;
      if (this.roleresponse.length <= 0) {
        this.snackBar.open('Role not found', '', {

          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'center',


        });
      }
    })

    this.fetchMenus();



  }





  fetchMasterMenuNames(groupid: number) {


    const encrytData = this.encryptAndDecrypt.encryptfinal(groupid,this.encryptandDecryptkey);

    const encodeValue = encodeURIComponent(encrytData);

    this.Service.getAllMasterMenuName(encodeValue).subscribe(masterMenuNames => {


      const decryptData = this.encryptAndDecrypt.decryptfinal(masterMenuNames.data,this.encryptandDecryptkey);


      this.masterMenuName = JSON.parse(decryptData);

      //this.responseData=JSON.parse(decryptData);

      //this.masterMenuName=this.responseData.responseContent;


      this.masterMenuNameResponse = this.masterMenuName.responseContent;

      for (let i = 0; i < this.masterMenuName.responseContent.length; i++) {

        if (this.masterMenuName.responseContent[i].parentMenu.parentMenuName == 'No Parent') {


          // this.masterMenuNameResponse = this.masterMenuName.responseContent[i].masterMenuName;

          // this.masterMenuNameResponseArraylist.push(this.masterMenuName.responseContent[i].masterMenuName;)



        }

      }


    })

  }


  roleid(roleId: number) {



    this.roleNameValue = false;
    this.selectedRoleId = roleId;


  }

  panelOpenState!: boolean;

  fetchMenus() {

    this.masterMenusSelected = [];

    const encryptData = this.encryptAndDecrypt.encryptfinal(this.selectedGroupId,this.encryptandDecryptkey);

    const encodeValue = encodeURIComponent(encryptData);


    this.Service.fetchParentMenuList(encodeValue).subscribe(parentmenulist => {


      const decryptData = this.encryptAndDecrypt.decryptfinal(parentmenulist.data,this.encryptandDecryptkey);




      this.responseData = JSON.parse(decryptData);

      this.mastermenudetailValue = this.responseData.responseContent;
      if (this.mastermenudetailValue.length <= 0) {
        this.snackBar.open('Menu not found', '', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'center',
        });
        this.opened = true
      } else {
        this.panelOpenState = false
        this.opened = false
      }
      for (let i = 0; i < this.mastermenudetailValue.length; i++) {
        if (this.mastermenudetailValue[i].groupMasterMenuDTOs == null) {
          this.masterMenusSelected.push(this.mastermenudetailValue[i].id);
        }

        else {

          for (let k = 0; k < this.mastermenudetailValue[i].groupMasterMenuDTOs.length; k++) {
            this.masterMenusSelected.push(this.mastermenudetailValue[i].groupMasterMenuDTOs[k].id);
          }
        }
      }
      this.assignmenu.masterMenuIds = this.masterMenusSelected;


    })
  }


  getMenuId(event: MatCheckboxChange, id: number) {

    const checked = event.checked; // stored checked value true or false
    if (checked) {
      this.masterMenusSelected.push(id)
        ; // push the Id in array if checked
    } else {
      const index = this.masterMenusSelected.findIndex(list => list == id);//Find the index of stored id
      this.masterMenusSelected.splice(index, 1); // Then remove
    }
    this.assignmenu.masterMenuIds = this.masterMenusSelected



  }
  //refresh
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  submit() {

    this.groupName.setErrors(Validators.required)
    this.groupName.updateValueAndValidity();
    this.roleName.setErrors(Validators.required)
    this.roleName.updateValueAndValidity();





    if (this.selectedGroupId == "" || this.selectedGroupId == null) {

      this.groupNamevalue = true;

      if (this.selectedRoleId == "" || this.selectedRoleId == null) {
        this.roleNameValue = true;

      }


    }


    else if (this.selectedRoleId == "" || this.selectedRoleId == null) {

      this.roleNameValue = true;
    }


    if ((this.assignmenu.roleId == "" || this.assignmenu.roleId == null)) {


      this.roleNameValue = true;
    }

    else {

      if (this.assignmenu.masterMenuIds == null || this.assignmenu.masterMenuIds == "") {

        this.snackBar.open('Please select master menu', '', {

          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'center',


        });
      } else {
        this.spinnerService.show()

        const encryptData = this.encryptAndDecrypt.encryptfinal(this.assignmenu,this.encryptandDecryptkey);

        this.encryptDTO.data = encryptData;

        this.Service.roleMenuUpdate(this.encryptDTO).subscribe(roleupdateResponse => {


          const decryptData = this.encryptAndDecrypt.decryptfinal(roleupdateResponse.data,this.encryptandDecryptkey);


          this.encryptAndDecryptResposne = JSON.parse(decryptData);

          this.spinnerService.hide();

          if (this.encryptAndDecryptResposne.statusCode == 200) {

            const message = "Menu assigned successfully"

            this.snackBar.open(message, '', {

              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',


            });

          }
          else {

            const message = "Menu assigned Failed"

            this.snackBar.open(message, '', {

              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',


            });

          }





        })
        this.reloadCurrentRoute();
      }
    }

  }


  roleTouch(name: any) {

    if (this.roleresponse.length == 0) {
      this.snackBar.open("Please select group", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',


      });
    }
    else {

    }




  }



  letterOnly(event: any) {
    event.target.maxLength = 30;

    var charCode = event.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)

      return true;
    else
      return false;
  }



  parentTouch() {



    if (this.selecNameGroup == "") {
      this.snackBar.open("Please select group", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',


      });
    }
    else {

    }
  }

  masterMenuTouch() {

    if (this.selecNameGroup == "") {
      this.snackBar.open("Please select group ", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',


      });
    }
 else if(this.mastermenudetailValue.length <= 0){
    this.snackBar.open("Menu not found", '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2500,
      panelClass: 'center',


    });
  }
  }


getkey()
{



  this.Service.checkPass().subscribe(encryptKeys => {
    const keys = encryptKeys.data;
    this.keyValue1 = keys.split("//");
    const firstDecrypt = this.encryptAndDecrypt.decryptfinal(this.keyValue1[1].trim(), this.keyValue1[0].trim());
    const jsonString = JSON.parse(firstDecrypt);
    const finalkeyValue = jsonString.split("|");
    this.finalkeyValue1 = finalkeyValue;

    this.encryptandDecryptkey  = this.finalkeyValue1[0].trim();

    if (this.encryptandDecryptkey != "" || this.encryptandDecryptkey != null) {
      this.getValue();
    }
  });


  



 
}

getValue()
{
  this.panelOpenState = false
this.fetchAllGroupName()
}

}
