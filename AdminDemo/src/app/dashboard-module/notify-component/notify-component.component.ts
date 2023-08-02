import { Component, OnInit,Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { data } from 'jquery';
import { ServicesService } from 'src/app/services.service';
import { StatedetailsResult } from 'src/app/statedetails-result';
import { FTBeneficiaryDetailsDTO } from './FTBeneficiaryDetailsDTO'; 
import { NotifyResponse } from './NotifyResponse'; 
import { ResponseBene } from './ResponseBene'; 
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { StatusUpdateRequest } from './StatusUpdateRequest'; 
import { Route, Router } from '@angular/router';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';
import { EncryptionDTO } from 'src/app/encryption-dto';

@Component({
  selector: 'app-notify-component',
  templateUrl: './notify-component.component.html',
  styleUrls: ['./notify-component.component.scss']
})
export class NotifyComponentComponent implements OnInit {

  


userid:any;


addressValue:any;

debitAccountNoValue:any;

beneficiaryAccountNoValue:any;

beneficiaryIFSCValue:any;

beneficiaryNameValue:any;

maxLimitValue:any;

statusValue:any;

transferTypeValue:any;

bankNameValue:any;

branchNameValue:any;

shortNameValue:any;



encryptDTO : EncryptionDTO = new EncryptionDTO();



    
  signInNavResponse: SignInNavResponse = new SignInNavResponse();
   

  request : StatusUpdateRequest = new  StatusUpdateRequest();

  

  responseBene:ResponseBene = new ResponseBene();
  

  

 

   

  constructor(private service : ServicesService,private snackBar:MatSnackBar, private route:Router,
    public dialogRef: MatDialogRef<NotifyComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 

   
  }

  // dataSource = new MatTableDataSource<FTBeneficiaryDetailsDTO>();

  
  // displayedColumns: string[] = ['address', 'debitAccountNo', 'beneficiaryAccountNo', 'beneficiaryIFSC', 'beneficiaryName', 'maxlimit', 'status'];

  ngOnInit() {


    var userId = localStorage.getItem('userId');

    this.userid=userId;
    

    this.service.beneficiaryDetailsFetch(userId).subscribe(data=>{
     
      this.responseBene = data;

      

      // this.addressValue = this.responseBene.responseContent.addressLine;
      // this.debitAccountNoValue = this.responseBene.responseContent.debitAccountNumber;
      // this.beneficiaryAccountNoValue = this.responseBene.responseContent.beneficiaryAccountNumber;
      // this.beneficiaryIFSCValue = this.responseBene.responseContent.beneficiaryIFSC;
      // this.beneficiaryNameValue = this.responseBene.responseContent.beneficiaryName;
      // this.maxLimitValue = this.responseBene.responseContent.maxLimit;
      // this.statusValue = this.responseBene.responseContent.beneficiaryStatus;
      // this.transferTypeValue = this.responseBene.responseContent.transferType;
      // this.bankNameValue = this.responseBene.responseContent.bankName;
      // this.branchNameValue = this.responseBene.responseContent.branchName;
      // this.shortNameValue = this.responseBene.responseContent.shortName;



     
     

      

     
this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');
   


    }
      )
  }

  approve()

  {





this.request.approvedBy = this.signInNavResponse.responseContent.username;
this.request.status = "Approved";
this.request.modifiedBy = this.signInNavResponse.responseContent.id;
this.request.userId=this.userid;
//this.request.beneficiaryAccountNumber =this.responseBene.responseContent.beneficiaryAccountNumber;



    this.service.statusUpdate(this.encryptDTO).subscribe(data=>
      {
       

        if(data.statusCode == 200)
        {
          this.snackBar.open(data.message, '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',


            });
            this.reloadCurrentRoute();
            this.dialogRef.close();
            

        }
        else {

          this.snackBar.open(data.message, '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',


            });
            this.reloadCurrentRoute();
            this.dialogRef.close();

        }
      })

    
  }

  reject() {

   

    this.request.approvedBy = this.signInNavResponse.responseContent.username;
this.request.status = "Rejected";
this.request.modifiedBy = this.signInNavResponse.responseContent.id;
this.request.userId=this.userid;
//this.request.beneficiaryAccountNumber =this.responseBene.responseContent.beneficiaryAccountNumber;

    this.service.statusUpdate(this.encryptDTO).subscribe(data=>{
      
      if(data.statusCode == 200)
        {
          this.snackBar.open(data.message, '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',


            });
            this.reloadCurrentRoute();
            this.dialogRef.close();

        }
        else {

          this.snackBar.open(data.message, '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',


            });
            this.reloadCurrentRoute();
            this.dialogRef.close();

        }

    })
  
  }



  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

}
