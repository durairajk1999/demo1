

import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { formatNumber } from '@angular/common';

import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Shgmemberdelete } from 'src/app/shgmemberdelete';
import { State } from 'src/app/state-details';
import { StatedetailsResult } from 'src/app/statedetails-result';
import { ServicesService } from 'src/app/services.service';
import { ShgDetailsRequest } from 'src/app/shg-details-request';
import { ShgDetailsResponse } from 'src/app/shg-details-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { LogoutpopupComponent } from '../logoutpopup/logoutpopup.component';
import { MatDialog } from '@angular/material/dialog';


export interface Member {
  shgcode: number;
  nameOfTheSHG: string;
  animatorName: string;
  userName: string;
}


export interface ShgMember {
  memberName: string;
  husbandOrFatherName: string;
  designation: string;
  savings: string;
  savingsDisbursement: number;
  loanDetails: string;
}
@Component({
  selector: 'app-shg-delete-member',
  templateUrl: './shg-delete-member.component.html',
  styleUrls: ['./shg-delete-member.component.scss']
})
export class ShgDeleteMemberComponent implements OnInit {
  grpId!: any
  @ViewChild('paginator', { static: false }) set paginatorPageSize(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = " ";
    }
  }
  @ViewChild('paginatorNew', { static: false }) set paginator(pager: MatPaginator) {
    if (pager) {
      this.shgdataSource.paginator = pager;
      this.shgdataSource.paginator._intl = new MatPaginatorIntl()
      this.shgdataSource.paginator._intl.itemsPerPageLabel = " ";
    }
  }
  private sort!: MatSort;
  private sort2!: MatSort;
  @ViewChild('firstTableSort') set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild('secondTableSort') set matSort2(ms: MatSort) {
    this.sort2 = ms;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.dataSource.sort = this.sort;
    this.shgdataSource.sort = this.sort2;
  }
  shgForm!: FormGroup;
  shg: Shgmemberdelete = new Shgmemberdelete()
  shgDetailsRequest: ShgDetailsRequest = new ShgDetailsRequest();
  hideRequiredMarker = "true"
  selectedStateName = "";
  selectedDistrictName = "";
  selectedIaName = "";
  selectedMembers:any

  filters = new FormControl();
  // validation 
  stateNameSelect = "";
  districtNameSelect = "";
  iaNameSelect = "";
  animatorNameselect = "";
  statevalue!: boolean;
  districtvalue!: boolean;
  iavalue!: boolean;
  // state=false;
  // district=false;
  filter = new FormControl();
  constructor(private service: ServicesService, private router: Router, private cdref: ChangeDetectorRef, private dialog: MatDialog, private fb: FormBuilder, private snackBar: MatSnackBar, private spinnerService: NgxSpinnerService) {
    this.dataSource = new MatTableDataSource<ShgDetailsResponse>(this.shgDetailsResponse);
    this.shgdataSource = new MatTableDataSource<StatedetailsResult>(this.shgListOfMemberResult); // class with object
  }
  //on init
  stateDetails!: State;
  stateResult: StatedetailsResult[] = [];
  statelist1: Record<any, any>[] = this.stateResult;
  statelist2: Record<any, any>[] = this.stateResult;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;
  shgDetailsResponse: ShgDetailsResponse[] = [];
  shgListOfMemberResult: StatedetailsResult[] = [];
  districtResult: StatedetailsResult[] = [];
  districtlist1: Record<any, any>[] = this.districtResult;
  districtlist2: Record<any, any>[] = this.districtResult;
  iaResult: StatedetailsResult[] = [];
  ialist1: Record<any, any>[] = this.iaResult;
  ialist2: Record<any, any>[] = this.iaResult;
  animatorResult: StatedetailsResult[] = [];
  animatorlist1: Record<any, any>[] = this.animatorResult;
  animatorlist2: Record<any, any>[] = this.animatorResult;
  shgMemberResult !: StatedetailsResult[];
  state = new FormControl();
  district = new FormControl();
  ia = new FormControl();
  animator = new FormControl();
  shgcode = new FormControl();
  shgName = new FormControl();
  //
  stateName !: string;
  districtName !: string;
  nameOfSHPI !: string;
  shpiId !: string;
  animatorId !: string;
  shgCode !: string;
  ngOnInit(): void {
    this.grpId == "";
    this.selectedMembers="";
    this.statevalue = false;
    this.districtvalue = false;
    this.iavalue = false;
    this.service.getStateService().subscribe(data => {
      this.stateDetails = data;
      this.stateResult = this.stateDetails.result;
      this.statelist1 = this.stateResult;
      this.statelist2 = this.stateResult;
    });
  }
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }
  applyFilters(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.shgdataSource.filter = filterValue.trim().toLowerCase();
  }
  //single space
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
  dataSource = new MatTableDataSource<ShgDetailsResponse>(this.shgDetailsResponse);
  shgdataSource = new MatTableDataSource<StatedetailsResult>(this.shgListOfMemberResult); // class with object
  displayedColumns: string[] = ['select', 'shgCode', 'nameOfTheSHG', 'animatorName', 'userName'];
  shgdisplayedColumns: string[] = ['select', 'memberName', 'husbandOrFatherName', 'designation', 'savings', 'savingsDisbursement', 'internalLoan', 'cashCredit', 'termLoan', 'mfiLoan', 'bulkLoan'];
  selection = new SelectionModel<ShgDetailsResponse>(true, []); // imp
  shgselection = new SelectionModel<StatedetailsResult>(true, []); // imp
  // isAllSelectedCheckBox(value: any, row: any) {

  //   this.shgDetailsResponse.forEach(val => {
  //     if (val.group_id == row.group_id) {
  //       val.isSelected = !val.isSelected;

  //     } else {
  //       val.isSelected = false;
  //       if (value) {
  //         this.grpId = row.group_id
  //       } else {
  //         this.grpId = ""
  //       }
  //     }
  //   })





  //   this.shgdataSource.data = [];
  //   this.toShow = false;



  // }

  isAllSelectedCheckBox(value: any, row: any) {
    this.shgDetailsResponse.forEach(val => {
      if (val.group_id == row.group_id) {
        val.isSelected = !val.isSelected;
        if (value) {
          this.grpId = row.group_id
        } else {
          this.grpId = ""
        }
      }
      else {
        val.isSelected = false;
        if (value) {
          this.grpId = row.group_id
        } else {
          this.grpId = ""
        }
      }
    })


    this.shgdataSource.data = [];
    this.toShow = false;
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  isRowSelected() {
    const numSelected = this.selection.selected.length;
    return numSelected === 1;
  }
  isAllShgSelected() {
    const numShgSelected = this.shgselection.selected.length;
    const numShgRows = this.shgdataSource.data.length;
    return numShgSelected === numShgRows;
  }
  onBlur(): void {
    this.state.markAsUntouched();
    this.district.markAsUntouched();
    this.ia.markAsUntouched();
  }
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }
  toggleAllShgRows() {
    if (this.isAllShgSelected()) {
      this.shgselection.clear();
      return;
    }
    this.shgselection.select(...this.shgdataSource.data);
  }
  checkboxLabel(row?: ShgDetailsResponse): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'}`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.shgCode + 1}`;
  }
  shgcheckboxLabel(shgrow?: StatedetailsResult): string {
    if (!shgrow) {
      return `${this.isAllShgSelected() ? 'deselect' : 'select'}`;
    }
    return `${this.shgselection.isSelected(shgrow) ? 'deselect' : 'select'} shgrow ${shgrow.member_name + 1}`;
  }
  onSelect(stateName: string) {
    this.districtlist1 = [];
    this.districtlist2 = []
    this.ialist1 = [];
    this.ialist2 = [];
    this.animatorlist1 = [];
    this.animatorlist2 = [];
    this.toDisplay = false;
    this.dataSource.data = [];
    this.toShow = false;
    this.shgdataSource.data = [];
    this.stateNameSelect = stateName;
    this.districtNameSelect = "";
    this.iaNameSelect = "";
    this.animatorNameselect = "";
    this.selectedStateName = stateName;
    this.selectedDistrictName = "";
    this.selectedIaName = "";
    this.statevalue = false;
    this.districtResult = [];
    this.iaResult = [];
    this.animatorResult = [];
    this.stateName = stateName;
    this.shgDetailsRequest.state = stateName;
    this.service.districtNameFetch(stateName).subscribe(data => {
      this.district.reset();
      this.ia.reset();
      this.animator.reset();

      this.shgName.reset();
      this.shgcode.reset();

      this.stateDetails = data;
      this.districtResult = this.stateDetails.result;
      if (this.districtResult.length <= 0) {
        this.snackBar.open('District not found', '', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'center',
        });
      }
      this.districtlist1 = this.districtResult;
      this.districtlist2 = this.districtResult;
    });
  }
  shgCodeReset() {
    // this.ia.reset()
    // this.animator.reset()
    this.shgName.reset()
  }

  onChange(districtName: string) {
    this.ialist1 = [];
    this.ialist2 = [];
    this.animatorlist1 = [];
    this.animatorlist2 = [];
    this.districtNameSelect = districtName;
    this.iaNameSelect = "";
    this.animatorNameselect = "";
    this.toDisplay = false;
    this.dataSource.data = [];
    this.toShow = false;
    this.shgdataSource.data = [];
    this.districtName = districtName;
    this.shgDetailsRequest.district = this.districtName;
    this.selectedIaName = "";
    this.selectedDistrictName = districtName;
    this.iaResult = [];
    this.animatorResult = [];
    this.statevalue = false;
    this.districtvalue = false;
    this.service.getIaNameList(this.stateName, districtName).subscribe(data => {
      this.stateDetails = data;
      this.iaResult = this.stateDetails.result;
      if (this.iaResult.length <= 0) {
        this.snackBar.open('IA not found', '', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'center',
        });
      }
      this.ialist1 = this.iaResult;
      this.ialist2 = this.iaResult;
      this.ia.reset();
      this.animator.reset();
      this.shgName.reset();
      this.shgcode.reset();

    });
  }
  animatorNameEnter() {
    //this.animatorNameselect="";
    this.toDisplay = false;
    this.dataSource.data = [];
    this.toShow = false;
    this.shgdataSource.data = [];
    this.shgcode.reset()
    this.shgName.reset()
  }
  getAnimaterNames(id: string) {
    this.animatorlist1 = [];
    this.animatorlist2 = [];
    this.iaNameSelect = id;
    this.animatorNameselect = "";
    this.toDisplay = false;
    this.dataSource.data = [];
    this.toShow = false;
    this.shgdataSource.data = [];
    this.shpiId = id;
    this.statevalue = false;
    this.districtvalue = false;
    this.selectedIaName = id;
    this.iavalue = false;
    this.animatorResult = [];
    this.shgDetailsRequest.ngo_id = id;
    this.service.getAnimaterName(this.stateName, this.districtName, this.shpiId).subscribe(data => {
      this.stateDetails = data;
      this.animatorResult = this.stateDetails.result;
      if (this.animatorResult.length <= 0) {
        this.snackBar.open('Animator name not found', '', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'center',
        });
      }
      this.animator.reset()
      this.shgcode.reset()
      this.shgName.reset()

      this.animatorlist1 = this.animatorResult;
      this.animatorlist2 = this.animatorResult;
      var shgMemberIdList2 = this.animatorResult.map(function (shg) {
        return Object.assign({}, shg);
      });
    });
  }
  toDisplay = false
  shpicode: any
  shgDetails() {

    this.shgselection.clear();
    this.shpicode = "";
    this.grpId = "";
    this.selectedMembers="";
    if ((this.selectedStateName == "" || this.selectedStateName == "") && (this.selectedDistrictName == null || this.selectedDistrictName == "") && (this.selectedIaName == null || this.selectedIaName == "")) {
      this.statevalue = true;
      this.districtvalue = true;
      this.iavalue = true;
    }
    else {
      if (this.selectedStateName == null || this.selectedStateName == "") {
        this.statevalue = true;
        this.districtvalue = false;
        this.iavalue = false;
      }
      else if (this.selectedDistrictName == null || this.selectedDistrictName == "") {
        this.statevalue = false;
        this.districtvalue = true;
        this.iavalue = true;
      }
      else if (this.selectedIaName == null || this.selectedIaName == "") {
        this.statevalue = false;
        this.districtvalue = false;
        this.iavalue = true;
      }
      else {
        this.shpicode = this.ia.value
        this.spinnerService.show();
        this.shgDetailsRequest.animatorId = this.animatorId;
        if (this.shgDetailsRequest.shgName != undefined) {

          const shgName = this.shgDetailsRequest.shgName.toUpperCase();
          this.shgDetailsRequest.shgName = shgName.trim();
        }

        if (this.shgDetailsRequest.shgCode != undefined) {


          const shgCode = this.shgDetailsRequest.shgCode.toUpperCase();

          this.shgDetailsRequest.shgCode = shgCode.trim();
        }

        // this.shgDetailsRequest.shgCode.toUpperCase();
        //this.shgDetailsRequest.shgName.toUpperCase();        


       
        this.service.getShgDetails(this.shgDetailsRequest).subscribe(data => {
          this.spinnerService.hide();
          this.stateDetails = data;
          this.shgDetailsResponse = this.stateDetails.result;
          this.dataSource.data = this.shgDetailsResponse;
          if (this.shgDetailsResponse.length <= 0) {
            this.toDisplay = false
            this.snackBar.open('SHG/JLG group not found', '', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',
            });
          } else {
            this.toDisplay = true

            this.dataSource.data = []
            this.shgdataSource.data = []
            this.toShow = false

            this.filter.reset();
            this.dataSource.filter = " ";
            this.filters.reset();
            this.shgdataSource.data=[];
            this.shgdataSource.filter = " ";
            this.dataSource.data = this.shgDetailsResponse;
            // this.snackBar.open('Data fetched successfully', '', {
            //   horizontalPosition: 'center',
            //   verticalPosition: 'top',
            //   duration: 3000,
            //   panelClass: 'center',
            // });
          }
        })
      }
    }
  }
  // if (this.state.invalid || this.district.invalid || this.ia.invalid) {
  // } else {
  //   this.shpicode = this.ia.value
  //   this.spinnerService.show();
  //   this.shgDetailsRequest.animatorId = this.animatorId;
  //   this.service.getShgDetails(this.shgDetailsRequest).subscribe(data => {
  //     this.spinnerService.hide();
  //     this.stateDetails = data;
  //     this.shgDetailsResponse = this.stateDetails.result;
  //     this.dataSource.data = this.shgDetailsResponse;
  //     if (this.shgDetailsResponse.length <= 0) {
  //       this.toDisplay = false
  //       this.snackBar.open('SHG group not found', '', {
  //         horizontalPosition: 'center',
  //         verticalPosition: 'top',
  //         duration: 3000,
  //         panelClass: 'center',
  //       });
  //     } else {
  //       this.toDisplay = true
  //       this.snackBar.open('SHG groups retrieved successfully', '', {
  //         horizontalPosition: 'center',
  //         verticalPosition: 'top',
  //         duration: 3000,
  //         panelClass: 'center',
  //       });
  //     }
  //   })
  // }
  toShow = false
  getGroupMembers() {
    this.shgselection.clear();

    this.selectedMembers="";

    if (this.grpId == "" || this.grpId == null) {
      this.snackBar.open('Please select SHG/JLG group', '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'center',
      });
    } else {
      this.shgdataSource.data = [];
      this.spinnerService.show();
      this.service.shgGroupMembers(this.shpicode, this.grpId).subscribe(data => {
        this.spinnerService.hide();
        this.stateDetails = data;
        this.shgMemberResult = this.stateDetails.result;


        let loan = formatNumber(0, 'en-US',
          '1.2');

        this.shgMemberResult.forEach(member => {
          if (member.cash_Credit == "" || member.cash_Credit == null) {
            member.cash_Credit = loan
          }
          if (member.bulK_LOAN == "" || member.bulK_LOAN == null) {
            member.bulK_LOAN = loan
          }
          if (member.internal_Loan == "" || member.internal_Loan == null) {
            member.internal_Loan = loan
          }
          if (member.mfI_LOAN == "" || member.mfI_LOAN == null) {
            member.mfI_LOAN = loan
          }
          if (member.term_Loan == "" || member.term_Loan == null) {
            member.term_Loan = loan
          }
        })
        if (this.shgMemberResult.length <= 0) {
          this.toShow = false
          this.snackBar.open('SHG/JLG members not found', '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',
          });
        } else {
          this.toShow = true
          // this.snackBar.open('Data fetched successfully', '', {
          //   horizontalPosition: 'center',
          //   verticalPosition: 'top',
          //   duration: 3000,
          //   panelClass: 'center',
          // });

          this.shgMemberResult.forEach(amt => {
            var sav = amt.savings_Disburse
            var loan = amt.savings
            var os = amt.internal_Loan
            var cash = amt.cash_Credit
            var term = amt.term_Loan
            var mfi = amt.mfI_LOAN
            var bulk = amt.bulK_LOAN

            var numSav: number = +sav;
            var numLoan: number = +loan
            var numOS: number = +os
            var numCash: number = +cash
            var numTerm: number = +term
            var numMfi: number = +mfi
            var numBulk: number = +bulk


            let formatSav = formatNumber(numSav, 'en-US',
              '1.2');
            let formatLoan = formatNumber(numLoan, 'en-US',
              '1.2');
            let formatOs = formatNumber(numOS, 'en-US',
              '1.2');
            let formatcash = formatNumber(numCash, 'en-US',
              '1.2');
            let formatTerm = formatNumber(numTerm, 'en-US',
              '1.2');
            let formatMfi = formatNumber(numMfi, 'en-US',
              '1.2');
            let formatBulk = formatNumber(numBulk, 'en-US',
              '1.2');
            var wholeSav = formatSav.replace(/,/g, "")
            var wholeLoan = formatLoan.replace(/,/g, "")
            var wholeOs = formatOs.replace(/,/g, "")
            var wholeCash = formatcash.replace(/,/g, "")
            var wholeTerm = formatTerm.replace(/,/g, "")
            var wholeMfi = formatMfi.replace(/,/g, "")
            var wholeBulk = formatBulk.replace(/,/g, "")



            var deciSav = Number(wholeSav)
            var deciLoan = Number(wholeLoan)
            var deciOs = Number(wholeOs)
            var deciCash = Number(wholeCash)
            var deciTerm = Number(wholeTerm)
            var deciMfi = Number(wholeMfi)
            var deciBulk = Number(wholeBulk)

            var convSav = deciSav.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })
            var convLoan = deciLoan.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })
            var convOs = deciOs.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })

            var convOs = deciOs.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })
            var convCash = deciCash.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })
            var convTerm = deciTerm.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })

            var convMfi = deciMfi.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })

            var convBulk = deciBulk.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })
            amt.savings_Disburse = convSav
            amt.savings = convLoan
            amt.internal_Loan = convOs
            amt.cash_Credit = convCash
            amt.term_Loan = convTerm
            amt.mfI_LOAN = convMfi
            amt.bulK_LOAN = convBulk
          })



          // this.shgMemberResult.forEach(amt =>{
          //   var sav = amt.savings_Disburse
          //   var loan = amt.savings
          //   var os = amt.loan_OS
          //   var numSav: number = +sav;
          //   var numLoan: number = +loan
          //   var numOS: number = +os

          //   let formatSav = formatNumber(numSav, 'en-US',
          //     '1.2');
          //   let formatLoan = formatNumber(numLoan, 'en-US',
          //     '1.2');
          //   let formatOs = formatNumber(numOS, 'en-US',
          //     '1.2');
          //   var wholeSav = formatSav.replace(/,/g, "")
          //   var wholeLoan = formatLoan.replace(/,/g, "")
          //   var wholeOs = formatOs.replace(/,/g, "")

          //   var deciSav = Number(wholeSav)
          //   var deciLoan = Number(wholeLoan)
          //   var deciOs = Number(wholeOs)

          //   var convSav = deciSav.toLocaleString('en-IN', {
          //     minimumFractionDigits: 2, maximumFractionDigits: 2
          //   })
          //   var convLoan = deciLoan.toLocaleString('en-IN', {
          //     minimumFractionDigits: 2, maximumFractionDigits: 2
          //   })
          //   var convOs = deciOs.toLocaleString('en-IN', {
          //     minimumFractionDigits: 2, maximumFractionDigits: 2
          //   })
          //   amt.savings_Disburse = convSav
          //   amt.savings = convLoan
          //   amt.loan_OS = convOs
          // })


          this.shgdataSource.data = this.shgMemberResult;
        }
      })
    }
  }
  deleteShgMembers() {
    var shgMemberIdList = this.shgselection.selected.map(function (shg) {
      return shg.mem_Id;
    });
    const listOfMemberId = shgMemberIdList.map(mem_Id => ({ mem_Id }));
    // const listemberId = shgMemberIdList.map(mem_Id => ({ mem_Id }));
    if (listOfMemberId.length <= 0) {
      this.snackBar.open('Please select SHG/JLG member', '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'center',
      });
    } else {
      this.openConfirmDialog();
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
  //
  districtTouch() {
    if (this.stateNameSelect == "") {
      this.snackBar.open("Please select state", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',
      });
    }
    else {
    }
  }
  iaTouch() {
    if (this.districtNameSelect == "") {
      this.snackBar.open("Please select district", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',
      });
    }
    else { }
  }
  animatorTouch() {
    if (this.iaNameSelect == "") {
      this.snackBar.open("Please select IA name ", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',
      });
    }
    else {
    }
  }
  // new code 
  openConfirmDialog() {
    const dialogRef = this.dialog.open(LogoutpopupComponent, {
      width: '400px',
      autoFocus: false,
      data: {
        message: 'Are you sure want to delete ?'
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.DeleteGroupMembers();
      }
    });
  }
  DeleteGroupMembers() {
    var shgMemberIdList = this.shgselection.selected.map(function (shg) {
      return shg.mem_Id;
    });
    this.selectedMembers=shgMemberIdList;
    const listOfMemberId = this.selectedMembers.map((mem_Id: any) => ({ mem_Id }));


    let k = 0
    let l = 0
    for (let i = 0; i < shgMemberIdList.length; i++) {
      var ind = this.shgMemberResult.find(ko => ko.mem_Id === shgMemberIdList[i])

      if (ind?.designation == "President" || ind?.designation == "Secretary") {
        this.shgselection.clear();

        this.snackBar.open("Can't delete President/Secretary ", '', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 2500,
          panelClass: 'center',
        });
      }
      // (ind?.internal_Loan != '0.00' ||ind?.cash_Credit != '0.00'|| ind?.savings != '0.00' || ind?.savings_Disburse !='0.00' )
      else if (ind?.internal_Loan != '0.00' || ind?.cash_Credit != '0.00' || ind?.term_Loan != '0.00' || ind?.savings != '0.00' || ind?.savings_Disburse != '0.00') {
        ++k;
        if (shgMemberIdList.length == 1) {
          

          this.shgselection.clear();

          this.snackBar.open("Cannot able to delete the selected member", '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2500,
            panelClass: 'center',
          });
        } else {
          this.shgselection.clear();

          this.snackBar.open("Cannot able to delete the selected members", '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2500,
            panelClass: 'center',
          });

        }
      } else {
        ++l;

      }
    }
    if (l == shgMemberIdList.length) {
      this.service.shgMemberDelete(listOfMemberId).subscribe(data => {
        this.stateDetails = data;

        if (this.stateDetails.result.toString() == "SHG Member deleted Successfully" || this.stateDetails.result.toString() == "JLG Member deleted Successfully" || 
        this.stateDetails.result.toString() == "SHG Members deleted Successfully"|| this.stateDetails.result.toString() == "JLG Members deleted Successfully" ||
        this.stateDetails.result.toString() == "SHG Group should contain five members"|| this.stateDetails.result.toString() == "JLG Group should contain four members" 
        ) {
   
            this.snackBar.open(this.stateDetails.result.toString(), '', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',
            });
          
          this.reloadCurrentRoute()
        }  else {
          // this.snackBar.open('Can\'t delete group member', '', {
          //   horizontalPosition: 'center',
          //   verticalPosition: 'top',
          //   duration: 3000,
          //   panelClass: 'center',

          // });
          if (shgMemberIdList.length == 1) {
            this.shgselection.clear();

            // this.snackBar.open('Can\'t delete group member', '', {
            // this.snackBar.open('Can\'t delete the selected member', '', {
            this.snackBar.open('Cannot able to delete the selected member', '', {

              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',
            });
          } else {
            this.shgselection.clear();

            this.snackBar.open('Cannot able to delete the selected members', '', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',
            });
          }
        }

      })
    }
  }
}
