import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { strings } from '@material/select';
import { NgxSpinnerService } from 'ngx-spinner';
import { CreditorAccount } from 'src/app/creditor-account';
import { DebtorAccount } from 'src/app/debtor-account';
import { FundTransferData } from 'src/app/fund-transfer-data';
import { PaymentRequest } from './paymentRequest';
import {
  FundTransferResponse
} from 'src/app/fund-transfer-response';
import { FundTransferResponseContent } from 'src/app/fund-transfer-response-content';
import { Initiation } from 'src/app/initiation';
import { InstructedAmount } from 'src/app/instructed-amount';
import { ParentMenus } from 'src/app/parent-menus';
import { PennyDropDeliveryAddress } from 'src/app/penny-drop-delivery-address';
import { PennyFrom } from 'src/app/penny-from';
import { ResponseContentParentMenus } from 'src/app/response-content-parent-menus';
import { Risk } from 'src/app/risk';
import { ServicesService } from 'src/app/services.service';
import { PaymentConfirmationPopupComponent } from '../payment-confirmation-popup/payment-confirmation-popup.component';
import { PaymentconfirmationFromUserComponent } from '../paymentconfirmation-from-user/paymentconfirmation-from-user.component';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';
import { paymentDTO } from './paymentDTO';
import { time } from 'console';
import { timeout } from 'rxjs';
import { BeneficiaryInfoPopupComponent } from '../beneficiary-info-popup/beneficiary-info-popup.component';

import { Router } from '@angular/router';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';
import { EncryptionDTO } from 'src/app/encryption-dto';
import { ResponseBene } from '../notify-component/ResponseBene';


@Component({
  selector: 'app-payment-ft',
  templateUrl: './payment-ft.component.html',
  styleUrls: ['./payment-ft.component.scss']
})
export class PaymentFTComponent implements OnInit {

  statusMessage!: String;
  transferAmount!: string;
  remarksvalue = "";
  beneName = false;
  bank = false;
  ifsc = false;
  accNum = false;
  branchValid = false;

  accountField = false;
  remarksField = false;
  paybutton = false;
  selectedVariable: any;

  encryptDTO: EncryptionDTO = new EncryptionDTO();

  maxamountLimit: any;
  signInNavResponse: SignInNavResponse = new SignInNavResponse();

  paymentRequestDTO: paymentDTO = new paymentDTO();
  // encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  enterAmountValue: any;
  validAmountvalue = "";
  beneficiaryName = "";
  accountnumbervalue!: boolean;
  debitaccnum!: boolean;
  transferTypeValue!: boolean;

  rechargenumbervalue!: boolean;
  mobile = new FormControl('', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]);
  commentFC = new FormControl('', [Validators.required, Validators.pattern('^([0-9]+(\.?[0-9]{2}?)?)')]);
  remarks = new FormControl('', [
    Validators.required,
    Validators.maxLength(100)
  ]);
  parentMenu: ParentMenus = new ParentMenus();

  ftResponse: ParentMenus = new ParentMenus();

  validAmountEnter = "";


  parentMenuForDebitAcc: ParentMenus = new ParentMenus();

  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  debitaccountnumberlist1: Record<any, any>[] = this.parentMenuForDebitAcc.responseContent;
  debitaccountnumberlist2: Record<any, any>[] = this.parentMenuForDebitAcc.responseContent;

  accountnumberlist1: Record<any, any>[] = this.parentMenu.responseContent;
  accountnumberlist2: Record<any, any>[] = this.parentMenu.responseContent;


  panchayatNameEnter = "";
  chooseacc = true;
  AccountNumber = "";
  Bank = "";
  IFSC = "";
  branch = "";
  BeneficiaryName = "";
  enteramount = "";
  maxAmountValue = "";
  referenceNumberGeneratedValue!: string;
  enterAmountBoolean !: boolean;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;
  selectedCustomerID = "";
  selectedAccountNumberValue = "";
  encryptandDecryptkey!: string;
  constructor(private router: Router, private matDialog: MatDialog, private service: ServicesService, private spinnerService: NgxSpinnerService, private cdref: ChangeDetectorRef, public dialog: MatDialog, private snackBar: MatSnackBar) { }
  ngOnInit() {



    this.service.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;
      const keyValue1 = keys.split("//");
      const firstDecrypt = this.encryptAndDecrypt.decryptfinal(keyValue1[1].trim(), keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      const finalkeyValue1 = finalkeyValue;

      this.encryptandDecryptkey = finalkeyValue1[0].trim();

      if (this.encryptandDecryptkey != "" || this.encryptandDecryptkey != null) {
        this.getValue();
      }
    });








    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');
    this.accountnumbervalue = false;
    this.debitaccnum = false;;
    this.transferTypeValue = false;


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
  instructedAmount: InstructedAmount = new InstructedAmount();
  pennyDropForm!: FormGroup;
  penny: PennyFrom = new PennyFrom()
  hideRequiredMarker = "true"
  request: PaymentRequest = new PaymentRequest();
  response: FundTransferResponse = new FundTransferResponse();
  decryptResposneCatch: ResponseBene = new ResponseBene();
  responseContent: FundTransferResponseContent = new FundTransferResponseContent();
  dataList: FundTransferData[] = [];

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
  displayedColumns: string[] = ['consentId', 'creationDateTime', 'status', 'instructionIdentification', 'identification', 'schemeName', 'schemeIdentification', 'name',
    'clearingSystemIdentification', 'amount',];
  displayedColumns1: string[] = ['addressLine', 'streetName', 'buildingNumber', 'postCode', 'townName', 'countrySubDivision', 'paymentContextCode',
  ];

  ngAfterViewInit() {
    this.dataSource.sort = this.firstTableSort;
    this.dataSource1.sort = this.secondTableSort;
  }
  toDisplay = false;

  fundTransfer() {
    this.dataList = [];
    if (this.penny.accountNumber == "" || this.penny.accountNumber == null) {
      this.accountnumbervalue = true;
    }
    else {

      this.spinnerService.show();

      //("final ft request")
      //(this.request)


      const ftencryptRequest = this.encryptAndDecrypt.encryptfinal(this.request, this.encryptandDecryptkey);

      this.encryptDTO.data = ftencryptRequest;

      this.service.makePayment(this.encryptDTO).subscribe(data => {

        const ftresposne = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptandDecryptkey);

        this.ftResponse = JSON.parse(ftresposne);
        this.spinnerService.hide();

        if (this.ftResponse.statusCode == 200) {
          this.snackBar.open("Payment success", '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',
            });
          this.reloadCurrentRoute();
        }
        else {
          this.snackBar.open("Payment failed", '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',
            });

          this.toDisplay = true;



          // this.responseContent = this.response.responseContent;
          // this.data = this.responseContent.data;
          //if (this.response.statusCode == 200) {
          // this.initiation = this.responseContent.data.initiation;
          // this.creditorAccount = this.responseContent.data.initiation.creditorAccount;
          // this.debtorAccount = this.responseContent.data.initiation.debtorAccount;
          // this.instructedAmount = this.responseContent.data.initiation.instructedAmount;
          // this.risk = this.responseContent.data.risk;
          // this.dataList.push(this.data);
          // this.dataSource.data = this.dataList;
          // } else {
          //this.statusMessage = this.response.message;
          // }

          this.reloadCurrentRoute();
        }
      })

      // this.service.getFundTransfer(this.request, this.XIBMClientId, this.XIBMClientSecret).subscribe(data => {
      //   this.spinnerService.hide();
      //   this.response = data;
      //   if (this.response.responseContent == null) {
      //     this.snackBar.open("Payment failed", '',
      //       {
      //         horizontalPosition: 'center',
      //         verticalPosition: 'top',
      //         duration: 3000,
      //         panelClass: 'center',
      //       });
      //   }
      //   else {
      //     this.snackBar.open("Payment successful", '',
      //       {
      //         horizontalPosition: 'center',
      //         verticalPosition: 'top',
      //         duration: 3000,
      //         panelClass: 'center',
      //       });
      //     this.toDisplay = true;

      //     this.responseContent = this.response.responseContent;
      //     this.data = this.responseContent.data;
      //     if (this.response.statusCode == 200) {
      //       this.initiation = this.responseContent.data.initiation;
      //       this.creditorAccount = this.responseContent.data.initiation.creditorAccount;
      //       this.debtorAccount = this.responseContent.data.initiation.debtorAccount;
      //       this.instructedAmount = this.responseContent.data.initiation.instructedAmount;
      //       this.risk = this.responseContent.data.risk;
      //       this.dataList.push(this.data);
      //       this.dataSource.data = this.dataList;
      //     } else {
      //       this.statusMessage = this.response.message;
      //     }
      //   }
      // })




    }
  }
  referenceNumberGeneration(): string {
    this.referenceNumber = Math.floor(Math.random() * 12345678910);
    this.referenceNumberValue = "AE" + this.referenceNumber.toString();
    return this.referenceNumberValue;
  }
  selectedAccountNumber() {
    this.accountnumberlist1 = [];
    this.accountnumberlist2 = [];
    this.service.getAccountDetails().subscribe(accnumber => {




      const decryptData = this.encryptAndDecrypt.decryptfinal(accnumber.data, this.encryptandDecryptkey);




      this.parentMenu = JSON.parse(decryptData);

      if (this.parentMenu.statusCode == 200) {
        //.parentMenu = accnumber;

        for (let i = 0; i < this.parentMenu.responseContent.length; i++) {

          this.parentMenu.responseContent[i].shortName = this.parentMenu.responseContent[i].shortName + " - " + this.parentMenu.responseContent[i].beneficiaryAccountNumber;
        }
        this.accountnumberlist1 = this.parentMenu.responseContent;
        this.accountnumberlist2 = this.parentMenu.responseContent;
      }
      else {

        this.accountnumberlist1 = [];
        this.accountnumberlist2 = [];

      }
    })
  }



  accNumberSelected(customerid: boolean) {

    //("selected acc" + this.selectedVariable)

    //("selected " + customerid)



    if (!customerid && this.selectedVariable) {
      this.toDisplay = false;
      this.dataSource.data = [];
      this.accountnumbervalue = false;
      this.selectedCustomerID = this.selectedVariable;
      this.beneName = true;
      this.bank = true;
      this.ifsc = true;
      this.accNum = true;
      this.branchValid = true;
      this.enteramount = "";


      this.debitaccnum = false;
      this.transferTypeValue = false;
      this.penny.transferMode = "";
      this.penny.debitAccountNumber = "";


      // this.commentFC.setErrors(null);


      this.accountField = false;
      this.remarksField = false;
      this.paybutton = false;


      for (let i = 0; i < this.parentMenu.responseContent.length; i++) {
        if (this.parentMenu.responseContent[i].beneficiaryAccountNumber == this.selectedCustomerID) {

          this.maxAmountValue = this.parentMenu.responseContent[i].maxlimit;


          this.request.addressLine = this.parentMenu.responseContent[i].addressLine;
          //this.request.appID = this.parentMenu.responseContent[i].appID;
          //this.request.customerIdOfDebitAccount = this.parentMenu.responseContent[i].customerIdOfDebitAccount
          this.request.beneficiaryAccountNumber = this.parentMenu.responseContent[i].beneficiaryAccountNumber
          this.request.beneficiaryIFSC = this.parentMenu.responseContent[i].beneficiaryIFSC
          this.request.beneficiaryName = this.parentMenu.responseContent[i].beneficiaryName
          //this.request.debitAccountNumber = this.parentMenu.responseContent[i].debitAccountNumber


         


          const nickNameValue = this.parentMenu.responseContent[i].shortName.split("-");

          this.request.nickName =nickNameValue[0].trim();

          

          // this.beneficiaryName = this.request.beneficiaryName;
          // this.request.country = this.parentMenu.responseContent[i].country
          // this.request.countrySubDivision = this.parentMenu.responseContent[i].countrySubDivision
          // this.request.remarks = this.parentMenu.responseContent[i].remarks
          // this.request.transferType = this.parentMenu.responseContent[i].transferType





          // this.request.transferCurrencyCode = this.parentMenu.responseContent[i].transferCurrencyCode


          this.chooseacc = false;
          // this.AccountNumber = this.request.beneficiaryAccountNumber;
          this.Bank = this.parentMenu.responseContent[i].bankName;
          // this.IFSC = this.request.beneficiaryIFSC;
          this.branch = this.parentMenu.responseContent[i].branchName;
          // this.BeneficiaryName = this.request.beneficiaryName;




          // this.paymentRequestDTO.accountNumber = this.parentMenu.responseContent[i].beneficiaryAccountNumber

          // this.paymentRequestDTO.branch = this.parentMenu.responseContent[i].branchName;
          // this.paymentRequestDTO.bank = this.parentMenu.responseContent[i].bankName;
          // this.paymentRequestDTO.beneficiaryName = this.parentMenu.responseContent[i].beneficiaryName
          // this.paymentRequestDTO.ifsc = this.request.beneficiaryIFSC;


          // this.paymentRequestDTO.remarks = this.parentMenu.responseContent[i].remarks
          // this.paymentRequestDTO.userID = this.signInNavResponse.responseContent.id;
          // this.paymentRequestDTO.userName = this.signInNavResponse.responseContent.username;


          this.accountField = true;
          this.remarksField = true;
          this.paybutton = true;
          this.commentFC.reset();
          this.remarks.reset();

          this.commentFC.setErrors(null);
          this.remarks.setErrors(null);






          this.matDialog.open(BeneficiaryInfoPopupComponent,
            {
              autoFocus: false,
              width: '330px',
              height: '300px',
              data: { viewBeneDetails: this.request, BeneDetails: JSON.stringify(this.parentMenu.responseContent[i]) }
            });

        }

        else {

          ////("else")
        }


      }
    }
    else {
      ////("not select else")
    }

  }
  onlyNumberKey(event: any) {
    event.target.maxLength = 30;
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }
  pay() {
    const dialogRef = this.dialog.open(PaymentConfirmationPopupComponent, {
    });
  }
  panchayatselect(amount: string) {
  }
  onBlur(): void {
    this.mobile.markAsUntouched();
    this.remarks.markAsUntouched();
    this.commentFC.markAsUntouched();
  }
  enterAmount(amountValue: string) {
    let amountConvertNumber = Number(amountValue);
    let maxAmountConvert = Number(this.maxAmountValue);
    if (amountConvertNumber <= maxAmountConvert) {
      this.validAmountEnter = amountConvertNumber.toString();
    }
    else {
      this.enterAmountBoolean = true;
    }
  }
  comment!: any
  maxamount!: string;
  openAddFileDialog(): void {

    this.spinnerService.hide();
    this.maxamount = this.maxAmountValue;
    this.request.transferAmount = this.validAmountvalue;
    this.request.remarks = this.remarksvalue;
    this.referenceNumberGeneratedValue = this.referenceNumberGeneration();

    //this.request.customerRequestReferenceNumber = this.referenceNumberGeneratedValue;


    const dialogRef = this.dialog.open(PaymentConfirmationPopupComponent, {
      width: '400px',
      // height: '280px',
      //panelClass: "dialog-responsive",
      data: { comment: this.comment, maxamount: this.maxamount, Bank: this.Bank, branch: this.branch, details: this.request }
    });
    dialogRef.afterClosed().subscribe(result => {


      this.comment = result.comment;
      //this.request.transferAmount = result;
      ////(this.request);

      if (result) {
        this.fundTransfer();
        this.paymentRequestDTO.referenceNumber = this.referenceNumberGeneratedValue;
        this.paymentRequestDTO.remarks = this.request.remarks;
        // this.request.transferAmount = this.validAmountvalue;
        // this.service.postPaymentDetails(this.paymentRequestDTO).subscribe(response => {


        // })

      }

      else {

      }



    });
  }


  // payment confirmation from user 
  details!: any
  yesOrNo!: string;

  paymentConfirmation(): void {
    const dialogRef = this.dialog.open(PaymentconfirmationFromUserComponent, {
      width: '400px',
      height: '280px',
      //panelClass: "dialog-responsive",
      data: { details: this.request, yesOrNo: this.yesOrNo }
    });
    dialogRef.afterClosed().subscribe(result => {


      this.comment = result.comment;
      this.request.transferAmount = result;

    });
  }
  getMobileError() {
    if (this.commentFC.hasError('required')) {
      return 'Amount is required';
    }
    return this.commentFC.hasError('pattern') ? 'Enter valid Amount ' : '';
  }
  myMethod(val: any) {
    if (this.commentFC.valid) {


      this.enterAmountValue = Number(val);
      this.maxamountLimit = Number(this.maxAmountValue);
      var stringToConvert = this.maxAmountValue;
      var numberValue = Number(stringToConvert);
      let num = numberValue;
      let Amount = num.toLocaleString("en-IN");

      if (this.enterAmountValue <= this.maxamountLimit) {

        this.data = val
        this.validAmountvalue = val;


        this.paymentRequestDTO.amount = this.validAmountvalue;
      }
      else {

        var stringToConvert = this.maxAmountValue;
        var numberValue = Number(stringToConvert);
        let num = numberValue;
        let Amount = num.toLocaleString("en-IN");

      }
    }
    else {

    }
  }
  handleInput(event: any) {
    if (event.target.selectionEnd === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }
  isAlfa(evt: any) {
    evt = (evt || window.event);
    var charCode = (evt.which || evt.keyCode);
    var slash = "/";
    var hypen = "-";
    var openBracket = "(";
    var closeBracket = ")";
    var quote = "'";
    var queMark = "?";
    var specialCharacters: any
    var arrowLeft = 'ArrowLeft';
    var arrowRight = 'ArrowRight';
    var arrowUp = 'ArrowUp';
    var arrowDown = 'ArrowDown';
    if (evt.key == arrowUp || evt.key == arrowDown || evt.key == queMark || evt.key == quote || evt.key == arrowRight || evt.key == arrowRight || evt.key == arrowLeft || slash == evt.key || hypen == evt.key || openBracket == evt.key || closeBracket == evt.key || evt.key == "." || evt.key == ",") {
      specialCharacters = false;
    }
    else {
      specialCharacters = true;
    }
    // number if
    var numberBoolean: any;
    if (evt.key == "0" || evt.key == "1" || evt.key == "2" || evt.key == "3" || evt.key == "4" || evt.key == "5" || evt.key == "6" || evt.key == "7" || evt.key == "8" || evt.key == "9") {
      numberBoolean = false;
    }
    else {
      numberBoolean = true;
    }
    return (((charCode > 32) && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122) && (specialCharacters) && (numberBoolean)) || this.willCreateWhitespaceSequence(evt)) ? false : true;
  }
  isWhiteSpace(char: any) {
    return (/\s/).test(char);
  }
  willCreateWhitespaceSequence(evt: any) {
    var willCreateWSS = false;
    if (this.isWhiteSpace(evt.key)) {
      var elmInput = evt.currentTarget;
      var content = elmInput.value;
      var posStart = elmInput.selectionStart;
      var posEnd = elmInput.selectionEnd;
      willCreateWSS = (
        this.isWhiteSpace(content[posStart - 1] || '')
        || this.isWhiteSpace(content[posEnd] || '')
      );
    }
    return willCreateWSS;
  }
  remarksMethos(val: any) {
    if (this.remarks.valid) {
      //this.dialogRef.close(val);
      //this.data=val
    }
    else {
    }
  }
  onCommentChange() {
  }


  optgenerate() {


    this.spinnerService.show();

    ////(this.request)

    this.request.userIdentification = this.signInNavResponse.responseContent.id;
    this.request.userName = this.signInNavResponse.responseContent.username;
    this.request.mobileNumber = this.signInNavResponse.responseContent.mobileNo;



    const makePaymentRequest = this.encryptAndDecrypt.encryptfinal(this.request, this.encryptandDecryptkey);


    this.encryptDTO.data = makePaymentRequest;

    this.service.getotpGenerate(this.encryptDTO).subscribe(res => {

      const decryptData = this.encryptAndDecrypt.decryptfinal(res.data, this.encryptandDecryptkey);


      this.decryptResposneCatch = JSON.parse(decryptData);


      if (this.decryptResposneCatch.statusCode == 200) {

        this.snackBar.open(this.decryptResposneCatch.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',
          });

        this.openAddFileDialog();
        // setTimeout(() => {
        //   this.spinnerService.hide();


        //   }, 2000);

        //////(res.message)


      }
      else if (this.decryptResposneCatch.statusCode == 404) {
        this.snackBar.open(this.decryptResposneCatch.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',
          });


        setTimeout(() => {
          this.spinnerService.hide();


        }, 1000);
        //////("user not exits")
      }
      else {
        this.snackBar.open(this.decryptResposneCatch.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',
          });
        setTimeout(() => {
          this.spinnerService.hide();


        }, 1000);
        //////(res.message)
      }




    });

  }




  makePay() {



    this.commentFC.setValidators([Validators.required, Validators.pattern('^([0-9]+(\.?[0-9]{2}?)?)')]);
    this.remarks.setValidators([
      Validators.required, Validators.minLength(5),
      Validators.maxLength(100)
    ]);
    this.commentFC.updateValueAndValidity();
    this.remarks.updateValueAndValidity();

    if ((this.penny.accountNumber == null || this.penny.accountNumber == "") && (this.penny.debitAccountNumber == null || this.penny.debitAccountNumber == "") && (this.penny.transferMode == null || this.penny.transferMode == "")) {

      this.accountnumbervalue = true;
      this.debitaccnum = true;
      this.transferTypeValue = true;

    }

    else {


      if (this.penny.accountNumber == null || this.penny.accountNumber == "") {

        this.accountnumbervalue = true;

        if (this.penny.debitAccountNumber == null || this.penny.debitAccountNumber == "") {
          this.debitaccnum = true;
        }

        if (this.penny.transferMode == null || this.penny.transferMode == "") {
          this.transferTypeValue = true;
        }


      }

      else if (this.penny.debitAccountNumber == null || this.penny.debitAccountNumber == "") {
        this.debitaccnum = true;

        if (this.penny.transferMode == null || this.penny.transferMode == "") {
          this.transferTypeValue = true;
        }

        if (this.penny.accountNumber == null || this.penny.accountNumber == "") {
          this.accountnumbervalue = true;
        }
      }
      else if (this.penny.transferMode == null || this.penny.transferMode == "") {
        this.transferTypeValue = true;
        if (this.penny.debitAccountNumber == null || this.penny.debitAccountNumber == "") {
          this.debitaccnum = true;
        }
        if (this.penny.accountNumber == null || this.penny.accountNumber == "") {
          this.accountnumbervalue = true;
        }
      }


    }









    if (this.commentFC.valid && this.remarks.valid) {


      if (this.enterAmountValue > this.maxamountLimit) {
        var stringToConvert = this.maxAmountValue;
        var numberValue = Number(stringToConvert);
        let num = numberValue;
        let Amount = num.toLocaleString("en-IN");

        this.snackBar.open("Payment can't be more than" + "    " + "₹" + "  " + Amount + ".00", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2000,
            panelClass: 'center',
          });

      }
      else {


        const amtvalue = this.enterAmountValue.toString();

        if (amtvalue.substring(0, 1) == 0) {

          this.snackBar.open("Payment must be at least " + "₹" + "1" + ".00", '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 2000,
              panelClass: 'center',
            });
        }
        else {
          this.spinnerService.show();

          this.optgenerate();
          // setTimeout(() => {
          //   this.spinnerService.hide();
          //   this.optgenerate();
          // }, 2000);



        }


      }

    }

    else {

      if (this.commentFC.valid) {
        if (this.remarks.valid) {


          if (this.enterAmountValue > this.maxamountLimit) {


            var stringToConvert = this.maxAmountValue;
            var numberValue = Number(stringToConvert);
            let num = numberValue;
            let Amount = num.toLocaleString("en-IN");

            this.snackBar.open("Payment can't be more than" + "    " + "₹" + "  " + Amount + ".00", '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 2000,
                panelClass: 'center',
              });

          }

          else {



            const amtvalue = this.enterAmountValue.toString();

            if (amtvalue.substring(0, 1) == 0) {

              this.snackBar.open("Payment must be at least " + "₹" + "1" + ".00", '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 2000,
                  panelClass: 'center',
                });
            }
            else {
              this.spinnerService.show()
              this.optgenerate();
              // setTimeout(() => {
              //   this.spinnerService.hide();
              //   this.optgenerate();
              // }, 2000);



            }
          }

        }
        else {

        }
      }


      if (this.remarks.valid) {


        if (this.commentFC.valid) {


          if (this.enterAmountValue > this.maxamountLimit) {


            var stringToConvert = this.maxAmountValue;
            var numberValue = Number(stringToConvert);
            let num = numberValue;
            let Amount = num.toLocaleString("en-IN");

            this.snackBar.open("Payment can't be more than" + "    " + "₹" + "  " + Amount + ".00", '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 2000,
                panelClass: 'center',
              });

          }
          else {


            const amtvalue = this.enterAmountValue.toString();
            if (amtvalue.substring(0, 1) == 0) {

              this.snackBar.open("Payment must be at least " + "₹" + "1" + ".00", '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 2000,
                  panelClass: 'center',
                });
            }
            else {
              this.spinnerService.show();

              this.optgenerate();



            }
          }

        }
        else {

        }

      }
    }

    if (this.commentFC.invalid && this.remarks.invalid) {


    }


  }

  touched() {
    ////("yes")
  }

  selecteDebitAccount() {
    this.service.fetchAccountNumber().subscribe(accNumber => {
      const decryptData = this.encryptAndDecrypt.decryptfinal(accNumber.data, this.encryptandDecryptkey);

      ////(decryptData);
      this.parentMenuForDebitAcc = JSON.parse(decryptData);

      ////(this.parentMenuForDebitAcc);
      this.debitaccountnumberlist1 = this.parentMenuForDebitAcc.responseContent;
      this.debitaccountnumberlist2 = this.parentMenuForDebitAcc.responseContent;

    })
  }

  debitAccountNumberSelect(debitAcc: any) {


    this.debitaccnum = false;

    for (let i = 0; i < this.parentMenuForDebitAcc.responseContent.length; i++) {



      if (this.parentMenuForDebitAcc.responseContent[i].accNo == debitAcc) {
        this.request.debitAccountNumber = this.parentMenuForDebitAcc.responseContent[i].accNo;
        this.request.appID = this.parentMenuForDebitAcc.responseContent[i].customerId;
        this.request.customerIdOfDebitAccount = this.parentMenuForDebitAcc.responseContent[i].customerId;
      }
      else {

      }


    }


  }
  transferModeSelected(transferType: any) {
    this.transferTypeValue = false;

    this.request.transferType = transferType;
  }


  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }


  getValue() {
    this.selectedAccountNumber();
    this.selecteDebitAccount();
  }





}
