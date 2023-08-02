import { AfterViewInit, ChangeDetectorRef, Component, ErrorHandler, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import { Group } from 'src/app/Group';
import { ResponseContentGroup } from 'src/app/response-content-group';
import { ServicesService } from 'src/app/services.service';

import { GroupDeletePopupComponent } from '../group-delete-popup/group-delete-popup.component';
import { GroupEditPopupComponent } from '../group-edit-popup/group-edit-popup.component';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';

import { EncryptAndDecryptResponse } from 'src/app/encrypt-and-decrypt-response';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';






@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  isShow = false;
  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  constructor(private service: ServicesService, private router: Router, private cdref: ChangeDetectorRef, private spinnerService: NgxSpinnerService, private activeRoute: ActivatedRoute,
    private dialog: MatDialog, private snackBar: MatSnackBar) { }


  groupNameSearch = new FormControl();

  foodCtrl !: FormControl;
  disabled: boolean = true;
  messageresponse = ""

  groupname = false;

  encryptandDecryptkey!: string;
  groupform!: FormGroup;
  hideRequiredMarker = true;

  newbutton = true;

  groupobject: ResponseContentGroup = new ResponseContentGroup();
  groupresponse: Group = new Group();

  signInNavResponse: SignInNavResponse = new SignInNavResponse();


  // encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  encryptAndDecryptResponse: EncryptAndDecryptResponse = new EncryptAndDecryptResponse();




  groupresponseList: Group = new Group();

  groupallnames!: ResponseContentGroup[];

  submitbutton = true;

  groupNameEnterValue!: string;

  selectedgroupname = "";

  table = false
  search = false

  ngOnInit() {

   
    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');

    this.foodCtrl = new FormControl({ value: '', disabled: this.disabled })

    this.service.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;
      const keyValue1 = keys.split("//");
      const firstDecrypt = this.encryptAndDecrypt.decryptfinal(keyValue1[1].trim(),keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      const finalkeyValue1 = finalkeyValue;

      this.encryptandDecryptkey = finalkeyValue1[0].trim();

      if (this.encryptandDecryptkey != "" || this.encryptandDecryptkey != null) {
        this.fetchAllGroupName();
      }
    });




    




  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  displayedColumns: string[] = ['id', 'groupname', 'action'];
  private sort!: MatSort;


  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.dataSource.sort = this.sort;
  }

  dataSource = new MatTableDataSource<ResponseContentGroup>(this.groupallnames);


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


  addnew() {

    // this.disabled=false;
    // this.foodCtrl = new FormControl({value:'', disabled: this.disabled})
    // this.submitbutton=false;

    this.dataSource.filter = "";
    this.groupNameSearch.reset();

    this.dataSource.data = [];
    this.dataSource.data = this.groupresponseList.responseContent;

    this.isShow = true;
    this.newbutton = false;
  }


  fetchAllGroupName() {

    this.spinnerService.show();

    this.dataSource.data = [];

    this.service.fetchAllGroupName().subscribe(allgroupname => {

     

      const decryptData = this.encryptAndDecrypt.decryptfinal(allgroupname.data, this.encryptandDecryptkey);
      // this.snackBar.open(allgroupname.message, '', {

      //   horizontalPosition: 'center',
      //   verticalPosition: 'top',
      //   duration: 3000,
      //   // panelClass: ['blue-snackbar']
      //   panelClass: 'center',


      // });

      this.table = true;
      this.search = true;
      this.groupresponseList = JSON.parse(decryptData);



      this.groupallnames = this.groupresponseList.responseContent;

      this.spinnerService.hide();
      this.dataSource.data = this.groupresponseList.responseContent;

    })




  }

  reloadCurrentPage() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }






  delete() {

  }
  //refresh
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }



  submit() {


    this.dataSource.filter = "";
    this.groupNameSearch.reset();
    this.dataSource.data = [];
    this.dataSource.data = this.groupresponseList.responseContent;




    this.groupName.setErrors(Validators.required)
    this.groupName.updateValueAndValidity();
    if (this.groupNameEnterValue == null || this.groupNameEnterValue == "") {

      this.groupname = true;

    }
    else {




      if (this.groupName.valid) {

        this.spinnerService.show();
        this.groupobject.roleGroupName = this.groupNameEnterValue;
        this.groupobject.roleGroupName.trim();

        const output = this.groupobject.roleGroupName.replace(/\b\w/g, x => x.toUpperCase())

       

        const encryptGroupData = output.trim() + "," + this.signInNavResponse.responseContent.username;


        const encryptData = this.encryptAndDecrypt.encryptfinal(encryptGroupData, this.encryptandDecryptkey);

        this.service.addGroupName(encryptData).subscribe(Message => {
          this.spinnerService.hide();


          const decryptData = this.encryptAndDecrypt.decryptfinal(Message.data, this.encryptandDecryptkey);

          this.encryptAndDecryptResponse = JSON.parse(decryptData);

          if (this.encryptAndDecryptResponse.message == "Group name already exist") {
            this.snackBar.open("Group already exists", '', {

              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',


            });

          }

          else {

            this.snackBar.open(this.encryptAndDecryptResponse.message, '', {

              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',


            });

            this.newbutton = true;
            this.isShow = false;


            this.groupNameEnterValue = "";

            // this.reloadCurrentRoute();
            //  this.reloadCurrentPage();
            this.fetchAllGroupName();

          }





        })

      }

      else {

      }






    }



  }



  // popup
  index!: number;
  i!: number;

  deleteItem(i: number, roleGroupId: number, groupName: string) {
    this.index = i;



    const dialogRef = this.dialog.open(GroupDeletePopupComponent, {
      width: '400px',
      autoFocus: false,
      data: { roleGroupId: roleGroupId, groupName: groupName }
    });

    dialogRef.afterClosed().subscribe(res => {



      this.service.fetchAllGroupName().subscribe(allgroupname => {


        const decryptData = this.encryptAndDecrypt.decryptfinal(allgroupname.data, this.encryptandDecryptkey);
        // this.snackBar.open(allgroupname.message, '', {

        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        //   duration: 3000,
        //   // panelClass: ['blue-snackbar']
        //   panelClass: 'center',


        // });

        this.table = true;
        this.search = true;
        this.groupresponseList = JSON.parse(decryptData);



        this.groupallnames = this.groupresponseList.responseContent;


        this.dataSource.data = this.groupresponseList.responseContent;

      })


    })

  }


  // openAddFileDialog(): void {

  //   const dialogRef = this.dialog.open(PopUpComponentComponent, {
  //     width: '400px',
  //     height: '280px',
  //     panelClass: "dialog-responsive",
  //     data: { comment: this.comment }

  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.comment = result.comment;
  //     this.updateComment()
  //   });
  // }
























  edit(i: number, roleGroupId: number, groupName: string) {

    this.index = i;

    const dialogRef = this.dialog.open(GroupEditPopupComponent, {
      height: '298px',
      autoFocus: false,

      data: { roleGroupId: roleGroupId, groupName: groupName }
    }).afterClosed().subscribe(res => {

      this.service.fetchAllGroupName().subscribe(allgroupname => {


        const decryptData = this.encryptAndDecrypt.decryptfinal(allgroupname.data, this.encryptandDecryptkey);
        // this.snackBar.open(allgroupname.message, '', {

        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        //   duration: 3000,
        //   // panelClass: ['blue-snackbar']
        //   panelClass: 'center',


        // });

        this.table = true;
        this.search = true;
        this.groupresponseList = JSON.parse(decryptData);



        this.groupallnames = this.groupresponseList.responseContent;


        this.dataSource.data = this.groupresponseList.responseContent;

      })
    })


  }

  groupName = new FormControl();

  onBlur(): void {
    this.groupName.markAsUntouched();

  }


  groupNameEnter(groupnamevalue: string) {

    this.groupname = false;

    this.selectedgroupname = groupnamevalue;
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





  groupnameEnter() {

    this.groupname = false;



  }





}