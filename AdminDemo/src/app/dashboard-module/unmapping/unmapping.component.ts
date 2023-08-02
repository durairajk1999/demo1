import { animate } from '@angular/animations';
import { Component, OnInit, ViewChild, AfterViewInit, HostListener, Input, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';


import { ServicesService } from 'src/app/services.service';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';

import { State } from 'src/app/state-details';
import { StatedetailsResult } from 'src/app/statedetails-result';
import { Unmapping } from 'src/app/unmapping';
import { UnmappingRequestPopUpComponent } from '../unmapping-request-pop-up/unmapping-request-pop-up.component';
import { constrainedMemory } from 'process';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-unmapping',
  templateUrl: './unmapping.component.html',
  styleUrls: ['./unmapping.component.scss'],
  providers: [DatePipe]
})
export class UnmappingComponent implements OnInit, AfterViewInit {


  statelist: State = new State();
  dateconv!: any
  updateDatevalue!: any;

  statelist1: Record<any, any>[] = this.statelist.result;
  statelist2: Record<any, any>[] = this.statelist.result;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;

  districtlist: State = new State();
  districtOflist: StatedetailsResult[] = [];
  districtlist1: Record<any, any>[] = this.districtlist.result;
  districtlist2: Record<any, any>[] = this.districtlist.result;

  ialist: State = new State();
  iaoflist: StatedetailsResult[] = [];


  serialId = "";

  unmappMessage = "";

  approvedIcon!: boolean;
  rejectIcon!: boolean;

  unmapRequestBy: any;
  unmapApprovedBy: any;

  stateNameSelect = "";
  districtNameSelect = "";
  iaNameselect = "";
  merchantNameSelect = "";

  merchantCodeValueForm = new FormControl();

  ialist1: Record<any, any>[] = this.ialist.result;
  ialist2: Record<any, any>[] = this.ialist.result;

  merchantlist: State = new State();
  merchantoflist: StatedetailsResult[] = [];

  merchantlist1: Record<any, any>[] = this.merchantlist.result;
  merchantlist2: Record<any, any>[] = this.merchantlist.result;


  stateForm = new FormControl();
  districtForm = new FormControl();
  iaForm = new FormControl();
  merchantForm = new FormControl();

  CommomMerchantId = "";

  requestmsg = "New request";
  public screenWidth: any;
  public screenHeight: any;


  requestCheck = false;

  pagination1!: boolean;
  table1!: boolean;
  pagination2!: boolean;
  table2!: boolean;
  unmaprequest!: boolean;
  merchantCodeValue = "";

  userRole = "";

  merchantRequired = false;
  iaRequired = false;
  districtRequired = false;
  stateRequired = false;


  merchant!: any;
  merchantrequestResponse: State = new State();

  selectedDistrictName = "";

  merchatReportlist: State = new State();
  merchatReportStatus: State = new State();
  merchatDetailsReportlist: State = new State();


  merchatUnmappingRequest: State = new State();
  merchantRequestReport: StatedetailsResult[] = []

  merchantTableReport: StatedetailsResult[] = []
  merchantTableReportStatus: StatedetailsResult[] = []

  stateobject: StatedetailsResult = new StatedetailsResult();
  merchantCode: StatedetailsResult = new StatedetailsResult();

  selectedStateName = "";
  selectediaId = "";
  selectedMerchantIdvalue = "";
  selectedMerchantIdvalue1 = "";

  dataSource = new MatTableDataSource<StatedetailsResult>(this.merchantRequestReport);
  dataSource2 = new MatTableDataSource<StatedetailsResult>(this.merchantTableReport);

  displayedColumns: string[] = ['state', 'district',
    'requestedBy', 'requestedDate', 'updatedBy', 'updatedDate', 'status', 'actions'];
  displayedColumns2: string[] = ['state_Name', 'district_Name', 'name_of_SHPI', 'merchantCode', 'merchantName', 'serialNumber'];

  @ViewChild('firstTableSort') firstTableSort!: MatSort;

  @ViewChild('secondTableSort')
  public secondTableSort!: MatSort;

  @ViewChild('paginator', { static: false }) set paginatorPageSize(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = "";
      this.dataSource.paginator.selectConfig.disableOptionCentering = true;

    }
  }

  @ViewChild('paginator1', { static: false }) set paginatorPageSize1(pager: MatPaginator) {
    if (pager) {
      this.dataSource2.paginator = pager;
      this.dataSource2.paginator._intl = new MatPaginatorIntl()
      this.dataSource2.paginator._intl.itemsPerPageLabel = "";
      this.dataSource2.paginator.selectConfig.disableOptionCentering = true;

    }
  }
  constructor(private datePipe: DatePipe, private service: ServicesService, private dialog: MatDialog, private cdref: ChangeDetectorRef, private spinnerService: NgxSpinnerService, private snackBar: MatSnackBar) { }

  signInNavResponse: SignInNavResponse = new SignInNavResponse();
  ngOnInit() {

    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');

    this.pagination1 = false;
    this.table1 = false;
    this.pagination2 = false;
    this.table2 = false;
    this.unmaprequest = false;




    this.userRole = this.signInNavResponse.responseContent.roles[0];
    this.stateselection()
    // this.screenWidth = window.innerWidth;
    // this.screenHeight = window.innerHeight;

    // this.ngOnInitMethod(this.screenWidth);

  }

  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;

    this.hostMethod(this.screenWidth);

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.firstTableSort;
    this.dataSource2.sort = this.secondTableSort;

  }

  passwordChange() {
    if (this.merchantCodeValueForm.hasError('pattern')) {
      return 'Enter valid merchant code';
    }
    return this.merchantCodeValueForm.hasError('minlength') ? 'Should have minimum 9 characters' : '';

  }

  unmapform!: FormGroup;
  hideRequiredMarker = true;



  toDisplay = false;

  toggleData() {
    this.toDisplay = true;


  }




  stateselection() {
    this.service.getStateService().subscribe(statedetailslist => {



      if (statedetailslist.result.length == 0) {

        this.snackBar.open('State not found', '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });

      }
      else {

        this.statelist = statedetailslist;
        this.statelist1 = this.statelist.result;
        this.statelist1 = this.statelist.result;

      }
    })
  }



  stateSelected(stateName: string) {


    this.ialist1 = [];
    this.ialist2 = [];
    this.merchantlist1 = [];
    this.merchantlist2 = [];
    this.districtlist1 = [];
    this.districtlist2 = [];


    this.stateNameSelect = stateName;
    this.districtNameSelect = "";
    this.iaNameselect = "";
    this.merchantNameSelect = "";


    this.pagination1 = false;
    this.table1 = false;
    this.dataSource2.data = [];
    this.unmaprequest = false;
    this.pagination2 = false;
    this.table2 = false;
    this.dataSource.data = [];


    this.selectedStateName = stateName;

    this.stateRequired = false;
    this.selectedDistrictName = "";
    this.selectediaId = "";
    this.selectedMerchantIdvalue = ""
    this.merchantCodeValue = "";

    this.districtForm.reset();
    this.iaForm.reset();
    this.merchantForm.reset();

    this.districtlist.result = [];
    this.ialist.result = [];
    this.merchantlist.result = [];


    this.service.districtNameFetch(stateName).subscribe(districtName => {


      if (districtName.result.length == 0) {
        this.snackBar.open('District not found', '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });

      }
      else {

        this.districtlist = districtName;
        this.districtlist1 = this.districtlist.result;
        this.districtlist1 = this.districtlist.result;
        this.districtOflist = this.districtlist.result;
      }
    })

  }

  districtSelected(districtName: string) {

    this.ialist1 = [];
    this.ialist2 = [];
    this.merchantlist1 = [];
    this.merchantlist2 = [];


    this.districtNameSelect = districtName;
    this.iaNameselect = "";
    this.merchantNameSelect = "";


    this.pagination1 = false;
    this.table1 = false;
    this.dataSource2.data = [];
    this.unmaprequest = false;
    this.pagination2 = false;
    this.table2 = false;
    this.dataSource.data = [];

    this.districtRequired = false;
    this.iaForm.reset();
    this.merchantForm.reset();
    this.ialist.result = [];
    this.merchantlist.result = [];

    this.selectediaId = "";
    this.selectedMerchantIdvalue = ""


    this.selectedDistrictName = districtName;
    this.service.getIaNameList(this.selectedStateName, districtName).subscribe(iadetailslist => {


      if (iadetailslist.result.length == 0) {
        this.snackBar.open('IA name not found', '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });
      }
      else {
        this.ialist = iadetailslist;
        this.ialist1 = this.ialist.result;
        this.ialist2 = this.ialist.result;
        this.iaoflist = this.ialist.result;

      }
    })

  }


  iaselected(iaID: any) {


    this.merchantlist1 = [];
    this.merchantlist2 = [];


    this.iaNameselect = iaID;
    this.merchantNameSelect = "";

    this.pagination1 = false;
    this.table1 = false;
    this.dataSource2.data = [];
    this.unmaprequest = false;
    this.pagination2 = false;
    this.table2 = false;
    this.dataSource.data = [];

    this.iaRequired = false;
    this.selectedMerchantIdvalue = "";
    this.selectedMerchantIdvalue1 = "";
    this.stateobject.merchantID = "";

    this.selectediaId = iaID.toString();
    this.service.merchantDetails(iaID).subscribe(merchantName => {



      if (merchantName.result.length == 0) {
        this.snackBar.open('Merchant name not found', '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });

      }
      else {

        this.merchantlist = merchantName;
        this.merchantlist1 = this.merchantlist.result;
        this.merchantlist2 = this.merchantlist.result;
        this.merchantoflist = this.merchantlist.result;
      }

    })
  }

  selectedMerchantId(merchantId: number) {




    this.pagination1 = false;
    this.table1 = false;
    this.dataSource2.data = [];
    this.unmaprequest = false;
    this.pagination2 = false;
    this.table2 = false;
    this.dataSource.data = [];

    this.merchantRequired = false;

    this.selectedMerchantIdvalue1 = merchantId.toString();
    this.CommomMerchantId = this.selectedMerchantIdvalue1;

  }

  merchantCodeEnter(merchantCode: string) {

    this.pagination1 = false;
    this.table1 = false;
    this.dataSource2.data = [];
    this.unmaprequest = false;
    this.pagination2 = false;
    this.table2 = false;
    this.dataSource.data = [];

    this.selectedMerchantIdvalue = merchantCode;
    this.stateForm.reset();
    this.districtForm.reset();
    this.iaForm.reset();
    this.merchantForm.reset();
    this.stateRequired = false;
    this.districtRequired = false;
    this.iaRequired = false;
    this.merchantRequired = false;

    this.selectedStateName = "";
    this.selectedDistrictName = "";
    this.selectedMerchantIdvalue1 = "";
    this.selectediaId = "";
    this.CommomMerchantId = merchantCode;

  }


  submit() {


    if (this.selectedMerchantIdvalue == null || this.selectedMerchantIdvalue == "") {




      if ((this.selectedStateName == "" || this.selectedStateName == null) && (this.selectedDistrictName == "" || this.selectedDistrictName == null) && (this.selectediaId == "" || this.selectediaId == null) && (this.selectedMerchantIdvalue1 == "" || this.selectedMerchantIdvalue1 == null)) {
        // all field are empty
        this.merchantRequired = true;
        this.iaRequired = true;
        this.districtRequired = true;
        this.stateRequired = true;
      }

      else {

        if (this.selectedStateName == "" || this.selectedStateName == null) {

          this.stateRequired = true;
          this.districtRequired = true;
          this.iaRequired = true;
          this.merchantRequired = true;



        }
        else if (this.selectedDistrictName == "" || this.selectedDistrictName == null) {


          this.districtRequired = true;
          this.iaRequired = true;
          this.merchantRequired = true;
        }
        else if (this.selectediaId == "" || this.selectediaId == null) {

          this.iaRequired = true;
          this.merchantRequired = true;

        }
        else if (this.selectedMerchantIdvalue1 == null || this.selectedMerchantIdvalue1 == "") {

          this.stateobject.merchantID = "";
          this.merchantRequired = true;
        }

        else {
          // all value are ok 



          this.CommomMerchantId = this.stateobject.merchantID;
          this.spinnerService.show();
          this.service.merchantDetailsReport1(this.stateobject).subscribe(response => {



            this.spinnerService.hide();



           


            this.merchatDetailsReportlist = response;

            if (response.result.length == 0) {

              this.pagination1 = false;
              this.table1 = false;

              this.unmaprequest = false;

              this.snackBar.open('Record not found', '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',


                });
              this.dataSource2.data = [];

            }
            else {



              if (this.merchatDetailsReportlist.result[0].serialId == "") {

                this.snackBar.open('Merchant already unmapped', '',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 3000,
                    panelClass: 'center',


                  });


              }

              else {


                this.pagination1 = true;
                this.table1 = true;
                this.merchantTableReport = this.merchatDetailsReportlist.result;

                this.dataSource2.data = this.merchantTableReport;
                for (let i = 0; i < this.merchantTableReport.length; i++) {

                  this.serialId = this.merchantTableReport[i].serialId;
                }

                this.unmappingStatus();

              }










              //this.unmaprequest=true;

              // this.snackBar.open('Data fetched successfully','' ,
              // {
              // horizontalPosition:'center',
              // verticalPosition:'top',
              // duration: 3000,
              // panelClass: 'center',


              // });


            }



          })
        }
      }



    }
    else {


      if (this.merchantCodeValueForm.valid) {



        this.spinnerService.show();
        this.service.merchantDetailsReport(this.selectedMerchantIdvalue).subscribe(response => {


         

          this.spinnerService.hide();

          this.merchatDetailsReportlist = response;


          if (response.result == "Merchant not exists") {

            this.pagination1 = false;
            this.table1 = false;

            this.unmaprequest = false;

            this.snackBar.open('Merchant not exists', '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',


              });

            // this.merchantCodeValue = "";
            this.dataSource2.data = [];

            this.pagination2 = false;
            this.table2 = false;
          }



          else if (response.message == "Already Unmapped") {
            this.pagination1 = false;
            this.table1 = false;

            this.unmaprequest = false;

            this.snackBar.open('Merchant already unmapped', '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',


              });

            // this.merchantCodeValue = "";
            this.dataSource2.data = [];

            this.pagination2 = false;
            this.table2 = false;

          }
          else {


            this.pagination1 = true;
            this.table1 = true;


            //this.unmaprequest=true;

            // this.snackBar.open('Data fetched successfully','' ,
            // {
            // horizontalPosition:'center',
            // verticalPosition:'top',
            // duration: 3000,
            // panelClass: 'center',


            // });


            this.merchantTableReport = this.merchatDetailsReportlist.result;

            for (let i = 0; i < this.merchantTableReport.length; i++) {

              this.serialId = this.merchantTableReport[i].serialId;
            }



            this.dataSource2.data = this.merchantTableReport;

            this.unmappingStatus();

          }



        })

      }




    }









  }
  requestedToUnmap() {


    this.spinnerService.show();
    this.service.RequestedToUnmapping(this.CommomMerchantId, this.signInNavResponse.responseContent.roles[0] + " " + "/" + " " + this.signInNavResponse.responseContent.username).subscribe(responseForUnmap => {

      this.spinnerService.hide();
      this.merchatUnmappingRequest = responseForUnmap;

      if (this.merchatUnmappingRequest.message == "Success") {




        this.snackBar.open('Request sent successfully', '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });


        this.unmappingStatus();

      }
      else {

        if (responseForUnmap.status == "False") {

          this.snackBar.open('Request is pending', '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',


            });

          this.unmappingStatus();

        }




      }


    })



  }

  unmappingRequest() {




    const v = this.CommomMerchantId;

    this.unmappMessage = "Are you sure want to unmap ?";

    const dialogRef = this.dialog.open(UnmappingRequestPopUpComponent,
      {
        width: '400px',
        autoFocus: false,


        data: { v: v, unmappMessage: this.unmappMessage }
      });

    dialogRef.afterClosed().subscribe((resposne: boolean) => {
      if (resposne) {
        this.requestedToUnmap();

        //this.confirmUnmapping(v);
      }
    })




  }

  confirmUnmapping(v: string) {
    this.service.RequestedToUnmapping(v, this.signInNavResponse.responseContent.id).subscribe(responseStatus => {

      this.merchatReportStatus = responseStatus;

      if (responseStatus.result.length == 0) {


        this.snackBar.open('Failed', '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });


      }
      else {
        // this.snackBar.open('Data fetched successfully', '',
        //   {
        //     horizontalPosition: 'center',
        //     verticalPosition: 'top',
        //     duration: 3000,
        //     panelClass: 'center',


        //   });
        this.pagination2 = true;
        this.table2 = true;

        this.merchantTableReportStatus = this.merchatReportStatus.result;

        this.dataSource.data = this.merchantTableReportStatus;


      }



    })


  }
  unmappingStatus() //ok
  {


    this.service.merchantRequestStatus(this.CommomMerchantId).subscribe(responseStatus => {



      this.merchatReportStatus = responseStatus;

      //const userId=this.signInNavResponse.responseContent.id.toString();



      //   if (this.merchatReportStatus.result.length == 0)
      //   {

      //   }
      //   else{


      //   if(userId ==this.merchatReportStatus.result[0].requestedBy)
      //   {

      //     // same user 
      //     this.unmapRequestBy=this.signInNavResponse.responseContent.roles[0]+" / "+this.signInNavResponse.responseContent.username;
      //   }
      //   else{
      //     // another user 


      //   }

      //   if(userId == this.merchatReportStatus.result[0].updatedBy)
      //   {
      //     // same user 
      //     this.unmapApprovedBy = this.merchatReportStatus.result[0].updatedBy;
      //   }
      //   else{

      //     this.unmapApprovedBy =this.merchatReportStatus.result[0].updatedBy;
      //   }

      // }







      if (this.merchatReportStatus.result.length != 0) {



        this.unmapRequestBy = this.merchatReportStatus.result[0].requestedBy;
        this.unmapApprovedBy = this.merchatReportStatus.result[0].updatedBy;



        if (this.merchatReportStatus.result[0].requestedDate == "-") {

        }
        else {
          // this.merchatReportStatus.result.forEach(dte => {
          //   var dat = dte.requestedDate;

          //   let myDate1 = dat.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
          //   this.dateconv = this.datePipe.transform(myDate1, 'dd/MM/yyyy hh:mm:ss', 'es-ES');
          //   dte.requestedDate = this.dateconv;


          // })

        }

        if (this.merchatReportStatus.result[0].updatedDate == "-") {

        }
        else {
          // this.merchatReportStatus.result.forEach(dte => {
          //   var updateDate = dte.updatedDate;

          //   let myDate = updateDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
          //   this.updateDatevalue = this.datePipe.transform(myDate, 'dd/MM/yyyy hh:mm:ss ', 'es-ES');
          //   dte.updatedDate = this.updateDatevalue;


          // })

        }





        if (this.merchatReportStatus.result[0].status == "Pending") {

          // both approved and reject 

          this.unmaprequest = false;

          this.approvedIcon = true;
          this.rejectIcon = true;

          this.pagination2 = true;
          this.table2 = true;

          this.merchantTableReportStatus = this.merchatReportStatus.result;

          this.dataSource.data = this.merchantTableReportStatus;


        }

        else if (this.merchatReportStatus.result[0].status == "Rejected") {

          // only approved 
          this.unmaprequest = true;

          this.approvedIcon = false;
          this.rejectIcon = false;

          this.pagination2 = true;
          this.table2 = true;

          this.merchantTableReportStatus = this.merchatReportStatus.result;

          this.dataSource.data = this.merchantTableReportStatus;

        }

        else {

          if (this.merchatReportStatus.result[0].status == "Unmapped") {

            if (this.dataSource2.data[0].serialId != "" || this.dataSource2.data[0].serialId != null) {

              this.unmaprequest = true;

            }
            else {



              this.dataSource2.data[0].serialId = "";
              this.unmaprequest = false;

            }



            this.approvedIcon = false;
            this.rejectIcon = false;

            this.pagination2 = true;
            this.table2 = true;

            this.merchantTableReportStatus = this.merchatReportStatus.result;
            this.dataSource.data = this.merchantTableReportStatus;
          }
          else {



            // this.unmaprequest = true;
            // this.dataSource2.data[0].serialId="";

            // this.approvedIcon = false;
            // this.rejectIcon = false;

            // this.pagination2 = true;
            // this.table2 = true;

            // this.merchantTableReportStatus = this.merchatReportStatus.result;
            // this.dataSource.data = this.merchantTableReportStatus;

          }

          // both approved and reject 









        }

      }


      else {


        //     this.snackBar.open('Status fetched failed','' ,
        // {
        // horizontalPosition:'center',
        // verticalPosition:'top',
        // duration: 3000,
        // panelClass: 'center',


        // });

        this.dataSource.data = [];
        this.table2 = false;
        this.unmaprequest = true;

        // status not fetch 

      }











    })

  }

  statusShowAndRequestNotShow() {

    // this.snackBar.open('Data fetched successfully', '',
    //   {
    //     horizontalPosition: 'center',
    //     verticalPosition: 'top',
    //     duration: 3000,
    //     panelClass: 'center',


    //   });



    this.pagination2 = true;
    this.table2 = true;

    this.merchantTableReportStatus = this.merchatReportStatus.result;

    if (this.merchatReportStatus.result[0].status == "Pending") {

      this.unmaprequest = false;



    }
    else {

      if (this.merchatReportStatus.result[0].status == "Rejected") {



        this.unmaprequest = true;

      }

      else {

        this.unmaprequest = false;
      }



    }


    this.dataSource.data = this.merchantTableReportStatus;


  }

  statusNotShowAndRequestShow() {

    this.snackBar.open('Status fetched failed', '',
      {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'center',


      });

    this.dataSource.data = [];
    this.table2 = false;
    this.unmaprequest = true;

  }

  statusNotShowAndRequestNotShow() {

    this.snackBar.open('Status fetched failed', '',
      {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'center',


      });
    this.pagination2 = false;

    this.dataSource.data = [];
    this.table2 = false;
    this.unmaprequest = false;
  }


  statusShowAndRequestShow() {

    // this.snackBar.open('Data fetched successfully', '',
    //   {
    //     horizontalPosition: 'center',
    //     verticalPosition: 'top',
    //     duration: 3000,
    //     panelClass: 'center',


    //   });

    this.unmaprequest = true;


    this.pagination2 = false;
    this.table2 = false;
    this.dataSource.data = [];

  }


  // ngOnInitMethod(value: any) {

  //   // if (value > 1500) {

  //   //   (document.getElementById("newrequestbutton") as HTMLElement).style.marginLeft = "90%";

  //   //   (document.getElementById("newrequestbutton") as HTMLElement).style.width = "10%";
  //   // }
  //   // else {
  //   //   (document.getElementById("newrequestbutton") as HTMLElement).style.marginLeft = "66%";

  //   //   (document.getElementById("newrequestbutton") as HTMLElement).style.width = "33%";


  //   // }

  // }

  hostMethod(value: any) {
    // if (value > 1500) {
    //   (document.getElementById("newrequestbutton") as HTMLElement).style.marginLeft = "90%";

    //   (document.getElementById("newrequestbutton") as HTMLElement).style.width = "10%";
    // }
    // else {
    //   (document.getElementById("newrequestbutton") as HTMLElement).style.marginLeft = "66%";

    //   (document.getElementById("newrequestbutton") as HTMLElement).style.width = "33%";
    // }
  }



  approved() {




    const v = this.CommomMerchantId;

    this.unmappMessage = "";
    this.unmappMessage = "Are you sure want to approve ?";

    const dialogRef = this.dialog.open(UnmappingRequestPopUpComponent,
      {
        width: '400px',
        autoFocus: false,


        data: { v: v, unmappMessage: this.unmappMessage }
      });

    dialogRef.afterClosed().subscribe((resposne: boolean) => {
      if (resposne) {
        this.approvedConfirmed();


      }
      else {

      }
    })



  }

  reject() {





    const v = this.CommomMerchantId;

    this.unmappMessage = "";
    this.unmappMessage = "Are you sure want to reject ?";

    const dialogRef = this.dialog.open(UnmappingRequestPopUpComponent,
      {
        width: '400px',
        autoFocus: false,


        data: { v: v, unmappMessage: this.unmappMessage }
      });

    dialogRef.afterClosed().subscribe((resposne: boolean) => {
      if (resposne) {
        this.rejectConfirmed();


      }
      else {

      }
    })




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


  iaListTouch() {
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
    if (this.iaNameselect == "") {
      this.snackBar.open("Please select IA name", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',


      });
    }
    else {

    }
  }



  approvedConfirmed() {

    this.spinnerService.show();

    this.service.unmappringApproved(this.CommomMerchantId, this.signInNavResponse.responseContent.roles[0] + " " + "/" + " " + this.signInNavResponse.responseContent.username).subscribe(Response => {

      this.spinnerService.hide();

      if (Response.result == "Failed") {

        this.snackBar.open('Can\'t approve the request raised by yourself', '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });

      }

      else {

        this.snackBar.open('Unmap request approved successfully ', '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });

        this.merchantCodeValue = "";



        if (this.selectedMerchantIdvalue == null || this.selectedMerchantIdvalue == "") {

          // 4 filters
          this.spinnerService.show();
          this.service.merchantDetailsReport1(this.stateobject).subscribe(response => {



            this.spinnerService.hide();
            this.merchatDetailsReportlist = response;

            if (response.result.length == 0) {

              this.pagination1 = false;
              this.table1 = false;

              this.table2 = false;

              this.unmaprequest = false;

              this.unmaprequest = false;
              this.dataSource.data = [];

              this.dataSource2.data = [];

            }
            else {



              if (this.merchatDetailsReportlist.result[0].serialId == "") {

                this.dataSource2.data = [];
                this.pagination1 = false;
                this.table1 = false;
                this.dataSource.data = [];

                this.unmaprequest = false;
                this.table2 = false;




              }

              else {


                this.pagination1 = true;
                this.table1 = true;

                this.merchantTableReport = this.merchatDetailsReportlist.result;

                this.dataSource2.data = this.merchantTableReport;
                for (let i = 0; i < this.merchantTableReport.length; i++) {

                  this.serialId = this.merchantTableReport[i].serialId;
                }

                this.unmappingStatus();

              }


            }



          })
        }
        else {

          // only using merchant code 


          if (this.merchantCodeValueForm.valid) {


            this.spinnerService.show();
            this.service.merchantDetailsReport(this.selectedMerchantIdvalue).subscribe(response => {



              this.spinnerService.hide();

              this.merchatDetailsReportlist = response;

              if (response.message == "Already Unmapped") {
                this.pagination1 = false;
                this.table1 = false;

                this.unmaprequest = false;


                this.dataSource.data = [];
                // this.merchantCodeValue = "";
                this.dataSource2.data = [];

                this.pagination2 = false;
                this.table2 = false;

              }
              else {


                this.pagination1 = true;
                this.table1 = true;


                //this.unmaprequest=true;

                // this.snackBar.open('Data fetched successfully','' ,
                // {
                // horizontalPosition:'center',
                // verticalPosition:'top',
                // duration: 3000,
                // panelClass: 'center',


                // });


                this.merchantTableReport = this.merchatDetailsReportlist.result;

                for (let i = 0; i < this.merchantTableReport.length; i++) {

                  this.serialId = this.merchantTableReport[i].serialId;
                }



                this.dataSource2.data = this.merchantTableReport;

                this.unmappingStatus();

              }



            })

          }


        }



      }


    })
  }


  rejectConfirmed() {
    this.service.unmappringRejected(this.CommomMerchantId, this.signInNavResponse.responseContent.roles[0] + " " + "/" + " " + this.signInNavResponse.responseContent.username).subscribe(Response => {
      if (Response.message == "Request Rejected") {


        this.snackBar.open('Can\'t reject the request raised by yourself', '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });

      }

      else {

        this.snackBar.open('Unmap request rejected successfully', '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });

        this.merchantCodeValue = "";

        if (this.selectedMerchantIdvalue == null || this.selectedMerchantIdvalue == "") {

          // 4 filters
          this.spinnerService.show();
          this.service.merchantDetailsReport1(this.stateobject).subscribe(response => {



            this.spinnerService.hide();
            this.merchatDetailsReportlist = response;

            if (response.result.length == 0) {

              this.pagination1 = false;
              this.table1 = false;
              this.table2 = false;
              this.unmaprequest = false;
              this.dataSource.data = [];

              this.dataSource2.data = [];

            }
            else {



              if (this.merchatDetailsReportlist.result[0].serialId == "") {


                this.pagination1 = false;
                this.table1 = false;
                this.table2 = false;
                this.unmaprequest = false;

                this.dataSource.data = [];
                this.dataSource2.data = [];


              }

              else {


                this.pagination1 = true;
                this.table1 = true;
                this.merchantTableReport = this.merchatDetailsReportlist.result;

                this.dataSource2.data = this.merchantTableReport;
                for (let i = 0; i < this.merchantTableReport.length; i++) {

                  this.serialId = this.merchantTableReport[i].serialId;
                }

                this.unmappingStatus();

              }










            }



          })
        }
        else {

          // only using merchant code 


          if (this.merchantCodeValueForm.valid) {


            this.spinnerService.show();
            this.service.merchantDetailsReport(this.selectedMerchantIdvalue).subscribe(response => {



              this.spinnerService.hide();

              this.merchatDetailsReportlist = response;

              if (response.message == "Already Unmapped") {
                this.pagination1 = false;
                this.table1 = false;

                this.unmaprequest = false;


                this.dataSource.data = [];
                // this.merchantCodeValue = "";
                this.dataSource2.data = [];

                this.pagination2 = false;
                this.table2 = false;

              }
              else {


                this.pagination1 = true;
                this.table1 = true;



                this.merchantTableReport = this.merchatDetailsReportlist.result;

                for (let i = 0; i < this.merchantTableReport.length; i++) {

                  this.serialId = this.merchantTableReport[i].serialId;
                }



                this.dataSource2.data = this.merchantTableReport;

                this.unmappingStatus();

              }



            })

          }


        }



      }


    })

  }

}
