import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServicesService } from 'src/app/services.service';
import { State } from 'src/app/state-details';
import { StatedetailsResult } from 'src/app/statedetails-result';
import { SavingsLoanResponseTable } from 'src/app/savings-loan-response-table'; 
import { SavingsLoanList } from 'src/app/savings-loan-list'; 



// export interface Score1 {
//   State: string,
//   District: string,
//   IA: string,
//   NoofSHGs: string,
//   NoofSHGsLoanAvailed: string,
//   OnlySavings: string,
//   OnlyLoans: string,
//   BothSavingsandLoans: string,
// }


// const ELEMENT_DATA1: Score1[] = [

//   { State: 'Tamil Nadu', District: 'Ramanadhapuram', IA: 'Anniyam', NoofSHGs: '50', NoofSHGsLoanAvailed: '100', OnlySavings: '1,00,000.00', OnlyLoans: '12.00', BothSavingsandLoans: '12,000.00' },
//   { State: 'Tamil Nadu', District: 'Erode', IA: 'Yesteam Foundation', NoofSHGs: '100', NoofSHGsLoanAvailed: '1000', OnlySavings: '0.00', OnlyLoans: '0.00', BothSavingsandLoans: '1,000.00' },
//   { State: 'Assam', District: 'Kanjipuram', IA: 'Gramathin Oil Foundation', NoofSHGs: '4', NoofSHGsLoanAvailed: '39', OnlySavings: '100.00', OnlyLoans: '1,500.00', BothSavingsandLoans: '6.00' },
//   { State: 'Andhaman and Nicobars', District: 'North and Middle Andhaman', IA: 'Integrated organisation of tamil nadu district', NoofSHGs: '1,000', NoofSHGsLoanAvailed: '5', OnlySavings: '10.00', OnlyLoans: '30,000.00', BothSavingsandLoans: '55.00' },

// ];

@Component({
  selector: 'app-savings-loan',
  templateUrl: './savings-loan.component.html',
  styleUrls: ['./savings-loan.component.scss']
})
export class SavingsLoanComponent implements OnInit {

  filter = new FormControl();


  hideRequiredMarker = true;

  statevalue!: boolean
  districtvalue!: boolean
  iavalue!: boolean
  table!: boolean
  pagination!: boolean


  statenameForm = new FormControl();
  districtnameForm = new FormControl();
  ianameForm = new FormControl();

  statedetails: State = new State();
  districtNamedetails: State = new State();
  iaListDetails: State = new State();

  iaDetailsTable: StatedetailsResult = new StatedetailsResult();

  shgsavingsTable: SavingsLoanResponseTable = new SavingsLoanResponseTable();

  shgsavingslist: SavingsLoanList[] = []

  credential: StatedetailsResult = new StatedetailsResult();

  statelist: StatedetailsResult[] = [];

  statelist1: Record<any, any>[] = this.statelist;
  statelist2: Record<any, any>[] = this.statelist;

  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;

  districtlist: StatedetailsResult[] = [];

  districtlist1: Record<any, any>[] = this.districtlist;
  districtlist2: Record<any, any>[] = this.districtlist;

  ialist: StatedetailsResult[] = [];

  ialist1: Record<any, any>[] = this.ialist;
  ialist2: Record<any, any>[] = this.ialist;

  iaTableList: StatedetailsResult[] = [];



  // @ViewChild('firstTableSort', { static: false }) set firstTableSort(sort: MatSort) {
  //   this.dataSource.sort = sort;
  // }

  selectedStateName = "";
  selectedDistrictName = "";
  selectedIaName = "";

  // dataSource = new MatTableDataSource<shgcountresponse>(this.shgTableList);

  displayedColumns: string[] = ['state', 'district', 'ia', 'no_Of_SHGs', 'no_Of_SHGs_LoanAvailed', 'onlySavings', 'onlyLoans', 'bothSavingsLoans'];
  dataSource = new MatTableDataSource<SavingsLoanList>(this.shgsavingslist);

  @ViewChild('paginator', { static: false }) set paginatorPageSize(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = "";
      this.dataSource.paginator.selectConfig.disableOptionCentering = true;

    }
  }

  @ViewChild('firstTableSort', { static: false }) set firstTableSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  constructor(private service: ServicesService, private cdref: ChangeDetectorRef, private spinnerService: NgxSpinnerService, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  ngOnInit() {

    this.statevalue = false;
    this.districtvalue = false;
    this.iavalue = false;

    this.getStateDetailsList();
  }

  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }

  getStateDetailsList() {

    this.service.getStateService().subscribe(statelist => {


      // setTimeout(() => {
      //   this.spinnerService.hide();
      //   }, 2000);
      this.statedetails = statelist;

      this.statelist = this.statedetails.result;
      this.statelist1 = this.statelist;
      this.statelist2 = this.statelist;

    })





  }


  stateName(statename: string) {

    this.districtnameForm.reset();
    this.ianameForm.reset();
    this.selectedStateName = statename;
    this.selectedDistrictName = "";
    this.selectedIaName = "";
    this.statevalue = false;

    this.dataSource.data = [];
    this.pagination = false;
    this.table = false;


    this.districtlist = [];
    this.ialist = [];

    this.service.districtNameFetch(statename).subscribe(districtnamelist => {


      this.districtNamedetails = districtnamelist;


      if (this.districtNamedetails.result.length == 0) {


        this.districtlist = this.districtNamedetails.result;

        this.snackBar.open("District Not Found", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });
      }
      else {


        this.districtlist = this.districtNamedetails.result;
        this.districtlist1 = this.districtlist;
        this.districtlist2 = this.districtlist;

        //   this.snackBar.open("",'' ,
        //   {
        //   horizontalPosition:'center',
        //   verticalPosition:'top',
        //   duration: 3000,
        //   panelClass: 'center',


        // });
      }




    })




  }

  iaList(districtname: string) {

    this.ianameForm.reset();
    this.selectedIaName = "";
    this.selectedDistrictName = districtname;

    this.ialist = [];

    this.ialist1 = [];
    this.ialist2 = [];

    this.iaListDetails.result = [];
    this.dataSource.data = [];
    this.pagination = false;
    this.table = false;

    this.statevalue = false;
    this.districtvalue = false;


    this.service.getIaNameList(this.selectedStateName, districtname).subscribe(ialistfetch => {




      this.iaListDetails = ialistfetch;

      if (this.iaListDetails.result.length == 0) {

        this.ialist = this.iaListDetails.result;

        this.snackBar.open("IA Not Found", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });
      }
      else {

        this.ialist = this.iaListDetails.result;
        this.ialist1 = this.ialist;
        this.ialist2 = this.ialist;

      

      }







    });



  }

  ianame(ianame: string) {

    this.selectedIaName = ianame;
    this.statevalue = false;
    this.districtvalue = false;
    this.iavalue = false;


    this.dataSource.data = [];
    this.pagination = false;
    this.table = false;


  }


  submit() {

    this.filter.reset();
    this.dataSource.filter = " "

    if ((this.selectedStateName == "" || this.selectedStateName == "") && (this.selectedDistrictName == null || this.selectedDistrictName == "") && (this.selectedIaName == null || this.selectedIaName == "")) {
      this.statevalue = true;
      // this.districtvalue = true;
      // this.iavalue = true;
    }


    // else {


    // if (this.selectedStateName == null || this.selectedStateName == "") {

    //   this.statevalue = true;
    //   this.districtvalue = false;
    //   this.iavalue = false;

    // }

    // else if (this.selectedDistrictName == null || this.selectedDistrictName == "") {
    //   this.statevalue = false;
    //   this.districtvalue = true;
    //   this.iavalue = true;
    // }
    // else if (this.selectedIaName == null || this.selectedIaName == "") {
    //   this.statevalue = false;
    //   this.districtvalue = false;
    //   this.iavalue = true;
    // }

    else {

      this.spinnerService.show();

      this.service.savingsList(this.selectedStateName, this.selectedDistrictName, this.selectedIaName).subscribe(shgcountlistfetch => {


        this.spinnerService.hide();
        this.shgsavingsTable = shgcountlistfetch



        if (this.shgsavingsTable.result.length == 0) {
          this.table = false;
          this.pagination = false;

          this.snackBar.open("Record Not Found", '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',


            });

        }
        else {
          this.dataSource.data = [];

          this.table = true;
          this.pagination = true;

          // this.snackBar.open("Data fetched successfully", '',
          //   {
          //     horizontalPosition: 'center',
          //     verticalPosition: 'top',
          //     duration: 3000,
          //     panelClass: 'center',


          //   });


          this.shgsavingslist = this.shgsavingsTable.result
          this.dataSource.data = this.shgsavingslist;

        }


      })
    }




    // }




  }


  letterOnly(event: any) {
    event.target.maxLength = 30;

    var charCode = event.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)

      return true;
    else
      return false;



  }

  districtTouch() {

    if (this.selectedStateName == "") {

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

    if (this.selectedDistrictName == "") {

      this.snackBar.open("Please select district", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',


      });

    }
    else {



    }


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}