import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ServicesService } from 'src/app/services.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { State } from 'src/app/state-details';
import { StatedetailsResult } from 'src/app/statedetails-result';
import { MatTableDataSource } from '@angular/material/table';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-shgs-count',
  templateUrl: './shgs-count.component.html',
  styleUrls: ['./shgs-count.component.scss']
})
export class ShgsCountComponent implements OnInit {

  filter = new FormControl();
  table1 = false;


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



  // shglist: State = new State();


  shgCountTable: State = new State();

  shglist: StatedetailsResult[] = []

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

  displayedColumns: string[] = ['state', 'district', 'ia', 'no_Of_SHGs', 'onlyTransaction', 'onlyBookKeeping', 'bothTransactionBookKeeping'];
  dataSource = new MatTableDataSource<StatedetailsResult>(this.shglist);

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
    this.table1 = false;


    this.districtlist = [];
    this.ialist = [];

    this.service.districtNameFetch(statename).subscribe(districtnamelist => {


      this.districtNamedetails = districtnamelist;


      if (this.districtNamedetails.result.length == 0) {


        this.districtlist = this.districtNamedetails.result;

        this.snackBar.open("District not found", '',
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
    this.table1 = false;

    this.statevalue = false;
    this.districtvalue = false;


    this.service.getIaNameList(this.selectedStateName, districtname).subscribe(ialistfetch => {




      this.iaListDetails = ialistfetch;

      if (this.iaListDetails.result.length == 0) {

        this.ialist = this.iaListDetails.result;

        this.snackBar.open("IA not found", '',
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
    this.table1 = false;


  }


  submit() {



    if ((this.selectedStateName == "" || this.selectedStateName == "")) {
      this.statevalue = true;
      // this.districtvalue = true;
      // this.iavalue = true;
    }


    // else {


    //   if (this.selectedStateName == null || this.selectedStateName == "") {

    //     this.statevalue = true;
    //     this.districtvalue = false;
    //     this.iavalue = false;

    //   }

    //   else if (this.selectedDistrictName == null || this.selectedDistrictName == "") {
    //     this.statevalue = false;
    //     this.districtvalue = true;
    //     this.iavalue = true;
    //   }
    //   else if (this.selectedIaName == null || this.selectedIaName == "") {
    //     this.statevalue = false;
    //     this.districtvalue = false;
    //     this.iavalue = true;
    //   }

    else {

      this.spinnerService.show();

      this.service.shgCountList(this.selectedStateName, this.selectedDistrictName, this.selectedIaName).subscribe(shgcountlistfetch => {

       

        this.spinnerService.hide();
        this.shgCountTable = shgcountlistfetch



        if (this.shgCountTable.result.length == 0) {
          this.table = false;
          this.pagination = false;
          this.table1 = false;

          this.snackBar.open("Record not found", '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',


            });

        }
        else {


          this.filter.reset();
          this.dataSource.filter = ""
          this.dataSource.data = [];

          this.table = true;
          this.pagination = true;
          this.table1 = true;

          // this.snackBar.open("Data fetched successfully", '',
          //   {
          //     horizontalPosition: 'center',
          //     verticalPosition: 'top',
          //     duration: 3000,
          //     panelClass: 'center',


          //   });
          this.shglist = this.shgCountTable.result



          this.dataSource.data = this.shglist;

        }


      })
    }




  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

}
