import { Component, OnInit, AfterViewInit, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { combineLatest, flatMap } from 'rxjs';
import { ServicesService } from 'src/app/services.service';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';
import { State } from 'src/app/state-details';
import { StatedetailsResult } from 'src/app/statedetails-result';
import { Unmapping } from 'src/app/unmapping';
import * as $ from 'jquery';
import { MatDialog } from '@angular/material/dialog';
import { ModelchangepopupComponent } from 'src/app/modelchangepopup/modelchangepopup.component';
import { ModelChangeConfirmationPopupComponent } from '../model-change-confirmation-popup/model-change-confirmation-popup.component';
import { DatePipe } from '@angular/common';
//import { ModelChangeEditPopupComponent } from '../model-change-edit-popup/model-change-edit-popup.component';

interface Type {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-model-change',
  templateUrl: './model-change.component.html',
  styleUrls: ['./model-change.component.scss'],
  providers: [DatePipe]
})
export class ModelChangeComponent implements OnInit, AfterViewInit {

  @Input() item = '';


  fromDate!:any;
  toDate!:any;

  newModel!: boolean;
  pagination!: boolean;
  table1!: boolean;
  newmodel!: boolean;
  newrequest!: boolean;
  table2!: boolean;
  pagination2!: boolean;

  approved!: boolean;
  status:any;

  rejecteds!: boolean;

  unmapRequestBy:any;
unmapApprovedBy:any;

  selectedmodelname = "";

  merchantPlanType: any;


  types: Type[] = [
    { value: '0', viewValue: 'Basic' },
    { value: '1', viewValue: 'Standard' },
    { value: '2', viewValue: 'Premium' },
  ];

  typeList1: Record<any, any>[] = this.types;

  typeList2: Record<any, any>[] = this.types;



  modelname = new FormControl();

  merchantCodeValueForm = new FormControl();

  statelist: State = new State();


  stateNameSelect = "";
  districtNameSelect = "";
  iaNameSelect = "";
  merchantNameSelect = "";

  statelist1: Record<any, any>[] = this.statelist.result;
  statelist2: Record<any, any>[] = this.statelist.result;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;


  selectedIaName: any;
  modelrequired = false;

  stateselect = new FormControl();
  merchantselect = new FormControl();
  districtselect = new FormControl();
  iaselect = new FormControl();


  selectedStateNameValue = "";
  selectedDistrictNamevalue = "";
  selectedMerchantIdvalue = "";
  changedModelName = "";
  selectedMerchantIdvalue1 = "";



  staterequired!: boolean;
  districtrequired!: boolean;
  iarequired!: boolean;
  merchantrequired!: boolean;
  merchantCode = "";




  merchantselectForm = new FormControl();
  modelChangeForm = new FormControl();

  districtlist: State = new State();
  districtoflist: StatedetailsResult[] = [];

  districtlist1: Record<any, any>[] = this.districtlist.result;
  districtlist2: Record<any, any>[] = this.districtlist.result;


  merchantlist: State = new State();
  merchantoflist: StatedetailsResult[] = [];

  merchantlist1: Record<any, any>[] = this.merchantlist.result;
  merchantlist2: Record<any, any>[] = this.merchantlist.result;


  merchantTableReport: State = new State();
  merchantplanchangeRequest: State = new State();

  merchantplanchangedStatus: State = new State();

  merchantupdateplan: State = new State();


  merchantPalnStatus: StatedetailsResult[] = [];

  merchanttable: StatedetailsResult[] = [];


  ialist: State = new State();
  iaoflist: StatedetailsResult[] = [];

  ialist1: Record<any, any>[] = this.ialist.result;
  ialist2: Record<any, any>[] = this.ialist.result;
  signInNavResponse: SignInNavResponse = new SignInNavResponse();

  constructor(private datePipe: DatePipe,private service: ServicesService,private cdref: ChangeDetectorRef, private spinnerService: NgxSpinnerService, private snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit() {
    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');


    this.newModel = false;
    this.pagination = false;
    this.table1 = false;
    this.newmodel = false;
    this.newrequest = false;
    this.table2 = false;
    this.pagination2 = false;

    this.staterequired = false;
    this.districtrequired = false;
    this.iarequired = false;
    this.merchantrequired = false;
    this.stateSelection();
    this.approved = true;
    this.rejecteds = true;



  }

  dataSource = new MatTableDataSource<StatedetailsResult>(this.merchantPalnStatus);
  dataSource1 = new MatTableDataSource<StatedetailsResult>(this.merchanttable);

  displayedColumns: string[] = ['state', 'district', 'currentModel', 'newModel',
    'requestedBy','requestedDate','updatedBy','updatedDate', 'Status', 'actions'];
  displayedColumns1: string[] = [ 'state_Name','district_Name','name_of_SHPI','MerchantCode', 'MerchantName', 'CurrentModel'];

  @ViewChild('firstTableSort')
  public firstTableSort!: MatSort;
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
      this.dataSource1.paginator = pager;
      this.dataSource1.paginator._intl = new MatPaginatorIntl()
      this.dataSource1.paginator._intl.itemsPerPageLabel = "";
      this.dataSource1.paginator.selectConfig.disableOptionCentering = true;

    }
  }

  hideRequiredMarker = true;

  unmap: Unmapping = new Unmapping();

  ngAfterViewInit() {
    this.dataSource.sort = this.secondTableSort;
    this.dataSource1.sort = this.firstTableSort;
  }


  passwordChange() {
    if(this.merchantCodeValueForm.hasError('pattern')){
      return  'Enter valid merchant code';
    }
    return this.merchantCodeValueForm.hasError('minlength') ? 'Should have minimum 9 characters' : '';

  }



  toggleDisplay() {
    // this.isShow=true;

  }

  stateSelection() {
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
        this.statelist2 = this.statelist.result;
      }




    })
  }

  stateSelected(stateName: string) {


    this.stateNameSelect = stateName;
    this.districtNameSelect = "";
    this.iaNameSelect = "";
    this.merchantNameSelect = "";


    this.staterequired = false;
    this.merchantCode = "";
    this.selectedDistrictNamevalue = "";
    this.selectedIaName = "";
    this.selectedMerchantIdvalue1 = "";

    this.merchantselect.reset();
    this.pagination = false;
    this.table1 = false;
    this.dataSource1.data = [];
    this.newmodel = false;
    this.newrequest = false;
    this.pagination2 = false;
    this.table2 = false;
    this.dataSource.data = [];

    this.districtlist.result = []
    this.ialist.result = [];
    this.selectedStateNameValue = stateName;
    this.merchantlist.result = [];
    this.iaselect.reset();

    this.service.districtNameFetch(stateName).subscribe(districtNameList => {

      if (districtNameList.result.length == 0) {

        this.snackBar.open('District not found', '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });
      }



      else {

        this.districtlist = districtNameList;
        this.districtlist1 = this.districtlist.result;
        this.districtlist2 = this.districtlist.result;
        this.districtoflist = this.districtlist.result;

      }






    })
  }
  letterOnly(event: any) {
    event.target.maxLength=30;

    var charCode = event.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)

      return true;
    else
      return false;
  }

  districtSelected(districName: string) {
    this.districtrequired = false;


    this.districtNameSelect = districName;
    this.iaNameSelect = "";
    this.merchantNameSelect = "";

    this.iaselect.reset();
    this.merchantselect.reset();
    this.merchantlist.result = [];
    this.selectedDistrictNamevalue = districName;

    this.ialist.result = [];
    this.selectedIaName = "";
    this.selectedMerchantIdvalue = "";
    this.pagination = false;
    this.table1 = false;
    this.dataSource1.data = [];
    this.newmodel = false;
    this.newrequest = false;
    this.pagination2 = false;
    this.table2 = false;
    this.dataSource.data = [];


    this.service.getIaNameList(this.selectedStateNameValue, districName).subscribe(ialistResponse => {






      if (ialistResponse.result.length == 0) {


        this.snackBar.open('IA name not found', '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });
      }
      else {

        this.ialist = ialistResponse;
        this.ialist1 = this.ialist.result;
        this.ialist2 = this.ialist.result;
        this.iaoflist = this.ialist.result;
      }

    })
  }


  iaselected(iaId: any) {

    this.iaNameSelect = iaId;
    this.merchantNameSelect = "";


    this.iarequired = false;
    this.selectedIaName = iaId;
    this.selectedMerchantIdvalue1 = "";
    this.pagination = false;
    this.table1 = false;
    this.dataSource1.data = [];
    this.newmodel = false;
    this.newrequest = false;
    this.pagination2 = false;
    this.table2 = false;
    this.dataSource.data = [];
    // this.unmap.merchant="";
    this.merchantselect.reset();

    this.merchantlist1 = [];
    this.merchantlist2 = [];




    this.service.merchantDetails(iaId).subscribe(merchantResponse => {

      if (merchantResponse.result.length == 0) {

        this.snackBar.open('Merchant name not found', '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });

      }
      else {

        this.merchantlist = merchantResponse;
        this.merchantlist1 = this.merchantlist.result;
        this.merchantlist2 = this.merchantlist.result;
        this.merchantoflist = this.merchantlist.result;
      }
    })
  }



  selectedmerchant(merchantId: string) {
    this.pagination = false;
    this.table1 = false;
    this.dataSource1.data = [];
    this.newmodel = false;
    this.newrequest = false;
    this.pagination2 = false;
    this.table2 = false;
    this.dataSource.data = [];

    this.merchantrequired = false;
    this.selectedMerchantIdvalue1 = merchantId;


  }

  merchantIdEnter(merchantCode: string) {


    // this.staterequired=false;
    // this.districtrequired=false;
    // this.iarequired=false;
    // this.merchantrequired=false;


    this.pagination = false;
    this.table1 = false;
    this.dataSource1.data = [];
    this.newmodel = false;
    this.newrequest = false;
    this.pagination2 = false;
    this.table2 = false;
    this.dataSource.data = [];

    this.stateselect.reset();
    this.districtselect.reset();
    this.iaselect.reset();
    this.merchantselect.reset();
    this.selectedStateNameValue = "";
    this.selectedDistrictNamevalue = "";
    this.selectedIaName = "";
    this.staterequired = false;
    this.districtrequired = false;
    this.iarequired = false;
    this.merchantrequired = false;

    // this.selectedMerchantIdvalue1="";

    this.selectedMerchantIdvalue1 = merchantCode;


  }

  submit() {




    if (this.selectedMerchantIdvalue1 == null || this.selectedMerchantIdvalue1 == "") {



      if ((this.selectedStateNameValue == "" || this.selectedStateNameValue == null) && (this.selectedDistrictNamevalue == null || this.selectedDistrictNamevalue == "") && (this.selectedIaName == null || this.selectedIaName == "") && (this.selectedMerchantIdvalue1 == null || this.selectedMerchantIdvalue1 == "")) {
        this.unmap.state = "";

        this.staterequired = true;
        this.districtrequired = true;
        this.iarequired = true;
        this.merchantrequired = true;



      }

      else {

        if (this.selectedStateNameValue == null || this.selectedStateNameValue == "") {

          this.staterequired = true;
          this.districtrequired = true;
          this.iarequired = true;
          this.merchantrequired = true;


        }

        else if (this.selectedDistrictNamevalue == null || this.selectedDistrictNamevalue == "") {

          this.districtrequired = true;
          this.iarequired = true;
          this.merchantrequired = true;
          this.unmap.district = "";
        }

        else if (this.selectedIaName == "" || this.selectedIaName == null) {

          this.iarequired = true;
          this.merchantrequired = true;
          this.unmap.ia = "";

        }
        else if (this.selectedMerchantIdvalue1 == "" || this.selectedMerchantIdvalue1 == null) {

          this.merchantrequired = true;
          this.unmap.merchant = "";
        }

        else {


          this.service.merchantPlan1(this.unmap).subscribe(merchantTableReport => {


            this.spinnerService.hide();

            if (merchantTableReport.result.length == 0) {

              this.snackBar.open('Record not found', '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',


                });

              this.newmodel = false;
              this.changedModelName = "";
              this.newModel = false;
              this.pagination = false;
              this.table1 = false;

              this.newrequest = false;
              this.newmodel = false;
            }
            else {

              this.newModel = true;
              // this.pagination=true;
              this.table1 = true;

              // this.newrequest = true;
              this.newmodel = false;
              this.changedModelName = "";
              // this.snackBar.open('Data fetched successfully', '',
              //   {
              //     horizontalPosition: 'center',
              //     verticalPosition: 'top',
              //     duration: 3000,
              //     panelClass: 'center',


              //   });

            }



            this.merchantTableReport = merchantTableReport;
            this.merchanttable = this.merchantTableReport.result;
            this.merchanttable.forEach(element => {
              this.merchantPlanType = element.plan_Type;
            });
            this.dataSource1.data = this.merchanttable;
            //this.requestStatusReport(this.selectedMerchantIdvalue , this.merchanttable);
            this.spinnerService.show();
            this.service.merchantPlanRequestStatus(this.selectedMerchantIdvalue1).subscribe(statusResponse => {

              this.spinnerService.hide();


              this.merchantplanchangedStatus = statusResponse;
              this.merchantPalnStatus = this.merchantplanchangedStatus.result;


              const userId=this.signInNavResponse.responseContent.id.toString();


      
      if (this.merchantplanchangedStatus.result.length == 0)
      {

      }
      else{

      
      if(userId ==this.merchantplanchangedStatus.result[0].requestedBy)
      {

        // same user 
        this.unmapRequestBy=this.signInNavResponse.responseContent.roles[0]+" / "+this.signInNavResponse.responseContent.username;
      }
      else{
        // another user 

        this.unmapRequestBy = this.merchantplanchangedStatus.result[0].requestedBy;
      }

      if(userId == this.merchantplanchangedStatus.result[0].updatedBy)
      {
        // same user 
        this.unmapApprovedBy = this.merchantplanchangedStatus.result[0].updatedBy;
      }
      else{

        this.unmapApprovedBy =this.merchantplanchangedStatus.result[0].updatedBy;
      }

    }

    
    if(this.merchantplanchangedStatus.result[0].requestedDate == "-")
    {

    }
    else{
      // this.merchantplanchangedStatus.result.forEach(dte => {
      //   var dat = dte.requestedDate;
        
      //   let myDate1 = dat.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
      //   this.fromDate = this.datePipe.transform(myDate1, 'dd/MM/yyyy hh:mm:ss a', 'es-ES');
      //   dte.requestedDate = this.fromDate;

        
      // })


    }

    if(this.merchantplanchangedStatus.result[0].updatedDate == "-")
    {

    }
    else{
      // this.merchantplanchangedStatus.result.forEach(dte => {
      //   var updateDate = dte.updatedDate;
        
      //   let myDate = updateDate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
      //   this.toDate = this.datePipe.transform(myDate, 'dd/MM/yyyy hh:mm:ss a', 'es-ES');
      //   dte.updatedDate = this.toDate;


      // })

    }


              if (statusResponse.result.length == null) {


                
                this.table2 = true;
                this.newrequest = true;

              } else if (this.merchantPalnStatus[0].status == 'Pending') {
                this.approved = true;
                this.rejecteds = true;
                this.pagination2 = true;
                this.table2 = true;
                this.newrequest = false;
                this.dataSource.data = this.merchantPalnStatus;
              }
              else if (this.merchantPalnStatus[0].status == "Rejected") {
                this.approved = false;
                this.rejecteds = false;
                this.pagination2 = true;
                this.table2 = true;
                this.dataSource.data = this.merchantPalnStatus;

              }
              else if (this.merchantPalnStatus[0].status == "Approved") {

                this.approved = false;
                this.rejecteds = false;
                this.pagination2 = true;
                this.table2 = true;
                this.newrequest = true;
                this.dataSource.data = this.merchantPalnStatus;
              }
              else {

                // this.pagination2=true;
                this.table2 = true;

                // this.snackBar.open('Status report fetch success', '',
                //   {
                //     horizontalPosition: 'center',
                //     verticalPosition: 'top',
                //     duration: 3000,
                //     panelClass: 'center',



                //   });

                this.dataSource.data = this.merchantPalnStatus;
              }





            })

          })

          // all value ok 

        }


      }

    }

    else {


      //  merchant code ok 
      if (this.merchantCodeValueForm.valid) {
        this.spinnerService.show();

       

        this.service.merchantPlan(this.selectedMerchantIdvalue1).subscribe(merchantTableReport => {


          this.spinnerService.hide();

         

          if (merchantTableReport.result.length == 0) {
            // failed
            this.snackBar.open('Record not found', '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',


              });
            this.newmodel = false;
            this.changedModelName = "";
            this.newmodel = false;
            this.changedModelName = "";
            this.newModel = false;
            this.pagination = false;
            this.table1 = false;

            this.newrequest = false;
            this.newmodel = false;
          }

          else {


            this.newModel = true;
            // this.pagination=true;
            this.table1 = true;

            // this.newrequest = true;

            this.newmodel = false;
            this.changedModelName = "";


            // this.snackBar.open('Data fetched successfully', '',
            //   {
            //     horizontalPosition: 'center',
            //     verticalPosition: 'top',
            //     duration: 3000,
            //     panelClass: 'center',


            //   });

            this.spinnerService.show();
            this.service.merchantPlanRequestStatus(this.selectedMerchantIdvalue1).subscribe(statusResponse => {

              this.spinnerService.hide();


              this.merchantplanchangedStatus = statusResponse;
              this.merchantPalnStatus = this.merchantplanchangedStatus.result;


              const userId=this.signInNavResponse.responseContent.id.toString();


      
      if (this.merchantplanchangedStatus.result.length == 0)
      {

      }
      else{

      
      if(userId ==this.merchantplanchangedStatus.result[0].requestedBy)
      {

        // same user 
        this.unmapRequestBy=this.signInNavResponse.responseContent.roles[0]+" / "+this.signInNavResponse.responseContent.username;
      }
      else{
        // another user 

        this.unmapRequestBy = this.merchantplanchangedStatus.result[0].requestedBy;
      }

      if(userId == this.merchantplanchangedStatus.result[0].updatedBy)
      {
        // same user 
        this.unmapApprovedBy = this.merchantplanchangedStatus.result[0].updatedBy;
      }
      else{

        this.unmapApprovedBy =this.merchantplanchangedStatus.result[0].updatedBy;
      }

    }


              if (statusResponse.result.length == 0) {
                this.table2 = false;
                this.pagination2 = false;
                this.newrequest=true;
               


              } else if (this.merchantPalnStatus[0].status == 'Pending') {

                this.approved = true;
                this.rejecteds = true;
                this.pagination2 = true;
                this.table2 = true;
                this.newrequest = false;
                this.dataSource.data = this.merchantPalnStatus;
              }
              else if (this.merchantPalnStatus[0].status == "Rejected") {

                this.approved = false;
                this.rejecteds = false;
                this.pagination2 = true;
                this.table2 = true;
                this.newrequest = true;
                this.dataSource.data = this.merchantPalnStatus;

              }
              else if (this.merchantPalnStatus[0].status == "Approved") {

                this.approved = false;
                this.rejecteds = false;
                this.pagination2 = true;
                this.table2 = true;
                this.newrequest = true;
                this.dataSource.data = this.merchantPalnStatus;
              }
              else {

                // this.pagination2=true;
                this.table2 = true;

                // this.snackBar.open('Status report fetch success', '',
                //   {
                //     horizontalPosition: 'center',
                //     verticalPosition: 'top',
                //     duration: 3000,
                //     panelClass: 'center',



                //   });

                this.dataSource.data = this.merchantPalnStatus;
              }





            })
          }



          this.merchantTableReport = merchantTableReport;
          this.merchanttable = this.merchantTableReport.result;
      
          this.dataSource1.data = this.merchanttable;

          this.merchanttable.forEach(element => {
            this.merchantPlanType = element.plan_Type;
          });
          //this.requestStatusReport(this.selectedMerchantIdvalue , this.merchanttable);
        })
      }


    }





    //    if (this.selectedMerchantIdvalue == null || this.selectedMerchantIdvalue =="")
    //    {
    //     // dont call 


    //    }

    //    else{
    //      // call ok 

    //      this.spinnerService.show();
    //      this.service.merchantPlan(this.selectedMerchantIdvalue).subscribe(merchantTableReport=>
    //       {
    //         this.spinnerService.hide();

    //         this.snackBar.open('Merchant Record Fetch Successfully','' ,
    //         {
    //         horizontalPosition:'center',
    //         verticalPosition:'top',
    //         duration: 3000,
    //         panelClass: 'center',


    //         });

    //   this.merchantTableReport = merchantTableReport;
    // this.merchanttable=this.merchantTableReport.result;
    // this.dataSource1.data=this.merchanttable;
    //  //this.requestStatusReport(this.selectedMerchantIdvalue , this.merchanttable);
    // })
    // }
    // }



    // else{
    //   //call ok

    //   this.spinnerService.show();
    //   this.service.merchantPlan(this.unmap.merchantcode).subscribe(merchantTableReport=>
    //     {


    //       this.spinnerService.hide();

    //  if(merchantTableReport.result.length == 0)
    //  {

    //   this.snackBar.open('Merchant Record Not Found','' ,
    //   {
    //   horizontalPosition:'center',
    //   verticalPosition:'top',
    //   duration: 3000,
    //   panelClass: 'center',


    //   });

    //  }

    //  else{


    //   this.snackBar.open('Merchant Record Fetch Successfully','' ,
    //   {
    //   horizontalPosition:'center',
    //   verticalPosition:'top',
    //   duration: 3000,
    //   panelClass: 'center',


    //   });
    //  this.merchantTableReport = merchantTableReport;
    //  this.merchanttable=this.merchantTableReport.result;
    //  this.dataSource1.data=this.merchanttable;

    //  }





    // this.requestStatusReport(this.selectedMerchantIdvalue , this.merchanttable);
    // })
    // }



    //     }




    // requestStatusReport(merchantid:string,merchantreport:any)
    // {


    //   // this.selectedMerchantIdvalue ="AE33000003";
    //   this.service.merchantPlanRequestStatus(merchantid).subscribe(requestStatus=>
    //     {

    //       this.dataSource1.data=merchantreport;

    // this.merchantTableRequestStatus=requestStatus;

    // this.merchanttable1 = this.merchantTableRequestStatus.result;


    //  this.dataSource.data = this.merchanttable1;

    //     })







    // }

  }


  changeModel(modelName: string) {
    this.changedModelName = modelName;
    this.unmap.changeModel = "";

  }


  changeModelRequest() {


    if (this.changedModelName == "" || this.changedModelName == null) {
      this.modelrequired = true;
      this.unmap.changeModel = "";

    }

    else {

      this.spinnerService.show();
      this.service.modelChangeRequest(this.merchanttable[0].merchantID, this.changedModelName, this.signInNavResponse.responseContent.id).subscribe(changedModelResponse => {
        this.spinnerService.hide();

        this.merchantplanchangeRequest = changedModelResponse;

        if (this.merchantplanchangeRequest.message == "Success") {

          this.snackBar.open('Request sent successfully', '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',


            });
          // call status 
          this.spinnerService.show();
          this.service.merchantPlanRequestStatus(this.merchanttable[0].merchantID).subscribe(statusResponse => {

            this.spinnerService.hide();


            this.merchantplanchangedStatus = statusResponse;
            this.merchantPalnStatus = this.merchantplanchangedStatus.result;

            const userId=this.signInNavResponse.responseContent.id.toString();


      
      if (this.merchantplanchangedStatus.result.length == 0)
      {

      }
      else{

      
      if(userId ==this.merchantplanchangedStatus.result[0].requestedBy)
      {

        // same user 
        this.unmapRequestBy=this.signInNavResponse.responseContent.roles[0]+" / "+this.signInNavResponse.responseContent.username;
      }
      else{
        // another user 

        this.unmapRequestBy = this.merchantplanchangedStatus.result[0].requestedBy;
      }

      if(userId == this.merchantplanchangedStatus.result[0].updatedBy)
      {
        // same user 
        this.unmapApprovedBy = this.merchantplanchangedStatus.result[0].updatedBy;
      }
      else{

        this.unmapApprovedBy =this.merchantplanchangedStatus.result[0].updatedBy;
      }

    }

            if (statusResponse.result.length == 0) {

              // this.snackBar.open('Status report not found', '',
              //   {
              //     horizontalPosition: 'center',
              //     verticalPosition: 'top',
              //     duration: 3000,
              //     panelClass: 'center',


              //   });
              this.newrequest = true;

            }
            else if (this.merchantPalnStatus[0].status == 'Pending') {

              this.approved = true;
              this.rejecteds = true;
              this.pagination2 = true;
              this.table2 = true;
              this.newrequest = false;
              this.dataSource.data = this.merchantPalnStatus;

            }
            else {

              this.pagination2 = true;
              this.table2 = true;

              // this.snackBar.open('Data fetched successfully', '',
              //   {
              //     horizontalPosition: 'center',
              //     verticalPosition: 'top',
              //     duration: 3000,
              //     panelClass: 'center',



              //   });

              this.dataSource.data = this.merchantPalnStatus;
            }





          })
        }
        else if (this.merchantplanchangeRequest.message == "Failed!") {

          // dont call 

          this.snackBar.open('You have already requested', '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',



            });
        }



      })

    }

  }


  Approved() {


    this.status='True';
   const dialogBox = this.dialog.open(ModelChangeConfirmationPopupComponent, {
      width: '400px',
      autoFocus: false,
             data: {
               message: 'Are you sure want to approve ?',
               statusValue : this.status,
               merchantId : this.selectedMerchantIdvalue1,
               unmapValue : this.unmap,modelChangeValue:this.merchanttable
               
             }    
    })
    dialogBox.afterClosed().subscribe(
      data => {
       
        this.firstTable();
      }) 



  }

  rejected() {
   
    this.status='false';
    const dialogBox = this.dialog.open(ModelChangeConfirmationPopupComponent, {
       width: '400px',
              data: {
                message: 'Are you sure want to reject ?',
                statusValue: this.status,
                merchantId : this.selectedMerchantIdvalue1,
                unmapValue : this.unmap,modelChangeValue:this.merchanttable,
                autoFocus: false 
              }
     })
     dialogBox.afterClosed().subscribe(
       data => {
         this.firstTable();
    })
  }

 

  statusCall()
  {


    this.service.merchantPlanRequestStatus(this.merchanttable[0].merchantID).subscribe(statusResponse => {

      this.spinnerService.hide();

      


      this.merchantplanchangedStatus = statusResponse;
      this.merchantPalnStatus = this.merchantplanchangedStatus.result;

      const userId=this.signInNavResponse.responseContent.id.toString();


      
      if (this.merchantplanchangedStatus.result.length == 0)
      {

      }
      else{

      
      if(userId ==this.merchantplanchangedStatus.result[0].requestedBy)
      {

        // same user 
        this.unmapRequestBy=this.signInNavResponse.responseContent.roles[0]+" / "+this.signInNavResponse.responseContent.username;
      }
      else{
        // another user 

        this.unmapRequestBy = this.merchantplanchangedStatus.result[0].requestedBy;
      }

      if(userId == this.merchantplanchangedStatus.result[0].updatedBy)
      {
        // same user 
        this.unmapApprovedBy = this.merchantplanchangedStatus.result[0].updatedBy;
      }
      else{

        this.unmapApprovedBy =this.merchantplanchangedStatus.result[0].updatedBy;
      }

    }

      if (statusResponse.result.length == 0) {
        // this.snackBar.open('Status report not found', '',
        //   {
        //     horizontalPosition: 'center',
        //     verticalPosition: 'top',
        //     duration: 3000,
        //     panelClass: 'center',


        //   });
        this.newrequest = true;

      }
      else if (this.merchantPalnStatus[0].status == 'Pending') {

        this.approved = true;
        this.rejecteds = true;
        this.pagination2 = true;
        this.table2 = true;
        this.newrequest = false;
        this.dataSource.data = this.merchantPalnStatus;

      }
      else {

        this.pagination2 = true;
        this.table2 = true;

        // this.snackBar.open('Data fetched successfully', '',
        //   {
        //     horizontalPosition: 'center',
        //     verticalPosition: 'top',
        //     duration: 3000,
        //     panelClass: 'center',



        //   });

        this.dataSource.data = this.merchantPalnStatus;
      }





    })
  }
  ngAfterContentChecked() {
    
    this.cdref.detectChanges();
 }
  newRequest(CurrentModel: string) {

    this.newmodel = true;
    const dialogRefer = this.dialog.open(ModelchangepopupComponent, {
      width: '350px',
      height: '268px',
      //panelClass: "dialog-responsive",
      data: { CurrentModel: CurrentModel,userinfo:this.merchanttable},
      autoFocus: false 

    })
    dialogRefer.afterClosed().subscribe(response => {
      this.statusCall();
    })

  }
  districtTouch() {
    if (this.stateNameSelect == "") {
      this.snackBar.open('Please select state', '',
        {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'center',


        });

    }
  }

  iaTouch() {
    if (this.districtNameSelect == "") {
      this.snackBar.open('Please select district', '',
        {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'center',


        });

    }
  }
  merchantTouch() {
    if (this.iaNameSelect == "") {
      this.snackBar.open('Please select IA name', '',
        {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'center',


        });

    }




  }

  firstTable()
  {
    
    this.service.merchantPlan(this.selectedMerchantIdvalue1).subscribe(merchantTableReport => {
      this.spinnerService.hide();
      if (merchantTableReport.result.length == 0) {
        this.newmodel = false;
        this.changedModelName = "";
        this.newModel = false;
        this.pagination = false;
        this.table1 = false;
        this.newrequest = false;
        this.newmodel = false;
      }
      else {
        this.newModel = true;
        this.table1 = true;
        this.newmodel = false;
        this.changedModelName = "";
      }
      this.merchantTableReport = merchantTableReport;
      this.merchanttable = this.merchantTableReport.result;
      this.merchanttable.forEach(element => {
      this.merchantPlanType = element.plan_Type;
      });
      this.dataSource1.data = this.merchanttable;
      // this.spinnerService.show();
      
      this.service.merchantPlanRequestStatus(this.selectedMerchantIdvalue1).subscribe(statusResponse => {
      // this.spinnerService.hide();
      this.merchantplanchangedStatus = statusResponse;
      this.merchantPalnStatus = this.merchantplanchangedStatus.result;

      const userId=this.signInNavResponse.responseContent.id.toString();


      
      if (this.merchantplanchangedStatus.result.length == 0)
      {

      }
      else{

      
      if(userId ==this.merchantplanchangedStatus.result[0].requestedBy)
      {

        // same user 
        this.unmapRequestBy=this.signInNavResponse.responseContent.roles[0]+" / "+this.signInNavResponse.responseContent.username;
      }
      else{
        // another user 

        this.unmapRequestBy = this.merchantplanchangedStatus.result[0].requestedBy;
      }

      if(userId == this.merchantplanchangedStatus.result[0].updatedBy)
      {
        // same user 
        this.unmapApprovedBy = this.merchantplanchangedStatus.result[0].updatedBy;
      }
      else{

        this.unmapApprovedBy =this.merchantplanchangedStatus.result[0].updatedBy;
      }

    }

    
    
        if (statusResponse.result.length == null) {
          this.table2 = true;
          this.newrequest = true;
        } else if (this.merchantPalnStatus[0].status == 'Pending') {
          this.approved = true;
          this.rejecteds = true;
          this.pagination2 = true;
          this.table2 = true;
          this.newrequest = false;
          this.dataSource.data = this.merchantPalnStatus;
        }
        else if (this.merchantPalnStatus[0].status == "Rejected") {
          this.approved = false;
          this.rejecteds = false;
          this.pagination2 = true;
          this.newrequest = true;
          this.table2 = true;
          this.dataSource.data = this.merchantPalnStatus;
        }
        else if (this.merchantPalnStatus[0].status == "Approved") {
          this.approved = false;
          this.rejecteds = false;
          this.pagination2 = true;
          this.table2 = true;
          this.newrequest = true;
          this.dataSource.data = this.merchantPalnStatus;
        }
        else {
          this.table2 = true;
          this.dataSource.data = this.merchantPalnStatus;
        }
      })
    })
}
}