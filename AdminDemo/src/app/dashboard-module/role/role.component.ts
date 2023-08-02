
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { ParentMenus } from 'src/app/parent-menus';
import { ResponseContentParentMenus } from 'src/app/response-content-parent-menus';
import { Role } from 'src/app/role';
import { ServicesService } from 'src/app/services.service';

import { RoleDeletePopupComponent } from '../role-delete-popup/role-delete-popup.component';
import { RoleEditPopupComponent } from '../role-edit-popup/role-edit-popup.component';
import { RoleGroupClass } from 'src/app/role-group-class';

import { SignInNavResponse } from 'src/app/sign-in-nav-response';
import { EncryptAndDecryptResponse } from 'src/app/encrypt-and-decrypt-response';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';



@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit, AfterViewInit {


  gro = new FormControl();

  roleName = new FormControl();

  submitted = true;

  important = "";

  newbutton = true;
  parentmenudetaillist: ResponseContentParentMenus[] = [];
  roleForm!: FormGroup;

  groupRequired = false;
  groupNotRequuired = true;

  //encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  encryptAndDecryptResposne: EncryptAndDecryptResponse = new EncryptAndDecryptResponse();

  first!: boolean;
  secound!: boolean;

  mandatory = "";

  table!: boolean;
  pagination!: boolean;

  rolenamevalue!: boolean;
  addnewstatus = false;
  userrolevalue!: boolean;

  userRole: Role = new Role()
  isShow = false;
  @ViewChild('paginator', { static: false }) set paginatorPageSize(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = "";
      this.dataSource.paginator.selectConfig.disableOptionCentering = true;
    }
  }

  private sort!: MatSort;


  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.dataSource.sort = this.sort;
  }










  dataSource = new MatTableDataSource<ResponseContentParentMenus>(this.parentmenudetaillist);
  currentTerm: any


  // this.dataSource.filterPredicate = (data, filter: string)  => {
  //   const accumulator = (currentTerm, key) => {
  //     return this.nestedFilterCheck(currentTerm, data, key);
  //   };
  //   const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
  //   // Transform the filter by converting it to lowercase and removing whitespace.
  //   const transformedFilter = filter.trim().toLowerCase();
  //   return dataStr.indexOf(transformedFilter) !== -1;
  // };

  roleNameSearch = new FormControl();

  foodCtrl!: FormControl;
  disabled: boolean = true;
  displayedColumns: string[] = ['siNo', 'groupName', 'rolename', 'actions'];

  roleobject: Role = new Role();

  parentmenudetails: ParentMenus = new ParentMenus();

  roleaddingResponse: ParentMenus = new ParentMenus();

  parentGroupnames: ParentMenus = new ParentMenus();

  parentGroupnames2: ParentMenus[] = [];

  groupnamelist1: Record<any, any>[] = this.parentGroupnames2;
  groupnamelist2: Record<any, any>[] = this.parentGroupnames2;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;

  parentGroupnames1: ParentMenus = new ParentMenus();
  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  signInNavResponse: SignInNavResponse = new SignInNavResponse();

  parent: ResponseContentParentMenus[] = [];

  hideRequiredMarker = true;

  encryptandDecryptkey!: string;

  selectedGroupId: any;


  constructor(private cdref: ChangeDetectorRef, private Service: ServicesService, private dialog: MatDialog, private spinnerService: NgxSpinnerService, private snackBar: MatSnackBar, private router: Router) {




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

      if (this.encryptandDecryptkey != "" || this.encryptandDecryptkey != null) {
        this.getValue();
      }
    });




    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');

    this.dataSource.filterPredicate = (data, filter: string) => {
      const accumulator = (currentTerm: any, key: any) => {
        return key === 'roleGroup' ? currentTerm + data.roleGroup.roleGroupName : currentTerm + data.roleGroup.roleGroupName;
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();

      const filter1 = dataStr.indexOf(transformedFilter) !== -1;
      const filter2 = data.roleName.toLowerCase().includes(filter);
      if (filter1) {
        return filter1;
      } else {
        return filter2;
      }
      return false;
    };

    this.first = true;
    this.rolenamevalue = false;
    // this.dataSource.filterPredicate()
    this.userrolevalue = false;
    this.roleForm = new FormGroup({
      groupName: new FormControl('', [Validators.required]),
      roleName: new FormControl('', [Validators.required])
    });


    this.foodCtrl = new FormControl({ value: '', disabled: this.disabled })

    //this.fetchAllGroupRole()

  }

  // public applyFilter(event: any) {
  //   
  //   this.dataSource.filterPredicate = (item, property) => {
  //     
  //     switch (property) {
  //       case 'groupName': {
  //         return item.roleGroup.roleGroupName;
  //       }


  //       default: return item[property as keyof ResponseContentParentMenus];
  //     }
  //   };
  // }



  fetchAllGroupName() {

    this.Service.fetchAllGroupName().subscribe(GroupNames => {

      const decryptData = this.encryptAndDecrypt.decryptfinal(GroupNames.data, this.encryptandDecryptkey);

      this.parentGroupnames = JSON.parse(decryptData);
      this.groupnamelist1 = this.parentGroupnames.responseContent;
      this.groupnamelist2 = this.parentGroupnames.responseContent;


    })
  }


  fetchAllGroupName1() {

    this.Service.fetchAllGroupName().subscribe(GroupNames => {

      this.parentGroupnames = GroupNames;

      this.groupnamelist1 = this.parentGroupnames.responseContent;
      this.groupnamelist2 = this.parentGroupnames.responseContent;

      //this.parentGroupnames1=GroupNames

      //this.parent=GroupNames.responseContent;



    })
  }

  fetchAllGroupRole1() {



    this.Service.fetchAllGroupRoleName().subscribe(groupRoleNames => {


      const decryptData = this.encryptAndDecrypt.decryptfinal(groupRoleNames, this.encryptandDecryptkey);

      this.parentmenudetails = JSON.parse(decryptData);
      this.parentmenudetaillist = this.parentmenudetails.responseContent;
      this.dataSource.data = this.parentmenudetaillist;
    })
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.roleForm.controls[controlName].hasError(errorName);
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;

    // this.shgdataSource.paginator = this.paginatorPageSize;
    this.dataSource.sort = this.sort;



  }
  // addnew() {

  //   this.newbutton=false;
  //   this.isShow = true;
  //   this.submitted=false;
  //   this.addnewstatus=true;
  //   this.selectedGroupId="";
  //   this.rolenamevalue=false;
  //   this.userrolevalue=false;
  //   this.mandatory="asterix--before";

  //   this.gro.reset();



  //   // this.parentGroupnames.responseContent=[];
  //   // for(let i=0; i<this.parentGroupnames.responseContent.length;i++)
  //   // {

  //   //   this.parentGroupnames.responseContent[i].roleGroupId=null;
  //   // }
  //   this.fetchAllGroupName1();


  //   // for(let i=0; this.parentGroupnames1.responseContent.length;i++)
  //   // {
  //   //   this.parentGroupnames.responseContent.push(this.parentGroupnames1.responseContent[i]);

  //   // }






  // }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addnew() {

    this.newbutton = false;
    this.isShow = true;
    this.submitted = false;
    this.addnewstatus = true;
    this.selectedGroupId = "";
    this.rolenamevalue = false;
    this.userrolevalue = false;
    this.mandatory = "asterix--before";
    this.important = "asterix--before";

    this.groupRequired = true;
    this.groupNotRequuired = false;

    this.gro.reset();

    this.parentmenudetaillist = []
    this.dataSource.data = []

    this.pagination = false


    //this.fetchAllGroupName1();


  }
  onSubmit() {
    this.submitted = true;
    if (this.roleForm.validator) {
      return;
    }
  }



  selectedGroupName(groupId: number) {
    this.roleName.reset();

    this.pagination = false;
    this.dataSource.data = [];

    this.selectedGroupId = groupId;

    this.rolenamevalue = false;
    // this.userrolevalue =false

  }

  selectedrole() {

    this.userrolevalue = false
  }


  update() {

    
    if (this.selectedGroupId == null || this.selectedGroupId == "") {

      this.spinnerService.show();
     
      this.Service.fetchAllGroupRoleName().subscribe(groupRoleNames => {


        var encryptData = this.encryptAndDecrypt.decryptfinal(groupRoleNames.data, this.encryptandDecryptkey)

        this.spinnerService.hide();

        this.encryptAndDecryptResposne = JSON.parse(encryptData);

        

        this.parentmenudetails.responseContent = this.encryptAndDecryptResposne.responseContent;


        this.parentmenudetaillist = this.parentmenudetails.responseContent;
        this.dataSource.data = this.parentmenudetaillist;

        this.table = true;
        this.pagination = true;
      })


    } else {
      this.spinnerService.show();

     

      const encryptData = this.encryptAndDecrypt.encryptfinal(this.selectedGroupId, this.encryptandDecryptkey);

      var encodeValue = encodeURIComponent(encryptData);

      this.Service.roleBasedGroupId(encodeValue).subscribe(response => {


        const decryptData = this.encryptAndDecrypt.decryptfinal(response.data, this.encryptandDecryptkey);


        this.spinnerService.hide();

        this.encryptAndDecryptResposne = JSON.parse(decryptData);

        

        this.parentmenudetails.responseContent = this.encryptAndDecryptResposne.responseContents;


        this.table = true;
        this.pagination = true;

        this.parentmenudetaillist = this.parentmenudetails.responseContent;
        this.dataSource.data = this.parentmenudetaillist;


      })
    }
  }
  submit() {

    this.roleNameSearch.reset();
    this.dataSource.filter = ""

    if (this.addnewstatus == false) {


      if (this.selectedGroupId == null || this.selectedGroupId == "") {

        //this.rolenamevalue=true;

        this.fetchAllGroupRole(); // fetch all role name 



      }
      else {

        this.spinnerService.show();
        const encryptData = this.encryptAndDecrypt.encryptfinal(this.selectedGroupId, this.encryptandDecryptkey);

        var encodeValue = encodeURIComponent(encryptData);

        this.Service.roleBasedGroupId(encodeValue).subscribe(response => {

          var decryptData = this.encryptAndDecrypt.decryptfinal(response.data, this.encryptandDecryptkey);
          this.spinnerService.hide();


          this.encryptAndDecryptResposne = JSON.parse(decryptData);



          this.parentmenudetails.responseContent = this.encryptAndDecryptResposne.responseContents;




          if (this.parentmenudetails.responseContent.length == 0) {
            this.dataSource.data = [];
            this.table = false;
            this.pagination = false;

            this.snackBar.open('Roles not found', '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',


              });

          }

          else {

            this.dataSource.data = []

            // this.snackBar.open(this.encryptAndDecryptResposne.message, '',
            //   {
            //     horizontalPosition: 'center',
            //     verticalPosition: 'top',
            //     duration: 3000,
            //     panelClass: 'center',


            //   });
            this.table = true;
            this.pagination = true;

            this.parentmenudetaillist = this.parentmenudetails.responseContent;
            this.dataSource.data = this.parentmenudetaillist;
          }




        })
      }

    }


    else {
      // add touch

      this.newroleAdding()
    }


  }



  // popup
  index!: number;
  i!: number;



  Delete(i: number, roleGroupId: number, roleId: number, oldRoleName: string) {
    this.index = i;

    const dialogRef = this.dialog.open(RoleDeletePopupComponent, {
      width: '400px',
      autoFocus: false,

      data: { roleGroupId: roleGroupId, roleId: roleId, oldRoleName: oldRoleName }
    }).afterClosed().subscribe(res => {

      this.update();

    });


  }



  edit(i: number, roleGroupId: number, roleId: number, oldRoleName: string) {

    this.index = i;

    const dialogRef = this.dialog.open(RoleEditPopupComponent, {
      height: '387px',
      autoFocus: false,

      data: { roleGroupId: roleGroupId, roleId: roleId, oldRoleName: oldRoleName }
    }).afterClosed().subscribe(res => {

      this.update();

    });


  }




  fetchRoleBasedGroupID() {
    this.spinnerService.show();

    const encryptData = this.encryptAndDecrypt.encryptfinal(this.selectedGroupId, this.encryptandDecryptkey);

    var encodeValue = encodeURIComponent(encryptData);

    this.Service.roleBasedGroupId(encodeValue).subscribe(response => {


      var decryptData = this.encryptAndDecrypt.decryptfinal(response.data, this.encryptandDecryptkey);

      this.encryptAndDecryptResposne = JSON.parse(decryptData);

      this.spinnerService.hide();

      this.parentmenudetails = JSON.parse(decryptData);


      // if (this.parentmenudetails.responseContent.length == 0) {
      //   this.dataSource.data = [];
      //   this.table = false;
      //   this.pagination = false;

      //   this.snackBar.open('Roles not found', '',
      //     {
      //       horizontalPosition: 'center',
      //       verticalPosition: 'top',
      //       duration: 3000,
      //       panelClass: 'center',


      //     });

      // }

      // else {



      // this.snackBar.open(response.message, '',
      //   {
      //     horizontalPosition: 'center',
      //     verticalPosition: 'top',
      //     duration: 3000,
      //     panelClass: 'center',


      //   });
      this.table = true;
      this.pagination = true;

      this.parentmenudetaillist = this.parentmenudetails.responseContent;
      this.dataSource.data = this.parentmenudetaillist;
      // }




    })
  }


  fetchAllGroupRole() {

    this.spinnerService.show();
    this.Service.fetchAllGroupRoleName().subscribe(groupRoleNames => {

      var decryptData = this.encryptAndDecrypt.decryptfinal(groupRoleNames.data, this.encryptandDecryptkey);

      this.encryptAndDecryptResposne = JSON.parse(decryptData);
      this.spinnerService.hide();


      this.parentmenudetails = JSON.parse(decryptData);


      if (this.parentmenudetails.responseContent.length == 0) {
        this.table = false;
        this.pagination = false;

        this.snackBar.open('Roles not found', '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });

      }
      else {
        this.dataSource.data = []

        // this.snackBar.open(this.encryptAndDecryptResposne.message, '',
        //   {
        //     horizontalPosition: 'center',
        //     verticalPosition: 'top',
        //     duration: 3000,
        //     panelClass: 'center',


        //   });

        this.table = true;
        this.pagination = true;

        this.parentmenudetaillist = this.parentmenudetails.responseContent;
        this.dataSource.data = this.parentmenudetaillist;
      }



    })



  }




  newroleAdding() {




    if ((this.selectedGroupId == null || this.selectedGroupId == "") && (this.userRole.rolename == null || this.userRole.rolename == "")) {

      this.rolenamevalue = true;
      this.userrolevalue = true
    }
    else {
      if (this.selectedGroupId == null || this.selectedGroupId == "") {
        this.rolenamevalue = true;
        this.userrolevalue = false

      }
      else if (this.userRole.rolename == null || this.userRole.rolename == "") {
        this.rolenamevalue = false;
        this.userrolevalue = true
      }

      else {




        if (this.roleName.valid) {
          this.spinnerService.show();

          this.userRole.rolename.trim();
          const output = this.userRole.rolename.replace(/\b\w/g, x => x.toUpperCase())



          const userdatails = this.selectedGroupId + "," + output.trim() + "," + this.signInNavResponse.responseContent.username;
          const encrytData = this.encryptAndDecrypt.encryptfinal(userdatails, this.encryptandDecryptkey);

          this.Service.RoleAddForGroup(encrytData).subscribe(roleadded => {

            const decryptData = this.encryptAndDecrypt.decryptfinal(roleadded.data, this.encryptandDecryptkey);

            this.encryptAndDecryptResposne = JSON.parse(decryptData);
            this.spinnerService.hide();


            if (this.encryptAndDecryptResposne.statusCode == 409) {

              this.encryptAndDecryptResposne.message = "Role already exists";

              this.snackBar.open(this.encryptAndDecryptResposne.message, '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',


                });

              this.newbutton = false;

            }
            else {


              this.snackBar.open(this.encryptAndDecryptResposne.message, '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',


                });

              this.table = true;
              this.pagination = true;
              this.roleaddingResponse = JSON.parse(decryptData);;

              this.reloadCurrentRoute();

              // this.fetchRoleBasedGroupID();
              this.fetchAllGroupName();

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



  public changeSort(event: any) {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'groupName': {
          return item.roleGroup.roleGroupName;
        }


        default: return item[property as keyof ResponseContentParentMenus];
      }
    };
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


  ngAfterContentChecked() {

    this.cdref.detectChanges();
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




  handleInput(event: any) {
    if (event.target.selectionEnd === 0 && event.code === 'Space') {
      event.preventDefault();
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


  getValue() {
    this.fetchAllGroupName();
  }


}

