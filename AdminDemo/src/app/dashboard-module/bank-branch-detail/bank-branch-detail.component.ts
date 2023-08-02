import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Bankbranchdetails } from 'src/app/bankbranchdetails';
import { BankBranchDetailsTable } from 'src/app/bank-branch-details-table';
import { StatedetailsResult } from 'src/app/statedetails-result';
import { ServicesService } from 'src/app/services.service';

import { State } from 'src/app/state-details';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-bank-branch-detail',
  templateUrl: './bank-branch-detail.component.html',
  styleUrls: ['./bank-branch-detail.component.scss']
})
export class BankBranchDetailComponent implements OnInit {


  displayedColumns: string[] = ['state', 'district', 'username', 'password'];


  userName!: string
  hideRequiredMarker = "true"
  pagination = false;
  table = false;
  stackeHolderValue!: boolean
  userLevelValue!: boolean;

  userSelectState = "";

  userNameValue!: boolean

  username = new FormControl('', { validators: [ Validators.pattern("^[A-Z_a-z]{4}0[A-Z0-9a-z]{6}$")] });


  stakeholderName = new FormControl();
  userLevel = new FormControl();

  statelevelselect = new FormControl();

  usertype = false;
  userlevel = false;

  usernamevalue="";

  credential: StatedetailsResult = new StatedetailsResult();

  userNameList: StatedetailsResult[] = [];

  userLevelList: StatedetailsResult[] = [];

  userTypeList: StatedetailsResult[] = [];

  userlevellist1: Record<any, any>[] = this.userLevelList;
  userlevellist2: Record<any, any>[] = this.userLevelList;

  userTypelist1: Record<any, any>[] = this.userTypeList;
  userTypelist2: Record<any, any>[] = this.userTypeList;

  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;

  userNameDetails: State = new State();

  stateDetails: State = new State();

  userLevelDetails: State = new State();

  userTypeDetails: State = new State();

  stateList: StatedetailsResult[] = [];

  statelist1: Record<any, any>[] = this.stateList;
  statelist2: Record<any, any>[] = this.stateList;

  tabledetails: any;

  tableList: StatedetailsResult[] = [];

  selectedUserLevel = "";
  selectedUserType = "";
  bankBranchDetails: Bankbranchdetails = new Bankbranchdetails()
  selectedName: any;
  selectedStateName!: string;
  constructor(private service: ServicesService, private cdref: ChangeDetectorRef, private snackBar: MatSnackBar, private router: Router, private spinnerService: NgxSpinnerService) {
  }


  dataSource = new MatTableDataSource<StatedetailsResult>(this.tableList); // class with object

  private sort!: MatSort;

  @ViewChild('firstTableSort') set matSort(ms: MatSort) {
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
    this.getStateList();
    // this.getUserLevel();
    this.getUserType();
    this.stackeHolderValue = false
    this.userLevelValue = false
  }


  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }




  onBlur(): void {
    this.username.markAsUntouched();
    this.stakeholderName.markAsUntouched();
    this.userLevel.markAsUntouched();

  }




  getStateList() {
    this.service.getStateService().subscribe(stateNameList => {

      this.stateDetails = stateNameList;
      this.stateList = this.stateDetails.result;
      this.statelist1 = this.stateList;
      this.statelist2 = this.stateList;

    });

  }

  userNameEnter(username: string) {

    this.userlevellist1 = []
    this.userlevellist2 = []

    this.stackeHolderValue = false;
    this.userLevelValue = false;

    this.userNameValue = false;

    this.userNameList = [];
    this.usertype = false;
    this.userlevel = false;
    this.dataSource.data = [];
    this.table = false;
    this.toDisplay = false;

    this.selectedUserType = "";
    this.selectedUserLevel = "";
    this.selectedStateName = "";


    this.userSelectState = "";

    this.stakeholderName.reset();
    this.userLevel.reset();
    this.statelevelselect.reset();

  }


  userLevelTouch() {
    if (this.selectedUserType == "") {
      this.snackBar.open("Please select user type", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',
      });
    } else {
    }

  }


  searchDetail(Username: string) {

    this.userlevellist1 = [];
    this.userlevellist2 = [];

    this.selectedUserType = "";
    this.selectedUserLevel = "";
    this.selectedStateName = "";

    this.stakeholderName.reset();
    this.userLevel.reset();
    this.statelevelselect.reset();
    this.dataSource.data = [];
    this.table = false;
    this.toDisplay = false;

    this.stackeHolderValue = false;
    this.userLevelValue = false;



    if (Username == null || Username == "") {
      this.userNameValue = true

    }


    else {

      if (this.username.valid) {



        this.selectedName = Username;

       
        this.spinnerService.show();

        const usernameUpperCase = Username.toUpperCase();

        Username = usernameUpperCase.trim();
        

        this.service.serachUserName(Username).subscribe(nameList => {

          this.spinnerService.hide();
          this.userNameDetails = nameList;

          this.userNameList = this.userNameDetails.result;
          if (this.userNameList.length <= 0) {

            const message = "User type & user level not found"
            this.snackBar.open(message, '', {

              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              // panelClass: ['blue-snackbar']
              panelClass: 'center',

            });
            this.userlevel = false;
            this.usertype = false;
          }
          else {
            // this.snackBar.open("User type & level fetched successfully", '', {

            //   horizontalPosition: 'center',
            //   verticalPosition: 'top',
            //   duration: 3000,
            //   // panelClass: ['blue-snackbar']
            //   panelClass: 'center',


            // });

            this.userlevel = true;
            this.usertype = true;

          }


        })
      }
      else {

      }

    }

  }

  // getUserLevel() {

  //   this.service.getUserLevel().subscribe(list => {
  //     this.userLevelDetails = list;
  //     this.userLevelList = this.userLevelDetails.result;

  //     this.userlevellist1 = this.userLevelList;
  //     this.userlevellist2 = this.userLevelList;
  //   });
  // }

  getUserType() {
    this.service.getUserType().subscribe(list => {
      this.userTypeDetails = list;
      this.userTypeList = this.userTypeDetails.result;

      this.userTypelist1 = this.userTypeList;
      this.userTypelist2 = this.userTypeList;
    });
  }


  selectUserLevel(nameOfUserLevel: string) {
    this.selectedUserLevel = nameOfUserLevel
    this.userLevelValue = false;

    this.dataSource.data = [];
    this.toDisplay = false;
    this.table = false;

    this.credential.Username="";
    
   this.usernamevalue="";

    this.username.reset();
    this.userNameValue = false;


    this.username.setErrors(null);
    this.userlevel = false;
    this.usertype = false;


  }

  selectUserType(nameOfUserType: string) {


    this.selectedUserType = nameOfUserType;
    this.userNameValue = false;
    this.stackeHolderValue = false;

    this.dataSource.data = [];
    this.toDisplay = false;
    this.table = false;

    this.usernamevalue="";
    this.credential.Username="";
    

    this.userlevel = false;
    this.usertype = false;



    this.username.reset();






    this.service.getUserLevel(this.selectedUserType).subscribe(list => {
      this.userLevelDetails = list;
      this.userLevelList = this.userLevelDetails.result;

      this.userlevellist1 = this.userLevelList;
      this.userlevellist2 = this.userLevelList;
    });

  }

  toDisplay = false;


  stateName(statename: string) {
    this.selectedStateName = statename;

    this.dataSource.data = [];
    this.toDisplay = false;
    this.table = false;

    this.userNameValue = false;
    this.username.reset();

    this.userlevel = false;
    this.usertype = false;



    this.username.setErrors(null);

  }

  submit() {

    this.filter.reset();
    this.dataSource.filter = " "
    this.userNameValue = false;


    // this.userNameValue = false;
    this.userlevel = false;
    this.usertype = false;
    this.username.reset();
    if ((this.selectedUserType == "" || this.selectedUserType == null) && (this.selectedUserLevel == "" || this.selectedUserLevel == null)) {

      // dont call 
      this.stackeHolderValue = true;
      this.userLevelValue = true


    }
    else if (this.selectedUserType == "" || this.selectedUserType == null) {
      this.stackeHolderValue = true;
      this.userLevelValue = false

    }
    else if (this.selectedUserLevel == "" || this.selectedUserLevel == null) {
      this.stackeHolderValue = false;
      this.userLevelValue = true
    }


    else {

      if (this.selectedUserType != "" || this.selectedUserType != null) {


        if (this.selectedUserLevel == "" || this.selectedUserLevel == null) {


          this.dataSource.data = [];
          this.credential.district_name = ""
        }

        else {

          //call
          if (this.selectUserType != null && this.selectUserLevel != null && this.selectedStateName == null) {
            //call



            this.spinnerService.show();

            // this.username.reset()

            this.service.getBankBranchTableReport(this.selectedUserType, this.selectedUserLevel).subscribe(tableReport => {

              this.tabledetails = tableReport;
              this.spinnerService.hide();

              this.toDisplay = true;


              this.tableList = this.tabledetails.result;
              if (this.tableList.length <= 0) {
                const message = "Record not found"
                this.pagination = false;
                this.toDisplay = false;
                this.table = false;
                this.userNameValue = false;
                this.snackBar.open(message, '', {

                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',
                });

              } else {
                this.dataSource.data = [];

                this.pagination = true;
                this.table = true;
                this.userNameValue = false
                this.toDisplay = true;
                // const message = "Data fetched successfully"

                // this.snackBar.open(message, '', {

                //   horizontalPosition: 'center',
                //   verticalPosition: 'top',
                //   duration: 3000,
                //   panelClass: 'center',


                // });
                this.dataSource.data = this.tableList;

              }
            });

          }
          else if (this.selectUserLevel != null && this.selectedUserType != null && this.selectedStateName != null) {
            this.spinnerService.show();

            this.service.getBankBranchTableState(this.selectedUserType, this.selectedUserLevel, this.selectedStateName).subscribe(tableReport => {

              this.tabledetails = tableReport;
              this.spinnerService.hide();

              this.toDisplay = true;



              this.tableList = this.tabledetails.result;
              if (this.tableList.length <= 0) {
                const message = "Record not found"
                this.pagination = false;
                this.table = false;
                this.userNameValue = false;
                this.toDisplay = false;
                this.snackBar.open(message, '', {

                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',


                });


              } else {

                this.dataSource.data = [];

                this.pagination = true;
                this.table = true;
                this.userNameValue = false;
                this.toDisplay = true;

                //const message = "Data fetched successfully"

                // this.snackBar.open(message, '', {

                //   horizontalPosition: 'center',
                //   verticalPosition: 'top',
                //   duration: 3000,
                //   panelClass: 'center',


                // });
                this.dataSource.data = this.tableList;

              }
            });

          }
        }
      }
    }
  }
  //username = new FormControl();

  // username = new FormControl('', { validators: [Validators.required, Validators.pattern('[a-zA-Z]{4}[0-9]{7}$')] });


  //username = new FormControl('', { validators: [Validators.required, Validators.pattern('[a-zA-Z]{4}[0-9]{7}$')] });





  letterOnly(event: any) {
    event.target.maxLength = 30;

    var charCode = event.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)

      return true;
    else
      return false;
  }

  getIFSCError() {
    if (this.username.hasError('required')) {
      return 'Username is required';
    }
    return this.username.hasError('pattern') ? 'Enter valid username' : '';


    //return 'User name is required';
  }

  // refChange() {
  //   this.username.setValidators([Validators.required, Validators.pattern('[a-zA-Z]{4}[0-9]{7}$')]);

  // }


  filter = new FormControl();

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  handleInput(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
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

}

