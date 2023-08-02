import { AfterViewInit, COMPILER_OPTIONS, ChangeDetectorRef, Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { NgxSpinnerService } from 'ngx-spinner';


import { Iadetail } from 'src/app/iadetail';
import { ServicesService } from 'src/app/services.service';
import { State } from 'src/app/state-details';
import { StatedetailsResult } from 'src/app/statedetails-result';



@Component({
  selector: 'app-ia-detail',
  templateUrl: './ia-detail.component.html',
  styleUrls: ['./ia-detail.component.scss']
})
export class IaDetailComponent implements OnInit {


  selectedStateName = "";
  selectedDistrictName = "";
  selectedIaName = "";

  statevalue!: boolean;
  districtvalue!: boolean;
  iavalue!: boolean;

  statenameForm = new FormControl();
  districtnameForm = new FormControl();
  ianameForm = new FormControl();

  table!: boolean;
  pagination!: boolean;

  tabWasClosed!:boolean;

  toDisplay = true;

  constructor(private service: ServicesService,private cdref: ChangeDetectorRef, private spinnerService: NgxSpinnerService, public dialog: MatDialog, private snackBar: MatSnackBar)
   { 

    
    



   }




  ngOnInit() {

    this.statevalue = false;
    this.districtvalue = false;
    this.iavalue = false;

    this.dataSource.sort = this.firstTableSort;
    this.getStateDetailsList();
  //this.leavePage();
    
  
  }
  ngAfterContentChecked() {
    
    this.cdref.detectChanges();
 }



  hideRequiredMarker = true;

  iadetails: Iadetail = new Iadetail();

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

  districtNamedetails: State = new State();

  statedetails: State = new State();

  iaListDetails: State = new State();

  iaDetailsTable: State = new State();


  public filterList = this.statelist.slice();



  @ViewChild('firstTableSort', { static: false }) set firstTableSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }


  dataSource = new MatTableDataSource<StatedetailsResult>(this.iaTableList);

  displayedColumns: string[] = ['ianame', 'username', 'password'];

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



    this.toDisplay = true;



  }
  getStateDetailsList() {
    // this.spinnerService.show();

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

    this.dataSource.data=[];
    this.pagination=false;
    this.table=false;


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

    this.ialist1=[];
    this.ialist2=[];

    this.iaListDetails.result=[];
    this.dataSource.data=[];
    this.pagination=false;
    this.table=false;

    this.statevalue = false;
    this.districtvalue = false;


    this.service.getIaNameList(this.selectedStateName, districtname).subscribe(ialistfetch => {
   



      this.iaListDetails = ialistfetch;

      if (this.iaListDetails.result.length == 0) {

        this.ialist = this.iaListDetails.result;

        this.snackBar.open("IA Not found", '',
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

//         this.ialist.forEach(list => {
//    
// var abc=list.name_of_SHPI.length
// 
//     if(list.name_of_SHPI.length>10){
//       
//     }else{
//       

//     }
  
//         });
// this.ialist2.forEach(new){}
        //   this.snackBar.open("Record Not Found",'' ,
        //   {
        //   horizontalPosition:'center',
        //   verticalPosition:'top',
        //   duration: 3000,
        //   panelClass: 'center',


        // });

      }







    });
  }


  ianame(ianame: string) {

    this.selectedIaName = ianame;
    this.statevalue = false;
    this.districtvalue = false;
    this.iavalue = false;

    
    this.dataSource.data=[];
    this.pagination=false;
    this.table=false;


  }

  submit() {




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

        this.spinnerService.show();

        this.service.iaTableList(this.selectedStateName, this.selectedDistrictName, this.selectedIaName).subscribe(ialistfetch => {

          this.spinnerService.hide();

         
          this.iaDetailsTable = ialistfetch;

          if (this.iaDetailsTable.result.length == 0) {
            this.table = false;
            this.pagination = false;

            this.snackBar.open("Record not found", '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',


              });

          }
          else {

            this.table = true;
            this.pagination = true;

            // this.snackBar.open("Data fetched successfully", '',
            //   {
            //     horizontalPosition: 'center',
            //     verticalPosition: 'top',
            //     duration: 3000,
            //     panelClass: 'center',


            //   });

            this.iaTableList = this.iaDetailsTable.result;
            this.dataSource.data = this.iaTableList;

          }


        })
      }




    }




  }


  letterOnly(event: any) {
    event.target.maxLength=30;

    var charCode = event.keyCode;
  
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)
  
      return true;
    else
      return false;
  }



districtTouch()
{

  if(this.selectedStateName =="")
  {

    this.snackBar.open("Please select state", '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2500,
      panelClass: 'center',


    });

  }
  else{


    
  }
  

}


iaTouch()
{



  if(this.selectedDistrictName =="")
  {

    this.snackBar.open("Please select district", '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2500,
      panelClass: 'center',


    });

  }
  else{


    
  }
  
}


}