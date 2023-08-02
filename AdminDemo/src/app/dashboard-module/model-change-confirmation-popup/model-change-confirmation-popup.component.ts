import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServicesService } from 'src/app/services.service';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';
import { State } from 'src/app/state-details';
import { StatedetailsResult } from 'src/app/statedetails-result';

@Component({
  selector: 'app-model-change-confirmation-popup',
  templateUrl: './model-change-confirmation-popup.component.html',
  styleUrls: ['./model-change-confirmation-popup.component.scss']
})
export class ModelChangeConfirmationPopupComponent implements OnInit {

  //boolean and any
  message:any;
  newModel!: boolean;
  pagination!: boolean;
  newrequest!: boolean;
  approved!: boolean;
  rejecteds!: boolean;
  pagination2!: boolean;
  table1!: boolean;
  table2!: boolean;
  newmodel!: boolean;
  merchantPlanType: any;
  status:any;
  unmap:any;
  

  // string 
  selectedMerchantIdvalue1 = "";
  changedModelName = "";

  // object cration 
  signInNavResponse: SignInNavResponse = new SignInNavResponse();
  merchantupdateplan: State = new State();
  merchanttable: StatedetailsResult[] = [];
  merchantplanchangedStatus: State = new State();
  merchantTableReport: State = new State();
  merchantPalnStatus: StatedetailsResult[] = [];

  

  // datasource table
  dataSource = new MatTableDataSource<StatedetailsResult>(this.merchantPalnStatus);
  dataSource1 = new MatTableDataSource<StatedetailsResult>(this.merchanttable);


  constructor(@Inject(MAT_DIALOG_DATA) private data: any,private service : ServicesService,private snackBar:MatSnackBar,private route:Router,private dialogRef: MatDialogRef<ModelChangeConfirmationPopupComponent>,private spinnerService: NgxSpinnerService,) { 


    
    this.merchanttable =data.modelChangeValue;

  }

  ngOnInit() {
    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');
    this.message = this.data.message;
    this.status = this.data.statusValue;
    this.unmap = this.data.unmapValue;
    this.selectedMerchantIdvalue1 = this.data.merchantId;
    
    
  }


  //Method Declaration 
  approvedAccess()
  {
    if(this.status == 'True')
    {
      this.approvedMethod();
    }
    else {

      this.rejectMethod();
    }
  }

  rejectAccess()
  {
    this.dialogRef.close();
  }


  approvedMethod()
  {
    this.service.modelchangeApproved(this.selectedMerchantIdvalue1, this.signInNavResponse.responseContent.roles[0] + " " + "/" + " " + this.signInNavResponse.responseContent.username).subscribe(approvedResponse => {

      this.merchantupdateplan = approvedResponse;

      if (approvedResponse.message == "Request Rejected") {
        this.snackBar.open('Can\'t approve the request raised by yourself', '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',
          });

          this.dialogRef.close();

      }

      else {


        this.snackBar.open('Model change request approved successfully ', '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',
          });
          this.dialogRef.close();
        this.service.merchantPlanRequestStatus(this.merchanttable[0].merchantID).subscribe(statusResponse => {

          this.spinnerService.hide();


          this.merchantplanchangedStatus = statusResponse;

          this.merchantPalnStatus = this.merchantplanchangedStatus.result;
          if (statusResponse.result.length == 0) {
            
            this.newrequest = true;

          }
          else if (this.merchantPalnStatus[0].status == 'Pending') {
            this.approved = true;
            this.rejecteds = true;
            this.pagination2 = true;
            this.table2 = true;
            this.newrequest = true;
            this.dataSource.data = this.merchantPalnStatus;
          }
          else if (this.merchantPalnStatus[0].status == 'Approved') {
            this.approved = false;
            this.rejecteds = false;
            this.pagination2 = true;
            this.table2 = true;
            this.newrequest = true;
            this.dataSource.data = this.merchantPalnStatus;

          }
          else {

            this.pagination2 = true;
            this.table2 = true;
            this.dataSource.data = this.merchantPalnStatus;
            // this.firstTable();
          }

        })
      }
    })
  }

  rejectMethod()
  {
    this.service.modelchangeRejected(this.selectedMerchantIdvalue1, this.signInNavResponse.responseContent.roles[0] + " " + "/" + " " + this.signInNavResponse.responseContent.username).subscribe(rejectedRespose => {

      if (rejectedRespose.message == "Request Rejected") {

        this.snackBar.open('Can\'t reject the request raised by yourself', '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });
          this.dialogRef.close();

      } else if (rejectedRespose.status == "True") {

        this.snackBar.open('Model change request rejected successfully', '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });

          this.dialogRef.close();

        this.service.merchantPlanRequestStatus(this.merchanttable[0].merchantID).subscribe(statusResponse => {

          this.spinnerService.hide();


          this.merchantplanchangedStatus = statusResponse;
          this.merchantPalnStatus = this.merchantplanchangedStatus.result;


          if (statusResponse.result.length == 0) {
            this.newrequest = true;
          }
          else if (this.merchantPalnStatus[0].status == 'Rejected') {
            this.approved = false;
            this.rejecteds = false;
            this.pagination2 = true;
            this.table2 = true;
            this.newrequest = true;
            this.dataSource.data = this.merchantPalnStatus;
          }
          else {

            this.pagination2 = true;
            this.table2 = true;
            this.dataSource.data = this.merchantPalnStatus;

          }

        });
      }
      else {

        this.snackBar.open(rejectedRespose.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',

          });

          this.dialogRef.close();
      }
    })
  } 
}
