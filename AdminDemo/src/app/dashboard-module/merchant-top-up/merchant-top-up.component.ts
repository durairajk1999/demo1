import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EncryptAndDecryptResponse } from 'src/app/encrypt-and-decrypt-response';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';
import { EncryptionDTO } from 'src/app/encryption-dto';
import { Iadetail } from 'src/app/iadetail';
import { ServiceType } from 'src/app/service-type';
import { ServiceTypeResponse } from 'src/app/service-type-response';
import { ServicesService } from 'src/app/services.service';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';
import { State } from 'src/app/state-details';
import { StatedetailsResult } from 'src/app/statedetails-result';
import { ViewTickets } from 'src/app/view-tickets';
import { ViewTicketsList } from 'src/app/view-tickets-list';
import { ViewTicketsTable } from 'src/app/view-tickets-table';
import { ConfirmDialogComponentComponent } from '../confirm-dialog-component/confirm-dialog-component.component';
import { PopUpComponentComponent } from '../pop-up-component/pop-up-component.component';
import { ResBody } from 'src/app/res-body';
import { MerchantpopUpViewComponent } from '../merchantpop-up-view/merchantpop-up-view.component';
import { MerchantTopUpConfirmationComponent } from '../merchant-top-up-confirmation/merchant-top-up-confirmation.component';
import { AuditRequestAndResponse } from 'src/app/audit-request-and-response';
import { Console, error } from 'console';
import { constrainedMemory } from 'process';


export interface groupWise {
  state: string,
  district: string,
  ia: string,
  merchantCode: number,
  merchantName: string,
  serviceType: number


}

@Component({
  selector: 'app-merchant-top-up',
  templateUrl: './merchant-top-up.component.html',
  styleUrls: ['./merchant-top-up.component.scss'],
  providers: [DatePipe]

})
export class MerchantTopUpComponent implements OnInit {



  ELEMENT_DATA: groupWise[] = [
    { state: '1', district: 'Anniyam Payment Solution', ia: '12345678901234', merchantCode: 1000000, serviceType: 10000000, merchantName: "gg" }

  ];
  dataSource1 = this.ELEMENT_DATA;
  dataSource = new MatTableDataSource<groupWise>(this.ELEMENT_DATA);
  amtValidate = false;
  utrValidate = false;
  merchantCodeValidate = false;
  maxLimitValue = new FormControl();
  utr = new FormControl();
  merchantCode = new FormControl();
  auditDTO: EncryptionDTO = new EncryptionDTO();
  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();
  encryptAndDecryptResposne: EncryptAndDecryptResponse = new EncryptAndDecryptResponse();
  signInNavResponse: SignInNavResponse = new SignInNavResponse();
  encryptDTO: EncryptionDTO = new EncryptionDTO();
  auditRequest: AuditRequestAndResponse = new AuditRequestAndResponse();
  viewTickets: ViewTickets = new ViewTickets();

  @ViewChild('paginator', { static: false }) set paginatorPageSize(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = " ";
    }
  }
  displayedColumns: string[] = ['state', 'district', 'ia', 'merchantCode', 'merchantName', 'serviceType'];
  hideRequiredMarker = "true"
  private sort!: MatSort;
  encryptKeyValue!: string;
  topUpKey!:string;


  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.dataSource.sort = this.sort;
  }

  //dataSource = new MatTableDataSource<ViewTicketsList>(this.viewTicketsList);

  constructor(private router: Router, private cdref: ChangeDetectorRef, private datepipe: DatePipe, private formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>, public dialog: MatDialog, private snackBar: MatSnackBar,
    private service: ServicesService, private spinnerService: NgxSpinnerService) {
    this.dateAdapter.setLocale('en-GB');
    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');
  }
  isShow = false

  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;
  notes = true;

  ngOnInit(): void {
    this.getKey();


  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  merchantTopUp() {
    this.fetchValue();
  }
  merchantCodeEnter() {
    this.merchantCodeValidate = false;
  }
  getKey() {
    this.service.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;
      const keyValue1 = keys.split("//");
      const firstDecrypt = this.encryptAndDecrypt.decryptfinal(keyValue1[1].trim(), keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      const finalkeyValue1 = finalkeyValue;
      this.encryptKeyValue = finalkeyValue1[0].trim();

      this.topUpKey =finalkeyValue1[3].trim();
      if (this.encryptKeyValue != "" || this.encryptKeyValue != null) {
        this.getValue();
      }
    });
  }

  getValue() {
  }

  fetchValue() {
    if (this.viewTickets.merchantID == null || this.viewTickets.merchantID == "") {
      this.merchantCodeValidate = true;
      if (this.viewTickets.amount == null || this.viewTickets.amount == "") {
        this.amtValidate = true;
      }
      if (this.viewTickets.utr == null || this.viewTickets.utr == "") {

        this.utrValidate = true;
      }

    }
    else if (this.viewTickets.amount == null || this.viewTickets.amount == "") {

      this.amtValidate = true;

      if (this.viewTickets.utr == null || this.viewTickets.utr == "") {
        this.utrValidate = true;

      }

      if (this.viewTickets.merchantID == null || this.viewTickets.merchantID == "") {

        this.merchantCodeValidate = true;
      }


    }
    else if (this.viewTickets.utr == null || this.viewTickets.utr == "") {

      this.utrValidate = true;

      if (this.viewTickets.merchantID == null || this.viewTickets.merchantID == "") {

        this, this.merchantCodeValidate = true;

      }
      if (this.viewTickets.amount == null || this.viewTickets.amount == "") {

        this.amtValidate = true;

      }

    }

    else {


      if (this.merchantCode.valid) {

        if (this.maxLimitValue.valid) {

          if (this.utr.valid) {
            this.merchantTopUpValid();
          }
        }

      }

    }
  }

  amtEnter() {
    this.amtValidate = false;
  }

  utrEnter() {
    this.utrValidate = false;
  }

  merchantTopUpValid() {
    this.spinnerService.show();
    this.viewTickets.requestType = "T";
    this.viewTickets.transactionType = "TP";
    this.viewTickets.status = "true";
    this.viewTickets.initiationType = "M";
    // Wpn1kw9#77$

    const merchantid = this.viewTickets.merchantID.toUpperCase();
    const urtnumber = this.viewTickets.utr.toUpperCase();


    this.viewTickets.merchantID = merchantid;
    this.viewTickets.utr = urtnumber;
    this.merchantDetailsView();  //1 

  }

  display() {
    this.spinnerService.hide();
    const dialogTool = this.dialog.open(MerchantpopUpViewComponent,
      {
        autoFocus: false,
        width: '330px',
        height: '300px',
        data: { merchantinfo: this.viewTickets }
      });

    dialogTool.afterClosed().subscribe(result => {
      this.merchantCode.reset();
      this.maxLimitValue.reset();
      this.utr.reset();
      this.reloadCurrentRoute();
    });
  }
  reloadCurrentRoute() {
    //   this.iacreationform.reset();
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }


  merchantDetailsView() { // for confirmation merchant 




    this.spinnerService.hide();
    const dialogTool = this.dialog.open(MerchantTopUpConfirmationComponent,
      {
        autoFocus: false,
        width: '330px',
        height: '280px',
        data: { merchantinfo: this.viewTickets }
      });

    dialogTool.afterClosed().subscribe(result => {

      this.spinnerService.show();
      if (result) {
        // true
        this.topUpConfirmed();

      }
      else {
        // false
        this.topUpFailed();
      }
    });


  }

  topUpConfirmed() {
    this.spinnerService.show();
    // our side calling first
    this.auditRequest.actionName = "Merchant TopUp"
    this.auditRequest.userId = this.signInNavResponse.responseContent.id.toString();
    this.auditRequest.userName = this.signInNavResponse.responseContent.username;
    this.auditRequest.beneficiary = this.viewTickets.merchantID;
    this.auditRequest.amount = this.viewTickets.amount;
    const encryptData = this.encryptAndDecrypt.encryptfinal(this.auditRequest, this.encryptKeyValue);
    this.auditDTO.data = encryptData;
    this.service.auditRequest(this.auditDTO).subscribe(auditResponse => {
      const decryptData = this.encryptAndDecrypt.decryptfinal(auditResponse.data, this.encryptKeyValue);
      var decryptResposen = JSON.parse(decryptData);
      if (decryptResposen.statusCode == 200) {
        this.topUpCalling();
      }
      else {
        // our side exception 
        this.spinnerService.hide();
        this.snackBar.open("Please try after some time connectivity problem", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',
          }
        )

        this.spinnerService.hide();
      }


    },error =>
    {
      this.spinnerService.hide();
      this.snackBar.open("Please try after some time connectivity problem", '',
        {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'center',
        }
      )

    });
  }

  topUpFailed() {
    this.spinnerService.hide();
    this.merchantCode.reset();
    this.maxLimitValue.reset();
    this.utr.reset();
    this.reloadCurrentRoute();

  }

  auditCalling(auditRecord: any) {
    this.spinnerService.show();
    this.auditRequest.actionName = "Merchant TopUp"
    this.auditRequest.responseStatus = auditRecord.status + "/" + auditRecord.message;
    this.auditRequest.userId = this.signInNavResponse.responseContent.id.toString();
    this.auditRequest.userName = this.signInNavResponse.responseContent.username;
    this.auditRequest.beneficiary = auditRecord.merchantID;
    this.auditRequest.amount = auditRecord.amount;
    const encryptData = this.encryptAndDecrypt.encryptfinal(this.auditRequest, this.encryptKeyValue);
    this.auditDTO.data = encryptData;
    this.service.auditRequestResponse(this.auditDTO).subscribe(auditResponse => {
      const decryptData = this.encryptAndDecrypt.decryptfinal(auditResponse.data, this.encryptKeyValue);
      //("decryt respose ")
      //(decryptData);

      var decryptResposen = JSON.parse(decryptData);
      if (decryptResposen.statusCode == 200) {
        this.display();
      }
      else { 

        this.snackBar.open("Please try after some time connectivity problem", '',
        {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'center',
        })
      }


    })

  }



  topUpCalling() {   // after call our side ok 


    
    // Wpn1kw9#77$
    var encryptData = this.encryptAndDecrypt.encryptfinal(this.viewTickets, this.topUpKey);
    this.encryptDTO.data = encryptData;
    
    this.service.merchantTopUpCalling(this.encryptDTO).subscribe(mresponse => {


      //var res = "hDGpprNCn+N2tkKUWnEfm0WHZjAm7D3/c2h8R0uNjOjAo+DS3fR4jl8KoRPkfDl6TBlmsWy0xMhPfLWM57nIMtkzVwdGauhClKn6M9ciJUw=";

      var encryptData = this.encryptAndDecrypt.decryptfinal(mresponse.data, this.topUpKey);


      
      this.encryptAndDecryptResposne = JSON.parse(encryptData);


      if (this.encryptAndDecryptResposne.status == "200") {
        this.viewTickets.status = "Success"
        this.viewTickets.message = this.encryptAndDecryptResposne.message;
        this.auditCalling(this.viewTickets);
        // this.display();
      }
      else if (this.encryptAndDecryptResposne.status == "400") {
        this.viewTickets.status = "Failure";
        this.viewTickets.message = this.encryptAndDecryptResposne.message;
        this.auditCalling(this.viewTickets);
      }

      else if (this.encryptAndDecryptResposne.status == "202") {
        this.viewTickets.status = "Duplicate UTR Number";
        this.viewTickets.message = this.encryptAndDecryptResposne.message;
        this.auditCalling(this.viewTickets);
      }

      else {
        this.viewTickets.status = "Server Down";
        this.viewTickets.message = this.encryptAndDecryptResposne.message;
        this.auditCalling(this.viewTickets);
      }
    }, error => {


      //var res = "hDGpprNCn+N2tkKUWnEfm0WHZjAm7D3/c2h8R0uNjOjAo+DS3fR4jl8KoRPkfDl6TBlmsWy0xMhPfLWM57nIMtkzVwdGauhClKn6M9ciJUw=";





      this.spinnerService.hide();
      // this.snackBar.open("Please try after some time connectivity problem", '',
      //   {
      //     horizontalPosition: 'center',
      //     verticalPosition: 'top',
      //     duration: 3000,
      //     panelClass: 'center',
      //   });

      this.viewTickets.status = "Failed"
      this.viewTickets.message = "Please try after some time Wallet connectivity problem"

      this.auditCalling(this.viewTickets);


    });



    // above

    //var res = "hDGpprNCn+N2tkKUWnEfm0WHZjAm7D3/c2h8R0uNjOjAo+DS3fR4jl8KoRPkfDl6TBlmsWy0xMhPfLWM57nIMtkzVwdGauhClKn6M9ciJUw=";
    // var encryptData = this.encryptAndDecrypt.decryptfinal(res, "Wpn1kw9#77$");
    // this.encryptAndDecryptResposne = JSON.parse(encryptData);
    // this.encryptAndDecryptResposne.status = "200"
    // this.encryptAndDecryptResposne.message = "Recharge Unsuccessful"
    // this.encryptAndDecryptResposne.isvalid = "false"




  }

}
