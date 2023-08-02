import { ChangeDetectorRef, Component, Inject, Input, OnInit, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServicesService } from 'src/app/services.service';
import { AddAccountRequest } from './AddAccountRequest';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';
import { PopUpComponent } from 'src/app/pop-up-component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddAccountPopUpComponentComponent } from '../add-account-pop-up-component/add-account-pop-up-component.component';
import { ParentMenus } from 'src/app/parent-menus';

import * as angular from 'angular';
import { EncryptionDTO } from 'src/app/encryption-dto';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';



@Component({
  selector: 'app-payment-add-account-component',
  templateUrl: './payment-add-account-component.component.html',
  styleUrls: ['./payment-add-account-component.component.scss']
})
export class PaymentAddAccountComponentComponent implements OnInit {

  message!: string;

  hideRequiredMarker = true;

  request: AddAccountRequest = new AddAccountRequest();

  // encryptionAndDecryption: EncryptionAndDecryption = new EncryptionAndDecryption();

  encryptDTOValue: EncryptionDTO = new EncryptionDTO();

  address = false;

  rupeessymbol: any;

  validPattern!: boolean;
  debit = false;

  checkAccountValue = "";

  customerId = false;
  debitAccountNo = false;




  beneficiaryAcNo = false;

  beneficiary = false;

  beneficiaryIfsc = false;
  shortName = false;

  bankName = false;

  branchName = false;

  remarks = false;

  transferAmount = false;

  transferCode = false;

  transferType = false;

  maxLimit = false;

  status = false;

  transactionId = false;

  userId!: any;

  userName!: string;

  mobileNumber!: string;





  addressValue = new FormControl();

  debitValue = new FormControl();

  beneficaryValue = new FormControl();

  beneficiaryNameValue = new FormControl();



  //beneficiaryIfscValue = new FormControl('', { validators: [Validators.required, Validators.pattern("^[A-Z_a-z]{4}0[A-Z0-9a-z]{6}$")] });

  beneficiaryIfscValue = new FormControl('', { validators: [Validators.required, Validators.pattern("^[A-Z_a-z]{4}0[A-Z0-9a-z]{6}$")] });

  shortNameValue = new FormControl();

  bankNameValue = new FormControl();

  branchNameValue = new FormControl();

  remarksValue = new FormControl();

  customerid = new FormControl();

  transferValue = new FormControl();

  transferCodeValue = new FormControl();

  transferTypeValue = new FormControl();

  maxLimitValue = new FormControl();

  statusValue = new FormControl();

  transactionValue = new FormControl();

  parentMenu: ParentMenus = new ParentMenus();

  checkAccMenu: ParentMenus = new ParentMenus();

  parentMenulist: ParentMenus[] = [];


  accountnumberlist1: Record<any, any>[] = this.parentMenulist;
  accountnumberlist2: Record<any, any>[] = this.parentMenulist;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;




  signInNavResponse: SignInNavResponse = new SignInNavResponse();


  encryptandDecryptkey!: string;

  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  constructor(private router: Router, private service: ServicesService, private cdref: ChangeDetectorRef, private spinnerService: NgxSpinnerService, private snackBar: MatSnackBar,
    public matDialog: MatDialog) {

    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');




  }


  accountNumber() {
    this.service.fetchAccountNumber().subscribe(data => {


      const decryptData = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptandDecryptkey);



      this.parentMenu = JSON.parse(decryptData);

      this.accountnumberlist1 = this.parentMenu.responseContent;
      this.accountnumberlist2 = this.parentMenu.responseContent;




    })
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

      if (this.encryptandDecryptkey != "" || this.encryptandDecryptkey != null) {
        this.getValue();
      }
    });





    this.userId = this.signInNavResponse.responseContent.id;

    this.userName = this.signInNavResponse.responseContent.username;

    this.mobileNumber = this.signInNavResponse.responseContent.mobileNo;

  }


  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  onSubmit() {


    if (
      (this.request.addressLine == null || this.request.addressLine == "")

      && (this.request.beneficiaryAccountNumber == null || this.request.beneficiaryAccountNumber == "")
      && (this.request.beneficiaryName == null || this.request.beneficiaryName == "")

      && (this.request.maxlimit == null || this.request.maxlimit == "")

      && (this.request.beneficiaryIFSC == null || this.request.beneficiaryIFSC == "")
      && (this.request.shortName == null || this.request.shortName == "")
      && (this.request.bankName == null || this.request.bankName == "")
      && (this.request.branchName == null || this.request.branchName == "")) {


      this.address = true;

      this.customerId = true;

      this.beneficiaryAcNo = true;
      this.beneficiary = true;
      this.debitAccountNo = true;



      this.transferType = true;

      this.maxLimit = true;
      this.beneficiaryIfsc = true;
      this.shortName = true;
      this.bankName = true;
      this.branchName = true;
    }
    else if (this.request.addressLine == null || this.request.addressLine == "") {
      this.address = true;
      // if(this.request.customerIdOfDebitAccount == null || this.request.customerIdOfDebitAccount=="" )
      // {
      //   this.customerId= true;
      // }
      if (this.request.beneficiaryAccountNumber == null || this.request.beneficiaryAccountNumber == "") {
        this.beneficiaryAcNo = true;
      }
      if (this.request.beneficiaryName == null || this.request.beneficiaryName == "") {
        this.beneficiary = true;
      }
      // if(this.request.debitAccountNumber == null || this.request.debitAccountNumber=="")
      // {
      //   this.debitAccountNo = true;
      // }

      // if(this.request.transferType == null || this.request.transferType=="" )
      // {
      //   this.transferType= true;
      // }
      if (this.request.maxlimit == null || this.request.maxlimit == "") {
        this.maxLimit = true;
      }
      if (this.request.beneficiaryIFSC == null || this.request.beneficiaryIFSC == "") {
        this.beneficiaryIfsc = true;
      }
      if (this.request.shortName == null || this.request.shortName == "") {
        this.shortName = true;
      }
      if (this.request.bankName == null || this.request.bankName == "") {
        this.bankName = true;
      }
      if (this.request.branchName == null || this.request.branchName == "") {
        this.branchName = true;
      }
    }
    // else if(this.request.customerIdOfDebitAccount == null || this.request.customerIdOfDebitAccount=="")
    // {
    //   this.customerId=true;
    //   if(this.request.addressLine == null || this.request.addressLine == "")
    //   {
    //     this.address = true;
    //   }
    //   if(this.request.beneficiaryAccountNumber == null || this.request.beneficiaryAccountNumber=="" )
    //   {
    //     this.beneficiaryAcNo= true;
    //   }
    //   if(this.request.beneficiaryName == null || this.request.beneficiaryName=="" )
    //   {
    //     this.beneficiary= true;
    //   }
    //   if(this.request.debitAccountNumber == null || this.request.debitAccountNumber=="")
    //   {
    //     this.debitAccountNo = true;
    //   }

    //   if(this.request.transferType == null || this.request.transferType=="" )
    //   {
    //     this.transferType= true;
    //   }
    //   if(this.request.maxlimit == null || this.request.maxlimit=="" )
    //   {
    //     this.maxLimit= true;
    //   }
    //   if(this.request.beneficiaryIFSC == null || this.request.beneficiaryIFSC == "")
    //   {
    //     this.beneficiaryIfsc = true;
    //   }
    //   if(this.request.shortName == null || this.request.shortName=="")
    //   {
    //     this.shortName = true;
    //   }
    //   if(this.request.bankName == null || this.request.bankName == "")
    //   {
    //     this.bankName = true;
    //   }
    //   if(this.request.branchName == null || this.request.branchName == "")
    //   {
    //     this.branchName = true;
    //   }
    // }
    else if (this.request.beneficiaryAccountNumber == null || this.request.beneficiaryAccountNumber == "") {
      this.beneficiaryAcNo = true;

      if (this.request.addressLine == null || this.request.addressLine == "") {
        this.address = true;
      }

      // if(this.request.customerIdOfDebitAccount == null || this.request.customerIdOfDebitAccount=="" )
      // {
      //   this.customerId= true;
      // }
      if (this.request.beneficiaryName == null || this.request.beneficiaryName == "") {
        this.beneficiary = true;
      }
      // if(this.request.debitAccountNumber == null || this.request.debitAccountNumber=="")
      // {
      //   this.debitAccountNo = true;
      // }

      if (this.request.transferType == null || this.request.transferType == "") {
        this.transferType = true;
      }
      if (this.request.maxlimit == null || this.request.maxlimit == "") {
        this.maxLimit = true;
      }
      if (this.request.beneficiaryIFSC == null || this.request.beneficiaryIFSC == "") {
        this.beneficiaryIfsc = true;
      }
      if (this.request.shortName == null || this.request.shortName == "") {
        this.shortName = true;
      }
      if (this.request.bankName == null || this.request.bankName == "") {
        this.bankName = true;
      }
      if (this.request.branchName == null || this.request.branchName == "") {
        this.branchName = true;
      }
    }
    else if (this.request.beneficiaryName == null || this.request.beneficiaryName == "") {
      this.beneficiary = true;

      if (this.request.addressLine == null || this.request.addressLine == "") {
        this.address = true;
      }

      // if(this.request.customerIdOfDebitAccount == null || this.request.customerIdOfDebitAccount=="" )
      // {
      //   this.customerId= true;
      // }

      if (this.request.beneficiaryAccountNumber == null || this.request.beneficiaryAccountNumber == "") {
        this.beneficiaryAcNo = true;
      }


      // if(this.request.debitAccountNumber == null || this.request.debitAccountNumber=="")
      // {
      //   this.debitAccountNo = true;
      // }


      // if(this.request.transferType == null || this.request.transferType=="" )
      // {
      //   this.transferType= true;
      // }
      if (this.request.maxlimit == null || this.request.maxlimit == "") {
        this.maxLimit = true;
      }
      if (this.request.beneficiaryIFSC == null || this.request.beneficiaryIFSC == "") {
        this.beneficiaryIfsc = true;
      }
      if (this.request.shortName == null || this.request.shortName == "") {
        this.shortName = true;
      }
      if (this.request.bankName == null || this.request.bankName == "") {
        this.bankName = true;
      }
      if (this.request.branchName == null || this.request.branchName == "") {
        this.branchName = true;
      }

    }
    //  else if(this.request.debitAccountNumber ==null || this.request.debitAccountNumber == "")
    //  {
    //   this.debitAccountNo=true;

    //   if(this.request.addressLine == null || this.request.addressLine == "")
    //   {
    //     this.address = true;
    //   }

    //   if(this.request.customerIdOfDebitAccount == null || this.request.customerIdOfDebitAccount=="" )
    //   {
    //     this.customerId= true;
    //   }
    //   if(this.request.beneficiaryName == null || this.request.beneficiaryName=="" )
    //   {
    //     this.beneficiary= true;
    //   }
    //   if(this.request.beneficiaryAccountNumber == null || this.request.beneficiaryAccountNumber==null)
    //   {
    //     this.beneficiaryAcNo= true;
    //   }

    //   if(this.request.transferType == null || this.request.transferType=="" )
    //   {
    //     this.transferType= true;
    //   }
    //   if(this.request.maxlimit == null || this.request.maxlimit=="" )
    //   {
    //     this.maxLimit= true;
    //   }
    //   if(this.request.beneficiaryIFSC == null || this.request.beneficiaryIFSC == "")
    //   {
    //     this.beneficiaryIfsc = true;
    //   }
    //   if(this.request.shortName == null || this.request.shortName=="")
    //   {
    //     this.shortName = true;
    //   }
    //   if(this.request.bankName == null || this.request.bankName == "")
    //   {
    //     this.bankName = true;
    //   }
    //   if(this.request.branchName == null || this.request.branchName == "")
    //   {
    //     this.branchName = true;
    //   }

    //  }

    //  else if(this.request.transferType == null || this.request.transferType == "")
    //  {
    //   
    //   this.transferType = true;

    //   if(this.request.addressLine == null || this.request.addressLine == "")
    //   {
    //     this.address = true;
    //   }

    //   if(this.request.customerIdOfDebitAccount == null || this.request.customerIdOfDebitAccount=="" )
    //   {
    //     this.customerId= true;
    //   }
    //   if(this.request.beneficiaryName == null || this.request.beneficiaryName=="" )
    //   {
    //     this.beneficiary= true;
    //   }
    //   if(this.request.beneficiaryAccountNumber == null || this.request.beneficiaryAccountNumber==null)
    //   {
    //     this.beneficiaryAcNo= true;
    //   }
    //   if(this.request.debitAccountNumber==null || this.request.debitAccountNumber=="")
    //   {
    //     this.debitAccountNo=true;
    //   }

    //   if(this.request.maxlimit == null || this.request.maxlimit=="" )
    //   {
    //     this.maxLimit= true;
    //   }
    //   if(this.request.beneficiaryIFSC == null || this.request.beneficiaryIFSC == "")
    //   {
    //     this.beneficiaryIfsc = true;
    //   }
    //   if(this.request.shortName == null || this.request.shortName=="")
    //   {
    //     this.shortName = true;
    //   }
    //   if(this.request.bankName == null || this.request.bankName == "")
    //   {
    //     this.bankName = true;
    //   }
    //   if(this.request.branchName == null || this.request.branchName == "")
    //   {
    //     this.branchName = true;
    //   }
    //  }
    else if (this.request.maxlimit == null || this.request.maxlimit == "") {
      this.maxLimit = true;

      if (this.request.addressLine == null || this.request.addressLine == "") {
        this.address = true;
      }

      // if(this.request.customerIdOfDebitAccount == null || this.request.customerIdOfDebitAccount=="" )
      // {
      //   this.customerId= true;
      // }
      if (this.request.beneficiaryName == null || this.request.beneficiaryName == "") {
        this.beneficiary = true;
      }
      if (this.request.beneficiaryAccountNumber == null || this.request.beneficiaryAccountNumber == null) {
        this.beneficiaryAcNo = true;
      }
      // if(this.request.debitAccountNumber==null || this.request.debitAccountNumber=="")
      // {
      //   this.debitAccountNo=true;
      // }
      // if(this.request.remarks == null || this.request.remarks=="" )
      // {
      //   this.remarks= true;
      // }
      if (this.request.beneficiaryIFSC == null || this.request.beneficiaryIFSC == "") {
        this.beneficiaryIfsc = true;
      }
      if (this.request.shortName == null || this.request.shortName == "") {
        this.shortName = true;
      }
      if (this.request.bankName == null || this.request.bankName == "") {
        this.bankName = true;
      }
      if (this.request.branchName == null || this.request.branchName == "") {
        this.branchName = true;
      }
    }
    else if (this.request.beneficiaryIFSC == null || this.request.beneficiaryIFSC == "") {
      this.beneficiaryIfsc = true;
      if (this.request.addressLine == null || this.request.addressLine == "") {
        this.address = true;
      }

      // if(this.request.customerIdOfDebitAccount == null || this.request.customerIdOfDebitAccount=="" )
      // {
      //   this.customerId= true;
      // }
      if (this.request.beneficiaryName == null || this.request.beneficiaryName == "") {
        this.beneficiary = true;
      }
      if (this.request.beneficiaryAccountNumber == null || this.request.beneficiaryAccountNumber == null) {
        this.beneficiaryAcNo = true;
      }
      // if(this.request.debitAccountNumber==null || this.request.debitAccountNumber=="")
      // {
      //   this.debitAccountNo=true;
      // }
      if (this.request.shortName == null || this.request.shortName == "") {
        this.shortName = true;
      }
      if (this.request.bankName == null || this.request.bankName == "") {
        this.bankName = true;
      }
      if (this.request.branchName == null || this.request.branchName == "") {
        this.branchName = true;
      }
    } else if (this.request.shortName == null || this.request.shortName == "") {
      this.shortName = true;

      if (this.request.addressLine == null || this.request.addressLine == "") {
        this.address = true;
      }

      // if(this.request.customerIdOfDebitAccount == null || this.request.customerIdOfDebitAccount=="" )
      // {
      //   this.customerId= true;
      // }
      if (this.request.beneficiaryName == null || this.request.beneficiaryName == "") {
        this.beneficiary = true;
      }
      if (this.request.beneficiaryAccountNumber == null || this.request.beneficiaryAccountNumber == null) {
        this.beneficiaryAcNo = true;
      }
      // if(this.request.debitAccountNumber==null || this.request.debitAccountNumber=="")
      // {
      //   this.debitAccountNo=true;
      // }
      if (this.request.beneficiaryIFSC == null || this.request.beneficiaryIFSC == "") {
        this.beneficiaryIfsc = true;
      }
      if (this.request.bankName == null || this.request.bankName == "") {
        this.bankName = true;
      }
      if (this.request.branchName == null || this.request.branchName == "") {
        this.branchName = true;
      }
    }
    else if (this.request.bankName == null || this.request.bankName == "") {
      this.bankName = true;

      if (this.request.addressLine == null || this.request.addressLine == "") {
        this.address = true;
      }

      // if(this.request.customerIdOfDebitAccount == null || this.request.customerIdOfDebitAccount=="" )
      // {
      //   this.customerId= true;
      // }
      if (this.request.beneficiaryName == null || this.request.beneficiaryName == "") {
        this.beneficiary = true;
      }
      if (this.request.beneficiaryAccountNumber == null || this.request.beneficiaryAccountNumber == null) {
        this.beneficiaryAcNo = true;
      }
      // if(this.request.debitAccountNumber==null || this.request.debitAccountNumber=="")
      // {
      //   this.debitAccountNo=true;
      // }
      if (this.request.beneficiaryIFSC == null || this.request.beneficiaryIFSC == "") {
        this.beneficiaryIfsc = true;
      }
      if (this.request.shortName == null || this.request.shortName == "") {
        this.shortName = true;
      }
      if (this.request.branchName == null || this.request.branchName == "") {
        this.branchName = true;
      }
    } else if (this.request.branchName == null || this.request.branchName == "") {
      this.branchName = true;

      if (this.request.addressLine == null || this.request.addressLine == "") {
        this.address = true;
      }

      // if(this.request.customerIdOfDebitAccount == null || this.request.customerIdOfDebitAccount=="" )
      // {
      //   this.customerId= true;
      // }
      if (this.request.beneficiaryName == null || this.request.beneficiaryName == "") {
        this.beneficiary = true;
      }
      if (this.request.beneficiaryAccountNumber == null || this.request.beneficiaryAccountNumber == null) {
        this.beneficiaryAcNo = true;
      }
      // if(this.request.debitAccountNumber==null || this.request.debitAccountNumber=="")
      // {
      //   this.debitAccountNo=true;
      // }
      if (this.request.beneficiaryIFSC == null || this.request.beneficiaryIFSC == "") {
        this.beneficiaryIfsc = true;
      }
      if (this.request.shortName == null || this.request.shortName == "") {
        this.shortName = true;
      }

    }
    else if (this.addressValue.valid) {

      const addressValue = this.request.addressLine;






      // const array1 = ['!','@','#','$','%','^','&','*','(',')','-','_','+','=','{','}','[',']','|','\',',':',';','"','>','<','?','`','~','₹'];

      // for(let i=0; i<array1.length ; i++)
      // {


      //   const fv = array1[i];

      //   this.validPattern = addressValue.includes(fv.toString());

      //   this.validPattern=this.validPattern;
      //   if(this.validPattern)
      //   {
      //     break;
      //   }
      //   else{

      //   }




      // }





      // if(this.validPattern)
      // {
      //   this.snackBar.open("Address  wrong format", '',
      //   {
      //     horizontalPosition: 'center',
      //     verticalPosition: 'top',
      //     duration: 3000,
      //     panelClass: 'center'
      //   });



      // }
      //else{

      if ((this.addressValue.valid) && (this.beneficaryValue.valid) && (this.beneficiaryNameValue.valid) && (this.maxLimitValue.valid) && (this.beneficiaryIfscValue.valid) && (this.shortNameValue.valid) && (this.bankNameValue.valid) && (this.branchNameValue.valid)) {

        const minamount = this.request.maxlimit.substring(0, 1);


        if (minamount == 0) {


          this.snackBar.open("Amount invalid", '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 2000,
              panelClass: 'center',
            });



        }
        else {

          const amountMinValue = this.request.maxlimit;

          if (amountMinValue > 100000) {

            this.snackBar.open("Payment can't be more than" + "    " + "₹" + "  " + 1+","+"00" + "," + "000" + ".00", '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 2000,
                panelClass: 'center',
              });
          }
          else {

            this.checkAccount();

          }



        }









      }
      else {

      }

      //}

    }
    else {






    }



  }






  addressValueChange() {

    this.address = false;
    // this.addressValue.reset();

  }

  customerIdValueChange() {
    this.customerId = false;

  }

  beneAcNoValueChange() {
    this.beneficiaryAcNo = false;

  }

  beneNameValueChange() {

    this.beneficiary = false;

  }


  debitAcNoValueChange(number: any) {



    for (let i = 0; i < this.parentMenu.responseContent.length; i++) {

      if (number.value == this.parentMenu.responseContent[i].customerId) {

        this.customerId = number.value;
        this.request.customerIdOfDebitAccount = this.customerId;
        this.request.debitAccountNumber = this.parentMenu.responseContent[i].accNo;




      }

    }






    this.debitAccountNo = false;

  }

  remarksValueChange() {
    this.remarks = false;

  }

  transferTypeValueChange(number: any) {

    this.request.transferType = number.value;
    this.transferType = false;

  }
  maxLimitValueChange() {
    this.maxLimit = false;



  }

  beneIfscValueChange() {
    this.beneficiaryIfsc = false;

  }
  shortNameValueChange() {

    this.shortName = false

  }
  bankNameValueChange() {
    this.bankName = false;
  }
  branchNameValueChange() {

    this.branchName = false;
  }


  letterOnly(event: any) {
    event.target.maxLength = 30;

    var charCode = event.keyCode;
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)
      return true;
    else
      return false;
  }


  onlyNumberKey(event: any) {

    event.target.maxLength = 30;

    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
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
    var specialCharacters: any

    var arrowLeft = 'ArrowLeft';
    var arrowRight = 'ArrowRight';
    var arrowUp = 'ArrowUp';
    var arrowDown = 'ArrowDown';
    var del = 'Delete'



    if (evt.key == arrowUp || evt.key == arrowDown || evt.key == arrowRight || evt.key == arrowRight || evt.key == arrowLeft || slash == evt.key || hypen == evt.key || openBracket == evt.key || closeBracket == evt.key || evt.key == "." || evt.key == "," || evt.key == del) {
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



  checkAccount() {




    //this.request.appID = this.customerId;
    this.request.userIdentification = this.userId;
    this.request.userName = this.userName;

    const ifsc = this.request.beneficiaryIFSC;
    const accno = this.request.beneficiaryAccountNumber;
    this.request.beneficiaryIFSC = ifsc.toUpperCase();
    this.request.beneficiaryAccountNumber = accno.toUpperCase();


    var beneName = this.request.beneficiaryName.replace(/\b\w/g, (x: string) => x.toUpperCase());
    var benenickName = this.request.shortName.replace(/\b\w/g, (x: string) => x.toUpperCase());
    var benebankname = this.request.bankName.replace(/\b\w/g, (x: string) => x.toUpperCase());
    var beneBranchName = this.request.branchName.replace(/\b\w/g, (x: string) => x.toUpperCase());
    var beneAddress = this.request.addressLine.replace(/\b\w/g, (x: string) => x.toUpperCase());

    this.request.beneficiaryName = beneName.trim();
    this.request.shortName = benenickName.trim();
    this.request.bankName = benebankname.trim();
    this.request.branchName = beneBranchName.trim();
    this.request.addressLine = beneAddress.trim();









    const encryptDTO = this.encryptAndDecrypt.encryptfinal(this.request, this.encryptandDecryptkey);

    this.encryptDTOValue.data = encryptDTO;





    this.spinnerService.show();


    this.service.beneficiaryAccountCheck(this.encryptDTOValue).subscribe(response => {


      const checkAccResponse = this.encryptAndDecrypt.decryptfinal(response.data, this.encryptandDecryptkey);


      this.checkAccMenu = JSON.parse(checkAccResponse);

      this.spinnerService.hide();



      if (this.checkAccMenu.message == "success") {

        // this.snackBar.open("Account details added successful", '',
        //   {
        //     horizontalPosition: 'center',
        //     verticalPosition: 'top',
        //     duration: 3000,
        //     panelClass: 'center'
        //   });
        this.generateotp();

      }
      else {


        if (this.checkAccMenu.message == "pending") {

          this.snackBar.open("Request is pending", '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center'
            });


        }
        else if (this.checkAccMenu.message == "UnderProcessing") {

          this.snackBar.open("Request is pending", '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center'
            });


        }


        else {

          if (this.checkAccMenu.message == "Account already exists") {
            this.snackBar.open(this.checkAccMenu.message, '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center'
              });

          }



        }




      }

    })
  }






  generateotp() {



    this.request.userIdentification = this.signInNavResponse.responseContent.id;
    this.request.userName = this.signInNavResponse.responseContent.username;
    this.request.mobileNumber = this.signInNavResponse.responseContent.mobileNo;



    const otpGenerate = this.encryptAndDecrypt.encryptfinal(this.request, this.encryptandDecryptkey);

    this.encryptDTOValue.data = otpGenerate;

    this.service.otpGeneration(this.encryptDTOValue).subscribe(dataResponse => {



      const otpDecryptResposne = this.encryptAndDecrypt.decryptfinal(dataResponse.data, this.encryptandDecryptkey);

      this.parentMenu = JSON.parse(otpDecryptResposne);

      if (this.parentMenu.statusCode == 200) {



        this.message = this.parentMenu.message;

        this.snackBar.open(this.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 2500,
            panelClass: 'center'
          });
        this.spinnerService.show();

        setTimeout(() => {

          this.spinnerService.hide();
          const dialogRef = this.matDialog.open(AddAccountPopUpComponentComponent,
            {

              autoFocus: false,
              width: '380px',
              // height: '510px',
              data: { BeneAccInfo: this.request }

            });

        }, 2600);




        // const dialogRef = this.dialog.open(ParentMenuDeletePopupComponent, {
        //   width: '400px',
        //   autoFocus: false,


        // })

        //   this.service.beneficiaryAddMethod(this.request).subscribe(response=>
        //     {

        //       this.addAccountResponse = response;
        //       this.message = this.addAccountResponse.message;

        //       this.spinnerService.hide();

        //     if(this.addAccountResponse.statusCode == 200)
        //     {
        //     this.snackBar.open(this.message, '',
        //   {
        //     horizontalPosition: 'center',
        //     verticalPosition: 'top',
        //     duration: 3000,
        //     panelClass: 'center'
        //   });
        //   this.reloadCurrentRoute();
        // }
        //     })

      }
      else {
        this.spinnerService.hide();

        this.snackBar.open(this.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center'
          });


      }

    }
    )

  }


  getIFSCError() {
    if (this.beneficiaryIfscValue.hasError('required')) {
      return ' Beneficiary IFSC is required';
    }
    return this.beneficiaryIfscValue.hasError('pattern') ? 'Enter valid IFSC ' : '';
  }


  getValue() {
    this.accountNumber();
  }


  onBlur(): void {
    this.beneficiaryIfscValue.markAsUntouched();

  }

}