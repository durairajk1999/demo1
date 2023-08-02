import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { StatedetailsResult } from '../statedetails-result';
import { MatTableDataSource } from '@angular/material/table';
import { ServicesService } from '../services.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { SignInNavResponse } from '../sign-in-nav-response';
import { State } from '../state-details';
import { FormControl } from '@angular/forms';
import { Unmapping } from '../unmapping';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Type {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-modelchangepopup',
  templateUrl: './modelchangepopup.component.html',
  styleUrls: ['./modelchangepopup.component.scss']
})
export class ModelchangepopupComponent implements OnInit {

  userId!: any;

  newModel!: boolean;
  pagination!: boolean;
  table1!: boolean;
  newmodel!: boolean;
  newrequest!: boolean;
  table2!: boolean;
  pagination2!: boolean;

  approved!: boolean;

  rejecteds!: boolean;

  selectedmodelname = "";

  merchantPlanType!: string;

  merchantplanchangeRequest: State = new State();

  changedModelName = "";

  modelrequired = false;

  unmap: Unmapping = new Unmapping();

  merchanttable: StatedetailsResult[] = [];
  merchantPalnStatus: StatedetailsResult[] = [];

  modelname = new FormControl();

  hideRequiredMarker = true;

  merchantplanchangedStatus: State = new State();

  merchantupdateplan: State = new State();

  signInNavResponse: SignInNavResponse = new SignInNavResponse();

  types: Type[] = [
    { value: '0', viewValue: 'Basic' },
    { value: '1', viewValue: 'Standard' },
    { value: '2', viewValue: 'Premium' },
  ];

  typeList1: Record<any, any>[] = this.types;

  typeList2: Record<any, any>[] = this.types;

  dataSource = new MatTableDataSource<StatedetailsResult>(this.merchantPalnStatus);
  dataSource1 = new MatTableDataSource<StatedetailsResult>(this.merchanttable);

  constructor(public dialogRef: MatDialogRef<ModelchangepopupComponent>, private cdref: ChangeDetectorRef, @Inject(MAT_DIALOG_DATA) public data: any, private service: ServicesService, private spinnerService: NgxSpinnerService, private snackBar: MatSnackBar) {

    this.planType = this.data.CurrentModel

    

    this.merchanttable = data.userinfo;
    
  }




  planType: any
  ngOnInit() {


    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');




    this.statusCall();


  }

  ngAfterContentChecked() {

    this.cdref.detectChanges();
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

      this.service.modelChangeRequest(this.merchanttable[0].merchantID, this.changedModelName, this.signInNavResponse.responseContent.roles[0] + " " + "/" + " " + this.signInNavResponse.responseContent.username).subscribe(changedModelResponse => {
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
          this.dialogRef.close();
          // call status 
          this.spinnerService.show();
          this.service.merchantPlanRequestStatus(this.merchanttable[0].merchantID).subscribe(statusResponse => {

            

            this.spinnerService.hide();
            this.merchantplanchangedStatus = statusResponse;
            this.merchantPalnStatus = this.merchantplanchangedStatus.result;





            if (statusResponse.result.length == 0) {

              this.newrequest = true;
              // this.snackBar.open('Status report not found', '',
              //   {
              //     horizontalPosition: 'center',
              //     verticalPosition: 'top',
              //     duration: 3000,
              //     panelClass: 'center',


              //   });

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
  statusCall() {

    this.service.merchantPlanRequestStatus(this.merchanttable[0].merchantID).subscribe(statusResponse => {

      this.spinnerService.hide();


      this.merchantplanchangedStatus = statusResponse;
      this.merchantPalnStatus = this.merchantplanchangedStatus.result;

      this.merchantPalnStatus.forEach(element => {
      
        this.merchantPlanType = element.newModel;

      });


      if (statusResponse.result.length == 0) {
        this.newrequest = true;

        // this.snackBar.open('Status report not found', '',
        //   {
        //     horizontalPosition: 'center',
        //     verticalPosition: 'top',
        //     duration: 3000,
        //     panelClass: 'center',


        //   });

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





}


