
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Group } from 'src/app/Group';
import { MasterMenuSetting } from 'src/app/master-menu-setting';

import { ParentMenus } from 'src/app/parent-menus';
import { ResponseContentGroup } from 'src/app/response-content-group';
import { ResponseContentParentMenus } from 'src/app/response-content-parent-menus';
import { ServicesService } from 'src/app/services.service';

import { MasterMenuEditPopupComponent } from '../master-menu-edit-popup/master-menu-edit-popup.component';
import { MastermenuDeletePopupComponent } from '../mastermenu-delete-popup/mastermenu-delete-popup.component';

import { EncryptionDTO } from 'src/app/encryption-dto';
import { EncryptAndDecryptResponse } from 'src/app/encrypt-and-decrypt-response';
import { IconName } from 'src/app/icon-name';
import { PopupResponse } from 'src/app/popup-response';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';


interface menus {

  SlNo: string;
  GroupName: string;
  ParentName: string;
  MenuName: string;
  NavigationURL: string;
  IconName: string;
  OrderID: string;
  activeorinactive: string;

}

const ELEMENT_DATA: menus[] = [
  {
    SlNo: '1', GroupName: 'Office staff', ParentName: 'Fund transfer', MenuName: 'Balance', NavigationURL: 'Balance', IconName: '', OrderID: '1', activeorinactive: 'Active'
  },
  {
    SlNo: '2', GroupName: 'Field staff', ParentName: 'Recharge', MenuName: 'Balance', NavigationURL: 'Balance', IconName: '', OrderID: '2', activeorinactive: 'Active'
  },
];










@Component({
  selector: 'app-master-menus',
  templateUrl: './master-menus.component.html',
  styleUrls: ['./master-menus.component.scss']
})
export class MasterMenusComponent implements OnInit {
  hideRequiredMarker = "true"

  table!: boolean;
  pagination!: boolean;

  newbutton = true;
  mandatory1 = "";
  mandatory2 = "";


  groupRequired = false;

  groupNotRequired = true;

  parentmenuNotRequired = true;

  parentMenuRequired = false;

  signInNavResponse: SignInNavResponse = new SignInNavResponse();

  group = new FormControl();
  parentmenu = new FormControl();

  menuname = new FormControl();

  urlname = new FormControl();
  iconuname = new FormControl();
  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();


  groupnamevalue!: boolean;
  parentmenunamevalue!: boolean;
  menunamevalue!: boolean;
  navigationurlname!: boolean;
  iconnamevalue!: boolean;

  // validation 

  selectgroupName = "";
  selectParentMenmu = "";

  roletable = false;
  isShow = false;
  addnewstatus = false;

  encryptandDecryptkey!: string;

  constructor(private service: ServicesService, private dialog: MatDialog, private cdref: ChangeDetectorRef, private spinnerService: NgxSpinnerService, private snackBar: MatSnackBar, private router: Router) {


    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');


  }
  masterMenusForm!: FormGroup;
  masterMenus: MasterMenuSetting = new MasterMenuSetting();

  groupResponse: ResponseContentGroup[] = [];

  popUpResponse: PopupResponse = new PopupResponse();

  iconName1: IconName[] = [];

  iconName2: Record<any, any>[] = this.popUpResponse.responseContent;
  iconName3: Record<any, any>[] = this.popUpResponse.responseContent;

  groupnamelist1: Record<any, any>[] = this.groupResponse;
  groupnamelist2: Record<any, any>[] = this.groupResponse;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;

  groupObject: Group = new Group();

  selectedGroupId!: any;
  selectedParentMenuId!: any;

  mastermenuaddResponse: ParentMenus = new ParentMenus();

  mastermenudetails: ParentMenus = new ParentMenus();

  masterMenuResponse: ResponseContentParentMenus[] = [];

  //encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  encryptAndDecryptResposne: EncryptAndDecryptResponse = new EncryptAndDecryptResponse();

  encryptDTO: EncryptionDTO = new EncryptionDTO();

  response: ResponseContentParentMenus = new ResponseContentParentMenus();

  parentMenuList: ResponseContentParentMenus[] = [];

  parentmenulist1: Record<any, any>[] = this.parentMenuList;
  parentmenulist2: Record<any, any>[] = this.parentMenuList;

  parentMenudetails: ParentMenus = new ParentMenus();

  menuNameSearch = new FormControl()






  displayedColumns: string[] = ['SlNo', 'GroupName', 'ParentName', 'MenuName', 'NavigationURL', 'IconName', 'OrderID', 'activeorinactive', 'action'];




  private sort!: MatSort;


  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.dataSource.sort = this.sort;
  }





  dataSource = new MatTableDataSource<ResponseContentParentMenus>(this.masterMenuResponse);


  @ViewChild('paginator', { static: false }) set paginatorPageSize(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = "";
      this.dataSource.paginator.selectConfig.disableOptionCentering = true;
    }
  }
  @ViewChild('paginatorNew', { static: false }) set paginator(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = "";
      this.dataSource.paginator.selectConfig.disableOptionCentering = true;
    }
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.masterMenusForm.controls[controlName].hasError(errorName);
  }

  formctl!: FormControl;
  disabled = true;

  ngOnInit() {

    this.dataSource.filterPredicate = (data, filter: string) => {
      const accumulator = (currentTerm: any, key: any) => {
        return key === 'roleGroup' ? currentTerm + data.roleGroup.roleGroupName : currentTerm + data.roleGroup.roleGroupName;
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();

      const filter1 = dataStr.indexOf(transformedFilter) !== -1;
      const filter2 = data.masterMenuName.toLowerCase().includes(filter);
      const filter3 = data.parentMenu.parentMenuName.toLowerCase().includes(filter);
      const filter4 = data.navigationUrl.toLowerCase().includes(filter);
      const filter5 = data.iconName.toLowerCase().includes(filter);
      const filter6 = data.orderId.toString().includes(filter);
      const filter7 = data.active.toString().toLowerCase().includes(filter)


      if (filter1) {
        return filter1;
      }
      else if (filter2) {
        return filter2;
      }
      else if (filter3) {
        return filter3;
      } else if (filter4) {
        return filter4;

      } else if (filter5) {
        return filter5;
      }
      else if (filter6) {
        return filter6;

      } else if (filter7) {
        return filter7;

      }
      else {

        return false;
      }
    };

    this.service.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;
      const keyValue1 = keys.split("//");
      const firstDecrypt = this.encryptAndDecrypt.decryptfinal(keyValue1[1].trim(), keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      const finalkeyValue1 = finalkeyValue;

      this.encryptandDecryptkey = finalkeyValue1[0].trim();

      if (this.encryptandDecryptkey != null || this.encryptandDecryptkey != "") {
        this.getValue(this.encryptandDecryptkey);
      }

    });





    this.masterMenusForm = new FormGroup({
      groupName1: new FormControl('', [Validators.required]),
      parentMenu: new FormControl('', [Validators.required]),
      menuName: new FormControl('', [Validators.required]),
      navigationURL: new FormControl('', [Validators.required]),
      iconName: new FormControl('', [Validators.required]),
    });

    this.formctl = new FormControl({ value: '', disabled: this.disabled })
    this.groupnamevalue = false;
    this.parentmenunamevalue = false;
    this.menunamevalue = false;
    this.navigationurlname = false;
    this.iconnamevalue = false;

    //this.fetchMasterMenuList();

  }


  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }

  addnew() {

    this.dataSource.data = []
    this.masterMenuResponse = []
    this.pagination = false
    this.mandatory1 = "asterix--before";
    this.mandatory2 = "asterix--before";


    this.groupRequired = true;

    this.groupNotRequired = false;

    this.parentmenuNotRequired = false;

    this.parentMenuRequired = true;



    this.newbutton = false;
    this.isShow = true;
    this.addnewstatus = true;
    this.selectedGroupId = "";
    this.selectedParentMenuId = "";
    this.group.reset();
    this.parentmenu.reset();
    this.parentmenulist1 = [];
    this.parentmenulist2 = [];
    this.selectgroupName = "";

  }


  menunameEnter() {
    this.menunamevalue = false;
    this.urlname.reset();
    this.iconuname.reset();
  }


  navigationUrlEnter() {
    this.navigationurlname = false;
    this.iconuname.reset();
  }

  iconNameEnter() {

    this.iconnamevalue = false;
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  fetchMasterMenuList() {

    this.spinnerService.show();

    this.service.fetchMasterMenuList().subscribe(mastermenulist => {

      const decryptData = this.encryptAndDecrypt.decryptfinal(mastermenulist.data, this.encryptandDecryptkey);

      this.spinnerService.hide();



      this.mastermenudetails = JSON.parse(decryptData);

      if (this.mastermenudetails.responseContent == null) {

        this.dataSource.data = []

        this.snackBar.open("Record not found", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });

      }

      else {
        this.dataSource.data = []
        // this.snackBar.open( this.mastermenudetails.message,'' ,
        // {
        // horizontalPosition:'center',
        // verticalPosition:'top',
        // duration: 3000,
        // panelClass: 'center',


        // });

        this.table = true;
        this.pagination = true;

        this.masterMenuResponse = this.mastermenudetails.responseContent;
        this.masterMenuResponse.forEach(stat => {
          var response = stat.active
          if (response == true) {
            stat.active = "Active";
          }
          else {
            stat.active = "Inactive";
          }
        })
        this.dataSource.data = this.masterMenuResponse;

      }





    })






  }

  fetchMasterMenuBasedGroupId() {
    this.dataSource.data = [];
    // all value ok 


    this.spinnerService.show();



    const masterMenuRequest = this.selectedGroupId + " " + this.selectedParentMenuId;

    const encrytData = this.encryptAndDecrypt.encryptfinal(masterMenuRequest, this.encryptandDecryptkey);

    const encodeValue = encodeURIComponent(encrytData);

    this.service.fetchAllMasterMenus(encodeValue).subscribe(response => {

      const decrytData = this.encryptAndDecrypt.decryptfinal(response.data, this.encryptandDecryptkey);
      this.spinnerService.hide();
      this.mastermenudetails = JSON.parse(decrytData);



      // if (response.statusCode == 409) {

      //   response.message = "Master menu not exists"

      //   this.snackBar.open(response.message, '',
      //     {
      //       horizontalPosition: 'center',
      //       verticalPosition: 'top',
      //       duration: 3000,
      //       panelClass: 'center',


      //     });
      // }

      // else {

      this.table = true;
      this.pagination = true;

      // 
      // this.snackBar.open(response.message, '',
      //   {
      //     horizontalPosition: 'center',
      //     verticalPosition: 'top',
      //     duration: 3000,
      //     panelClass: 'center',


      //   });
      this.masterMenuResponse = this.mastermenudetails.responseContent;
      this.dataSource.data = this.masterMenuResponse;

      // }


    })




  }





  fetchAllGroupName() {



    this.service.fetchAllGroupName().subscribe(groupnames => {
      this.spinnerService.hide();

      const decryptData = this.encryptAndDecrypt.decryptfinal(groupnames.data, this.encryptandDecryptkey);

      this.groupObject = JSON.parse(decryptData);

      this.groupResponse = this.groupObject.responseContent;
      this.groupnamelist1 = this.groupResponse;
      this.groupnamelist2 = this.groupResponse;


    })
  }


  selectGroupName(groupid: any) {


    this.selectgroupName = groupid;
    this.selectParentMenmu = "";

    this.parentmenulist1 = [];
    this.parentmenulist2 = [];

    this.pagination = false;
    this.dataSource.data = [];


    this.groupnamevalue = false;

    this.parentmenu.reset();
    this.menuname.reset();
    this.urlname.reset();
    this.iconuname.reset();
    this.parentMenuList = [];
    this.parentmenulist1 = [];
    this.parentmenulist2 = [];


    this.selectedGroupId = groupid;
    this.selectedParentMenuId = "";

    const encrytData = this.encryptAndDecrypt.encryptfinal(groupid, this.encryptandDecryptkey);


    const encodeValue = encodeURIComponent(encrytData);

    this.service.fetchParentMenuname(encodeValue).subscribe(parentMenuName => {

      const decryptData = this.encryptAndDecrypt.decryptfinal(parentMenuName.data, this.encryptandDecryptkey);


      this.encryptAndDecryptResposne = JSON.parse(decryptData);

      this.spinnerService.hide();


      if (this.encryptAndDecryptResposne.responseContent.length == 0) {

        this.snackBar.open("Parent menu not found", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });
      }

      else {

        this.parentMenudetails = JSON.parse(decryptData);
        this.parentMenuList = this.parentMenudetails.responseContent;
        this.parentmenulist1 = this.parentMenuList;
        this.parentmenulist2 = this.parentMenuList;

      }




    })

  }

  parentmenuId(parentmenuid: any) {



    this.selectParentMenmu = parentmenuid;

    this.pagination = false;
    this.dataSource.data = [];

    this.groupnamevalue = false;
    this.parentmenunamevalue = false;

    this.selectedParentMenuId = parentmenuid;



    this.menuname.reset();
    this.urlname.reset();
    this.iconuname.reset();





  }


  submit() {
    this.menuNameSearch.reset();
    this.dataSource.filter = ""
    if (this.addnewstatus == false) {

      if ((this.selectedGroupId == null || this.selectedGroupId == "") && (this.selectedParentMenuId == "" || this.selectedParentMenuId == null)) {

        this.fetchMasterMenuList(); // fetch all group and mastermenu 
      }

      else {
        if (this.selectedGroupId == null || this.selectedGroupId == "") {

          this.groupnamevalue = true;
          this.parentmenunamevalue = false;


        }

        else if (this.selectedParentMenuId == null || this.selectedParentMenuId == "") {

          this.groupnamevalue = false;
          this.parentmenunamevalue = true;
        }
        else {

          this.dataSource.data = [];
          // all value ok 
          this.spinnerService.show();
          const masterMenuRequest = this.selectedGroupId + " " + this.selectedParentMenuId;

          const encryptData = this.encryptAndDecrypt.encryptfinal(masterMenuRequest, this.encryptandDecryptkey);

          const encodeValue = encodeURIComponent(encryptData);

          this.service.fetchAllMasterMenus(encodeValue).subscribe(response => {

            this.spinnerService.hide();

            const decryptData = this.encryptAndDecrypt.decryptfinal(response.data, this.encryptandDecryptkey);


            this.encryptAndDecryptResposne = JSON.parse(decryptData);


            this.mastermenudetails = JSON.parse(decryptData);



            if (this.encryptAndDecryptResposne.statusCode == 409) {

              this.encryptAndDecryptResposne.message = "Master menu not exists"

              this.snackBar.open(this.encryptAndDecryptResposne.message, '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',


                });
            }

            else {
              this.dataSource.data = []
              this.table = true;
              this.pagination = true;

              // this.snackBar.open(this.encryptAndDecryptResposne.message,'' ,
              // {
              // horizontalPosition:'center',
              // verticalPosition:'top',
              // duration: 3000,
              // panelClass: 'center',


              // });
              this.masterMenuResponse = this.mastermenudetails.responseContent;
              this.masterMenuResponse.forEach(stat => {
                var response = stat.active
                if (response == true) {
                  stat.active = "Active";
                }
                else {
                  stat.active = "Inactive";
                }
              })
              this.dataSource.data = this.masterMenuResponse;

            }


          })




        }
      }
    }

    else {


      this.newMasterMenuAdding()
    }


  }

  newMasterMenuAdding() {


    if ((this.selectedGroupId == null || this.selectedGroupId == "") && (this.selectedParentMenuId == null || this.selectedParentMenuId == "") && (this.response.masterMenuName == null || this.response.masterMenuName == "") && (this.response.navigateUrl == null || this.response.navigateUrl == "") && (this.response.iconName == null || this.response.iconName == "")) {
      // all value are true


      this.groupnamevalue = true;
      this.parentmenunamevalue = true;
      this.menunamevalue = true;
      this.navigationurlname = true;
      this.iconnamevalue = true;





    }

    else {
      if (this.selectedGroupId == null || this.selectedGroupId == "") {

        this.groupnamevalue = true;

        if (this.selectedParentMenuId == null || this.selectedParentMenuId == "") {

          this.parentmenunamevalue = true;


        }

        if (this.response.masterMenuName == null || this.response.masterMenuName == "") {

          this.menunamevalue = true;

        }

        if (this.response.navigateUrl == null || this.response.navigateUrl == "") {

          this.navigationurlname = true;

        }

        if (this.response.iconName == null || this.response.iconName == "") {

          this.iconnamevalue = true;
        }

      }

      else if (this.selectedParentMenuId == null || this.selectedParentMenuId == "") {
        this.parentmenunamevalue = true;



        if (this.selectedGroupId == null || this.selectedGroupId == "") {
          this.groupnamevalue = true;
        }

        if (this.response.masterMenuName == null || this.response.masterMenuName == "") {

          this.menunamevalue = true;

        }

        if (this.response.navigateUrl == null || this.response.navigateUrl == "") {

          this.navigationurlname = true;

        }

        if (this.response.iconName == null || this.response.iconName == "") {

          this.iconnamevalue = true;
        }


      }

      else if (this.response.masterMenuName == null || this.response.masterMenuName == "") {


        this.menunamevalue = true;

        if (this.selectedParentMenuId == null || this.selectedParentMenuId == "") {
          this.parentmenunamevalue = true;
        }

        if (this.selectedGroupId == null || this.selectedGroupId == "") {

          this.groupnamevalue = true;
        }

        if (this.response.navigateUrl == null || this.response.navigateUrl == "") {

          this.navigationurlname = true;

        }

        if (this.response.iconName == null || this.response.iconName == "") {

          this.iconnamevalue = true;
        }

      }

      else if (this.response.navigateUrl == null || this.response.navigateUrl == "") {


        this.navigationurlname = true;


        if (this.selectedParentMenuId == null || this.selectedParentMenuId == "") {
          this.parentmenunamevalue = true;
        }

        if (this.selectedGroupId == null || this.selectedGroupId == "") {

          this.groupnamevalue = true;
        }


        if (this.response.iconName == null || this.response.iconName == "") {

          this.iconnamevalue = true;
        }

        if (this.response.masterMenuName == null || this.response.masterMenuName == "") {


          this.menunamevalue = true;
        }




      }
      else if (this.response.iconName == null || this.response.iconName == "") {


        this.iconnamevalue = true;




        if (this.response.navigateUrl == null || this.response.navigateUrl == "") {

          this.navigationurlname = true;

        }

        if (this.selectedGroupId == null || this.selectedGroupId == "") {

          this.groupnamevalue = true;
        }

        if (this.selectedParentMenuId == null || this.selectedParentMenuId == "") {

          this.parentmenunamevalue = true;


        }

        if (this.response.masterMenuName == null || this.response.masterMenuName == "") {

          this.menunamevalue = true;


        }

      }
      else {
        // all field are okay 

        if (this.menuname.valid && this.urlname.valid && this.iconuname.valid) {

          this.spinnerService.show();

          this.response.groupID = this.selectedGroupId;
          this.response.parentMenuID = this.selectedParentMenuId;

          this.response.createdBy=this.signInNavResponse.responseContent.id + "/" + this.signInNavResponse.responseContent.username;
          const output = this.response.masterMenuName.replace(/\b\w/g, (x: string) => x.toUpperCase());

          this.response.masterMenuName = output.trim();



          const encryptData = this.encryptAndDecrypt.encryptfinal(this.response, this.encryptandDecryptkey);
          this.encryptDTO.data = encryptData;

          this.service.masterManuAdd(this.encryptDTO).subscribe(masterMenuAddResponse => {

            const decryptData = this.encryptAndDecrypt.decryptfinal(masterMenuAddResponse.data, this.encryptandDecryptkey);


            this.spinnerService.hide();


            this.mastermenuaddResponse = JSON.parse(decryptData);

            if (this.mastermenuaddResponse.statusCode == 409) {


              this.mastermenuaddResponse.message = "Master menu already exists"
              this.snackBar.open(this.mastermenuaddResponse.message, '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',


                });

              this.newbutton = false;
            }

            else {

              this.table = true;
              this.pagination = true;
              this.snackBar.open(this.mastermenuaddResponse.message, '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',


                });
              this.newbutton = false;

              this.reloadCurrentRoute();
              this.fetchMasterMenuBasedGroupId();


            }



          })

        }

        else {

        }


      }
    }

  }


  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  // popup
  index!: number;
  i!: number;


  deleteItem(i: number, roleGroupId: number, parentMenuId: number, masterMenuId: number, masterMenuName: string, navigationUrl: string, iconName: string, orderId: number, modifiedBy: string) {
    this.index = i;

    const dialogRef = this.dialog.open(MastermenuDeletePopupComponent
      , {
        width: '400px',
        autoFocus: false,

        data: { roleGroupId: roleGroupId, parentMenuId: parentMenuId, masterMenuId: masterMenuId, masterMenuName: masterMenuName, navigationUrl: navigationUrl, iconName: iconName, orderId: orderId, modifiedBy: modifiedBy }

      }).afterClosed().subscribe(res => {

        this.update();
      })


  }


  update() {
    if (this.selectedGroupId == null && this.selectedParentMenuId == null) {
      this.spinnerService.show();

      this.service.fetchMasterMenuList().subscribe(mastermenulist => {

        this.spinnerService.hide();


        const decryptData = this.encryptAndDecrypt.decryptfinal(mastermenulist.data, this.encryptandDecryptkey);

        this.mastermenudetails = JSON.parse(decryptData);
        this.table = true;
        this.pagination = true;

        this.masterMenuResponse = this.mastermenudetails.responseContent;
        this.dataSource.data = this.masterMenuResponse;

      })
    } else {

      this.spinnerService.show();

      const masterMenuRequest = this.selectedGroupId + " " + this.selectedParentMenuId;

      const encryptData = this.encryptAndDecrypt.encryptfinal(masterMenuRequest, this.encryptandDecryptkey);

      const encodeValue = encodeURIComponent(encryptData);

      this.service.fetchAllMasterMenus(encodeValue).subscribe(response => {

        this.spinnerService.hide();



        const decryptData = this.encryptAndDecrypt.decryptfinal(response.data, this.encryptandDecryptkey)



        this.mastermenudetails = JSON.parse(decryptData);




        this.table = true;
        this.pagination = true;


        this.masterMenuResponse = this.mastermenudetails.responseContent;
        this.dataSource.data = this.masterMenuResponse;

      })


    }
  }



  edit(i: number, roleGroupId: number, parentMenuId: number, masterMenuId: number, masterMenuName: string, navigationUrl: string, iconName: string, orderId: number, modifiedBy: string) {

    this.index = i;

    const dialogRef = this.dialog.open(MasterMenuEditPopupComponent,
      {
        height: "500px",
        width: "350px",
        autoFocus: false,
        data: { roleGroupId: roleGroupId, parentMenuId: parentMenuId, masterMenuId: masterMenuId, masterMenuName: masterMenuName, navigationUrl: navigationUrl, iconName: iconName, orderId: orderId, modifiedBy: modifiedBy }
      }).afterClosed().subscribe(res => {

        this.update();
      })


  }


  public changeSort(event: any) {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'SlNo': {
          return item.roleGroup.roleGroupId;
        }
        case 'GroupName': {
          return item.roleGroup.roleGroupName;
        }
        case 'ParentName': {
          return item.parentMenu.parentMenuName;
        }
        default: return item[property as keyof ResponseContentParentMenus];
      }
    };
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
    if (this.selectgroupName == "") {
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






  handleInput(event: any) {
    if (event.target.selectionEnd === 0 && event.code === 'Space') {
      event.preventDefault();
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
    var numberBoolean: any;
    if (evt.key == "0" || evt.key == "1" || evt.key == "2" || evt.key == "3" || evt.key == "4" || evt.key == "5" || evt.key == "6" || evt.key == "7" || evt.key == "8" || evt.key == "9") {
      numberBoolean = false;
    }
    else {
      numberBoolean = true;
    }

    return ((
      (charCode > 32)
      && (charCode < 65 || charCode > 90)
      && (charCode < 97 || charCode > 122) && (arrow)

    ) && (numberBoolean) || this.willCreateWhitespaceSequence(evt)) ? false : true;
  }




  getValue(keyValue: string) {

    this.service.masterIcon().subscribe(data => {
      const decryptData = this.encryptAndDecrypt.decryptfinal(data.data, keyValue);
      this.popUpResponse = JSON.parse(decryptData);
      this.iconName1 = this.popUpResponse.responseContent;
      this.fetchAllGroupName();

    })
  }




}

