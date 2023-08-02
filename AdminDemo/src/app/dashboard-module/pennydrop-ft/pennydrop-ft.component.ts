
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, Provider, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PennyDropDeliveryAddress } from 'src/app/penny-drop-delivery-address';

import { FormGroup } from '@angular/forms';
import { PennyFrom } from 'src/app/penny-from';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { ServicesService } from 'src/app/services.service';
import { FundTransferRequest } from 'src/app/fund-transfer-request';
import { FundTransferResponse } from 'src/app/fund-transfer-response';
import { FundTransferResponseContent } from 'src/app/fund-transfer-response-content';
import { FundTransferData } from 'src/app/fund-transfer-data';
import { Initiation } from 'src/app/initiation';
import { DebtorAccount } from 'src/app/debtor-account';
import { CreditorAccount } from 'src/app/creditor-account';
import { Risk } from 'src/app/risk';
import { InstructedAmount } from 'src/app/instructed-amount';
import { ParentMenus } from 'src/app/parent-menus';

import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';
import { EncryptionDTO } from 'src/app/encryption-dto';
import { AuditRequestAndResponse } from 'src/app/audit-request-and-response';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';




@Component({
  selector: 'app-penny',
  templateUrl: './pennydrop-ft.component.html',
  styleUrls: ['./pennydrop-ft.component.scss']
})
export class PennyComponent implements AfterViewInit, OnInit {
  stsvalue = 'Received'
  falistsvalue = 'Failed'
  statusMessage!: String;

  accountnumbervalue!: boolean;

  pennydropStatus = "";

  encryptDTO: EncryptionDTO = new EncryptionDTO();

  auditDTO: EncryptionDTO = new EncryptionDTO();

  auditRequest: AuditRequestAndResponse = new AuditRequestAndResponse();

  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();


  parentMenu: ParentMenus = new ParentMenus();

  parentMenu2: ParentMenus[] = [];

  accountnumberlist1: Record<any, any>[] = this.parentMenu2;
  accountnumberlist2: Record<any, any>[] = this.parentMenu2;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;

  selectedCustomerID = "";
  selectedAccountNumberValue = "";

  encryptandDecryptkey!: string;

  ftencryptkey!: string;

  signInNavResponse: SignInNavResponse = new SignInNavResponse();

  constructor(private service: ServicesService, private spinnerService: NgxSpinnerService, private cdref: ChangeDetectorRef, public dialog: MatDialog, private snackBar: MatSnackBar) {




    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');

  }
  ngOnInit() {



    this.service.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;
      const keyValue1 = keys.split("//");
      const firstDecrypt = this.encryptAndDecrypt.decryptfinal(keyValue1[1].trim(), keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      const finalkeyValue1 = finalkeyValue;

      this.encryptandDecryptkey = finalkeyValue1[0].trim();
      this.ftencryptkey = finalkeyValue1[1].trim();

      if (this.encryptandDecryptkey != "" || this.encryptandDecryptkey != null) {
        this.getValue();
      }
    });





    this.accountnumbervalue = false;


  }
  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }
  initiation: Initiation = new Initiation();
  data: FundTransferData = new FundTransferData();

  debtorAccount: DebtorAccount = new DebtorAccount();

  creditorAccount: CreditorAccount = new CreditorAccount();

  risk: Risk = new Risk();

  referenceNumber!: number;
  referenceNumberValue!: string;
  referenceNumberGeneratedValue!: string;

  instructedAmount: InstructedAmount = new InstructedAmount();



  pennyDropForm!: FormGroup;
  penny: PennyFrom = new PennyFrom()
  hideRequiredMarker = "true"

  request: FundTransferRequest = new FundTransferRequest();

  response: FundTransferResponse = new FundTransferResponse();

  responseContent: FundTransferResponseContent = new FundTransferResponseContent();

  dataList: FundTransferData[] = [];


  // private sort!: MatSort;

  @ViewChild('secondTableSort', { static: false }) set secondTableSort(sort: MatSort) {
    this.dataSource1.sort = sort;
  }
  @ViewChild('firstTableSort', { static: false }) set firstTableSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
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
      this.dataSource1.paginator = pager;
      this.dataSource1.paginator._intl = new MatPaginatorIntl()
      this.dataSource1.paginator._intl.itemsPerPageLabel = "";
      this.dataSource1.paginator.selectConfig.disableOptionCentering = true;
    }
  }
  dataSource = new MatTableDataSource<FundTransferData>(this.dataList);
  dataSource1 = new MatTableDataSource<PennyDropDeliveryAddress>();

  displayedColumns: string[] = ['creationDateTime', 'status', 'instructionIdentification', 'identification', 'schemeName', 'schemeIdentification', 'name',
    'clearingSystemIdentification', 'amount',];

  displayedColumns1: string[] = ['addressLine', 'streetName', 'buildingNumber', 'postCode', 'townName', 'countrySubDivision', 'paymentContextCode',
  ];



  // ngOnInit(): void {
  // }
  ngAfterViewInit() {
    this.dataSource.sort = this.firstTableSort;
    this.dataSource1.sort = this.secondTableSort;

  }



  toDisplay = false;




  XIBMClientId = "e9a4daa6-e7d4-4654-b470-92aee2cd19de";

  XIBMClientSecret = "uW8dI2cI3nG5rJ7nO8eB2qV8jM5hF0vT3dU2mW8kD4aE5eA8sH";



  fundTransfer() {

    this.dataList = [];

    if (this.penny.accountNumber == "" || this.penny.accountNumber == null) {

      this.accountnumbervalue = true;
    }

    else {

      this.request.appID = this.selectedCustomerID;
      this.request.customerIdOfDebitAccount = this.selectedCustomerID;
      this.request.debitAccountNumber = this.selectedAccountNumberValue;

      this.referenceNumberGeneratedValue = this.referenceNumberGeneration();

      this.request.customerRequestReferenceNumber = this.referenceNumberGeneratedValue;


      this.pennydropStatus = "";
      this.spinnerService.show();



      const encryptData = this.encryptAndDecrypt.encryptfinal(this.request, this.ftencryptkey);

      this.encryptDTO.data = encryptData;


      this.service.getFundTransfer(this.encryptDTO).subscribe(data => {



        const decryptData = this.encryptAndDecrypt.decryptfinal(data.data, this.ftencryptkey);


        //("decryt respose ")
        //(decryptData);

        var decryptResposen = JSON.parse(decryptData);

        //(decryptResposen);

        this.spinnerService.hide();
        this.response = decryptResposen;

        if (this.response.responseContent == null) {

          this.snackBar.open("Penny drop failed", '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',


            });

          this.pennydropStatus = "";


          this.pennyDropSuccess(this.creditorAccount.Identification + "/" + this.creditorAccount.Name + "/" + this.creditorAccount.SchemeName, this.instructedAmount.Amount, "Failed");




        }

        else {




          this.responseContent = this.response.responseContent;
          this.responseContent.Data.Status = "Success";
          this.data = this.responseContent.Data;
          if (this.response.statusCode == 200) {

            this.snackBar.open("Penny drop success", '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',


              });

            this.toDisplay = true;
            this.initiation = this.responseContent.Data.Initiation;
            this.creditorAccount = this.responseContent.Data.Initiation.CreditorAccount;
            this.debtorAccount = this.responseContent.Data.Initiation.DebtorAccount;

            this.instructedAmount = this.responseContent.Data.Initiation.InstructedAmount;

            this.risk = this.responseContent.Data.Risk;

            this.dataList.push(this.data);

            this.dataSource.data = this.dataList;

            this.pennydropStatus = "Success";

            this.pennyDropSuccess(this.creditorAccount.Identification + "/" + this.creditorAccount.Name + "/" + this.creditorAccount.SchemeName, this.instructedAmount.Amount, "Success");

          } else {


            this.statusMessage = this.response.message;



          }




        }












      })
    }

  }


  referenceNumberGeneration(): string {


    this.referenceNumber = Math.floor(Math.random() * 1234567891099);

    this.referenceNumberValue = "APS" + this.referenceNumber.toString();
    return this.referenceNumberValue;

  }

  selectedAccountNumber() {

    this.service.fetchAccountNumber().subscribe(accnumber => {

      const decryptData = this.encryptAndDecrypt.decryptfinal(accnumber.data, this.encryptandDecryptkey);


      this.parentMenu = JSON.parse(decryptData);
      this.accountnumberlist1 = this.parentMenu.responseContent;
      this.accountnumberlist2 = this.parentMenu.responseContent;

    })

  }






  accNumberSelected(customerid: string) {


    this.toDisplay = false;
    this.dataSource.data = [];
    this.pennydropStatus = "";

    this.accountnumbervalue = false;

    this.selectedCustomerID = customerid;


    for (let i = 0; i < this.parentMenu.responseContent.length; i++) {

      if (this.parentMenu.responseContent[i].customerId == this.selectedCustomerID) {


        this.selectedAccountNumberValue = this.parentMenu.responseContent[i].accNo;




      }

      else {
        // //("else ")
      }


    }





  }


  onlyNumberKey(event: any) {
    event.target.maxLength = 30;

    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }



  getValue() {
    this.selectedAccountNumber();
  }


  pennyDropSuccess(who: any, amt: any, msg: any) {
    this.auditRequest.actionName = "Penny Drop"
    this.auditRequest.responseStatus = msg;
    this.auditRequest.userId = this.signInNavResponse.responseContent.id.toString();
    this.auditRequest.userName = this.signInNavResponse.responseContent.username;
    this.auditRequest.beneficiary = who;
    this.auditRequest.amount = amt;


    const encryptData = this.encryptAndDecrypt.encryptfinal(this.auditRequest, this.encryptandDecryptkey);

    this.auditDTO.data = encryptData;



    this.service.auditRequest(this.auditDTO).subscribe(auditResponse => {


      const decryptData = this.encryptAndDecrypt.decryptfinal(auditResponse.data, this.encryptandDecryptkey);


      //("decryt respose ")
      //(decryptData);

      var decryptResposen = JSON.parse(decryptData);



      if (decryptResposen.statusCode == 200) {

      }
      else {

      }


    })





  }


}