import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Group } from 'src/app/Group';
import { ParentMenus } from 'src/app/parent-menus';

import { ResponseContentParentMenus } from 'src/app/response-content-parent-menus';
import { ServicesService } from 'src/app/services.service';

import { ParentMenuDeletePopupComponent } from '../parent-menu-delete-popup/parent-menu-delete-popup.component';
import { ParentMenuPopupComponent } from '../parent-menu-popup/parent-menu-popup.component';

import { EncryptAndDecryptResponse } from 'src/app/encrypt-and-decrypt-response';
import { EncryptionDTO } from 'src/app/encryption-dto';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';


@Component({
  selector: 'app-parent-menus',
  templateUrl: './parent-menus.component.html',
  styleUrls: ['./parent-menus.component.scss']
})
export class ParentMenusComponent implements OnInit {

  responseContentlist: ResponseContentParentMenus[] = [];
  hideRequiredMarker = "true"
  dataSource = new MatTableDataSource<ResponseContentParentMenus>(this.responseContentlist);
  displayedColumns: string[] = ['slNo', 'groupName', 'parentMenuName', 'actions'];
  //parentMenus!:ParentMenusTable;
  parentMenusForm!: FormGroup;

  selectedGroupID!: any;

  groupRequired = false;
  groupNotRequired = true;

  signInNavResponse: SignInNavResponse = new SignInNavResponse();

  groupnamevalue!: boolean;
  parentmenunamevalue!: boolean;

  table!: boolean;
  pagination!: boolean;

  newbutton = true;
  mandatory = "";

  parentMenuname = new FormControl();

  addnewstatus = false;
  group = new FormControl();


  parentMenu: ParentMenus = new ParentMenus();
  parentMenudub: ParentMenus = new ParentMenus();




  parentMenuGroupname: ParentMenus = new ParentMenus();

  parentMenuGroupname1: ParentMenus[] = [];

  //encryptAndDecrypt : EncryptionAndDecryption = new EncryptionAndDecryption();

  encryptDTO: EncryptionDTO = new EncryptionDTO();

  encryptAnddecryptResposne: EncryptAndDecryptResponse = new EncryptAndDecryptResponse();

  groupnamelist1: Record<any, any>[] = this.parentMenuGroupname1;
  groupnamelist2: Record<any, any>[] = this.parentMenuGroupname1;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;



  allgroupname: Group = new Group();

  ParentMenusadded: ParentMenus = new ParentMenus();
  parentNameSearch = new FormControl();


  responseContent: ResponseContentParentMenus = new ResponseContentParentMenus();

  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  isShow = false;
  encryptandDecryptkey!: string;
  constructor(private service: ServicesService, private dialog: MatDialog, private spinnerService: NgxSpinnerService, private cdref: ChangeDetectorRef, private snackBar: MatSnackBar, private router: Router) {


    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');


  }


  formctl!: FormControl;
  disabled = true;


  private sort!: MatSort;


  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.dataSource.sort = this.sort;
  }







  @ViewChild('paginator', { static: false }) set paginatorPageSize(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = "";
      this.dataSource.paginator.selectConfig.disableOptionCentering = true;
    }
  }
  ngOnInit() {

    this.dataSource.filterPredicate = (data, filter: string) => {
      const accumulator = (currentTerm: any, key: any) => {
        return key === 'roleGroup' ? currentTerm + data.roleGroup.roleGroupName : currentTerm + data.roleGroup.roleGroupName;
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();

      const filter1 = dataStr.indexOf(transformedFilter) !== -1;

      const filter2 = data.parentMenuName.toLowerCase().includes(filter);


      if (filter1) {
        return filter1;
      }
      else if (filter2) {
        return filter2;

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

      if (this.encryptandDecryptkey != "" || this.encryptandDecryptkey != null) {
        this.getValue();
      }
    });








    this.groupnamevalue = false;
    this.parentmenunamevalue = false;

    this.formctl = new FormControl({ value: '', disabled: this.disabled })
    //this.parentMenuName();

  }
  public checkError = (controlName: string, errorName: string) => {
    return this.parentMenusForm.controls[controlName].hasError(errorName);
  }

  addnew() {
    this.dataSource.data = []
    this.responseContentlist = []
    this.pagination = false
    this.newbutton = false;
    this.isShow = true;
    this.addnewstatus = true;
    this.selectedGroupID = "";
    this.group.reset();
    this.mandatory = "asterix--before";


    this.groupRequired = true;
    this.groupNotRequired = false;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  parentMenuName() {

    //this.dataSource.data=[];

    this.spinnerService.show();


    this.service.fetchAllParent().subscribe(parentmenunames => {

      const decryptData = this.encryptAndDecrypt.decryptfinal(parentmenunames.data, this.encryptandDecryptkey);

      this.encryptAnddecryptResposne = JSON.parse(decryptData);
      this.spinnerService.hide();
      this.table = true;
      this.pagination = true;

      this.dataSource.data = [];


      if (this.encryptAnddecryptResposne.statusCode == 200) {

        // this.snackBar.open(this.encryptAnddecryptResposne.message, '',
        // {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        //   duration: 3000,
        //   panelClass: 'center',


        // });
      }
      else {

        this.snackBar.open(this.encryptAnddecryptResposne.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });

      }




      this.parentMenu = JSON.parse(decryptData);;



      this.dataSource.data = this.parentMenu.responseContent;

    })


  }

  fetchParentMenuBaseGroupId() {
    this.spinnerService.show();

    const encrytData = this.encryptAndDecrypt.encryptfinal(this.selectedGroupID, this.encryptandDecryptkey);

    const encodeValue = encodeURIComponent(encrytData);

    this.service.fetchParentMenuname(encodeValue).subscribe(response => {


      const decryptData = this.encryptAndDecrypt.decryptfinal(response.data, this.encryptandDecryptkey)

      this.spinnerService.hide();

      // if (response.responseContent.length == 0) {

      //   this.snackBar.open("Parent menu not found", '',
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

      this.parentMenudub = JSON.parse(decryptData);
      this.dataSource.data = this.parentMenudub.responseContent;


    })

  }

  fetchAllGroupName() {

    this.service.fetchAllGroupName().subscribe(allGroupNams => {

      const decryptData = this.encryptAndDecrypt.decryptfinal(allGroupNams.data, this.encryptandDecryptkey);

      this.parentMenuGroupname = JSON.parse(decryptData);
      this.groupnamelist1 = this.parentMenuGroupname.responseContent;
      this.groupnamelist2 = this.parentMenuGroupname.responseContent;


    })
  }



  selectedGroupname(groupNameId: number) {
    this.parentMenuname.reset()


    this.pagination = false;
    this.dataSource.data = [];
    this.groupnamevalue = false;
    //this.parentmenunamevalue=false;

    this.selectedGroupID = groupNameId;


  }





  formSubmit() {
    this.parentNameSearch.reset();
    this.dataSource.filter = ""


    if (this.addnewstatus == false) {


      if (this.selectedGroupID == null || this.selectedGroupID == "") {


        this.parentMenuName(); // fetch all parent menus
      }
      else {

        this.spinnerService.show();

        const encrytData = this.encryptAndDecrypt.encryptfinal(this.selectedGroupID, this.encryptandDecryptkey);

        const encodeValue = encodeURIComponent(encrytData);

        this.service.fetchParentMenuname(encodeValue).subscribe(response => {

          const decryptData = this.encryptAndDecrypt.decryptfinal(response.data, this.encryptandDecryptkey);

          this.encryptAnddecryptResposne = JSON.parse(decryptData);


          this.spinnerService.hide();

          if (this.encryptAnddecryptResposne.responseContent.length == 0) {

            this.snackBar.open("Parent menu not found", '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',


              });

          }

          else {
            this.dataSource.data = []


            // this.snackBar.open(this.encryptAnddecryptResposne.message, '',
            //   {
            //     horizontalPosition: 'center',
            //     verticalPosition: 'top',
            //     duration: 3000,
            //     panelClass: 'center',


            //   });

            this.table = true;
            this.pagination = true;

            this.parentMenudub = JSON.parse(decryptData);
            this.dataSource.data = this.parentMenudub.responseContent;

          }


        })
      }
    }

    else {
      this.newparentmenu()
    }




  }



  parentMenuEnter() {
    this.parentmenunamevalue = false;
  }

  newparentmenu() {

    if ((this.selectedGroupID == null || this.selectedGroupID == "") && (this.parentMenu.parentMenuName == null || this.parentMenu.parentMenuName == "")) {



      this.groupnamevalue = true;
      this.parentmenunamevalue = true;

      // all true
    }


    else {

      if (this.selectedGroupID == null || this.selectedGroupID == "") {
        // true


        this.groupnamevalue = true;
        this.parentmenunamevalue = false;
      }
      else if (this.parentMenu.parentMenuName == null || this.parentMenu.parentMenuName == "") {

        this.groupnamevalue = false;
        this.parentmenunamevalue = true;
      }
      else {
        // all value are ok 
        this.groupnamevalue = false;
        this.parentmenunamevalue = false;

        if (this.parentMenuname.valid) {
          this.spinnerService.show();

          this.parentMenu.groupID = this.selectedGroupID;
          this.parentMenu.createdBy = this.signInNavResponse.responseContent.id + "/" + this.signInNavResponse.responseContent.username;
          const output = this.parentMenu.parentMenuName.replace(/\b\w/g, (x: string) => x.toUpperCase());
          this.parentMenu.parentMenuName = output.trim();
          const encryptData = this.encryptAndDecrypt.encryptfinal(this.parentMenu, this.encryptandDecryptkey);


          this.encryptDTO.data = encryptData;

          this.service.parentMenuAdding(this.encryptDTO).subscribe(parentmenusadded => {

            const decryptData = this.encryptAndDecrypt.decryptfinal(parentmenusadded.data, this.encryptandDecryptkey);


            this.encryptAnddecryptResposne = JSON.parse(decryptData);

            this.spinnerService.hide();



            if (this.encryptAnddecryptResposne.statusCode == 409) {

              this.encryptAnddecryptResposne.message = "Parent menu already exists";

              this.snackBar.open(this.encryptAnddecryptResposne.message, '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',


                });

              this.newbutton = false;
            }

            else {
              this.snackBar.open(this.encryptAnddecryptResposne.message, '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',


                });
              this.newbutton = false;

              this.table = true;
              this.pagination = true;



              this.ParentMenusadded = JSON.parse(decryptData);

              this.reloadCurrentRoute()
              this.fetchParentMenuBaseGroupId();


            }







          })

        }
        else {

        }


      }
    }

  }


  // popup
  index!: number;
  i!: number;



  deleteItem(i: number, roleGroupId: number, parentMenuId: number, parentMenuName: string) {
    this.index = i;

    const dialogRef = this.dialog.open(ParentMenuDeletePopupComponent, {
      width: '400px',
      autoFocus: false,

      data: { GroupId: roleGroupId, parentMenuId: parentMenuId, parentMenuName: parentMenuName }
    }).afterClosed().subscribe(res => {

      this.update();
    })


  }

  update() {



    if (this.selectedGroupID == null) {

      //this.dataSource.data=[];

      this.spinnerService.show();


      this.service.fetchAllParent().subscribe(parentmenunames => {

        const decryptData = this.encryptAndDecrypt.decryptfinal(parentmenunames.data, this.encryptandDecryptkey);

        this.encryptAnddecryptResposne = JSON.parse(decryptData);
        this.spinnerService.hide();
        this.table = true;
        this.pagination = true;

        // this.dataSource.data=[];



        this.parentMenu = JSON.parse(decryptData);;


        //this.dataSource.data=[];
        this.dataSource.data = this.parentMenu.responseContent;

      })
    }

    else {


      const encrytData = this.encryptAndDecrypt.encryptfinal(this.selectedGroupID, this.encryptandDecryptkey);

      const encodeValue = encodeURIComponent(encrytData);

      this.service.fetchParentMenuname(encodeValue).subscribe(response => {


        const decryptData = this.encryptAndDecrypt.decryptfinal(response.data, this.encryptandDecryptkey);

        this.table = true;
        this.pagination = true;



        this.parentMenudub = JSON.parse(decryptData);
        //this.dataSource.data=[];
        this.dataSource.data = this.parentMenudub.responseContent;
      })



    }
  }



  edit(i: number, roleGroupId: number, parentMenuId: number, parentMenuName: string, iconName: any) {

    this.index = i;

    const dialogRef = this.dialog.open(ParentMenuPopupComponent,
      {
        height: '482px',
        autoFocus: false,

        data: { roleGroupId: roleGroupId, parentMenuId: parentMenuId, parentMenuName: parentMenuName, iconName: iconName }
      }).afterClosed().subscribe(res => {

        this.update();
      })



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




  letterOnly(event: any) {
    event.target.maxLength = 30;

    var charCode = event.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)

      return true;
    else
      return false;
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


  getValue() {
    this.fetchAllGroupName()
  }

}
