import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NgxSpinnerService } from 'ngx-spinner';
import { BalanceResponse } from 'src/app/balance-response';
import { Ftbalance } from 'src/app/ftbalance';
import { FtbalanceDublicateResponse } from 'src/app/ftbalance-dublicate-response';
import { FundsAvailableResult } from 'src/app/funds-available-result';
import { ParentMenus } from 'src/app/parent-menus';
import { ServicesService } from 'src/app/services.service';

import * as CryptoJS from 'crypto-js';
import { Cipher } from 'crypto';
import { Observable, fromEvent } from 'rxjs';
import { map, filter, debounceTime } from 'rxjs/operators';
import { AES, enc } from 'crypto-js';
import { formatNumber } from '@angular/common';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';
import { coerceStringArray } from '@angular/cdk/coercion';
import { EncryptAndDecryptServiceold } from 'src/app/encrypt-and-decrypt.service';
import { EncryptionDTO } from 'src/app/encryption-dto';





@Component({
  selector: 'app-balance-ft',
  templateUrl: './balance-ft.component.html',
  styleUrls: ['./balance-ft.component.scss']
})
export class BalanceFtComponent implements OnInit {






  encryptandDecryptkey!: string;
  ftencryptKey!: string;

  balanceResponse: BalanceResponse = new BalanceResponse();

  parentMenu: ParentMenus = new ParentMenus();
  parentMenu2: ParentMenus[] = [];

  b!: Number;

  finalkeyValue1!: string;
  keyValue1!: string;

  encryptionAndDecryption: EncryptionAndDecryption = new EncryptionAndDecryption();

  ft: EncryptAndDecryptServiceold = new EncryptAndDecryptServiceold();

  encryptDTO: EncryptionDTO = new EncryptionDTO();

  accountnumberlist1: Record<any, any>[] = this.parentMenu2;
  accountnumberlist2: Record<any, any>[] = this.parentMenu2;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;



  encrypted: any = '';

  accountnumbervalue!: boolean;

  constructor(private service: ServicesService, private cdref: ChangeDetectorRef, private spinnerService: NgxSpinnerService, public dialog: MatDialog, private snackBar: MatSnackBar) {






  }
  ngOnInit() {
    

    this.getkey();





    // this.display();
  }
  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }















  ftBalanceForm!: FormGroup;
  ftBalance: Ftbalance = new Ftbalance();
  ftdublicateResponse: FtbalanceDublicateResponse = new FtbalanceDublicateResponse();
  selectedCustomerID = "";
  selectedAccountNumberValue = "";
  balanceList: FundsAvailableResult[] = [];
  // balanceResponse : BalanceResponseContent = new BalanceResponseContent(); 
  hideRequiredMarker = "true"
  toDisplay = false;
  toggleData() {
    // this.toDisplay = true;
    // this.toDisplay = !this.toDisplay;
  }
  getBalance() {
    this.toDisplay = false;
    this.balanceList = [];
    this.ftBalance.customerID = this.selectedCustomerID;
    //this.ftBalance.accountNumber= this.selectedAccountNumberValue;
    this.ftdublicateResponse.customerID = this.selectedCustomerID;
    this.ftdublicateResponse.accountNumber = this.selectedAccountNumberValue;
    if (this.selectedAccountNumberValue == null || this.selectedAccountNumberValue == "") {
      this.accountnumbervalue = true;
    }
    else {
      //this.balanceList=[];
      this.spinnerService.show();

      


      const encryptData = this.encryptionAndDecryption.encryptfinal(this.ftdublicateResponse, this.ftencryptKey);
      this.encryptDTO.data = encryptData;
      this.service.getBalance(this.encryptDTO).subscribe(balance => {


        const decryptData = this.encryptionAndDecryption.decryptfinal(balance.data, this.ftencryptKey);

       
        this.spinnerService.hide();



        this.balanceResponse = JSON.parse(decryptData);

    

        if (this.balanceResponse.responseContent.Data.FundsAvailableResult != null) {

          var stringToConvert = this.balanceResponse.responseContent.Data.FundsAvailableResult.BalanceAmount;
          var numberValue = Number(stringToConvert);

          let formatAmo = formatNumber(numberValue, 'en-US',
            '1.2');
          var wholeAmo = formatAmo.replace(/,/g, "")
          var deciAmo = Number(wholeAmo)
          var conv = deciAmo.toLocaleString('en-IN', {
            minimumFractionDigits: 2, maximumFractionDigits: 2
          })
          // let num = numberValue;
          // let Amount = num.toLocaleString("en-IN");

          this.balanceResponse.responseContent.Data.FundsAvailableResult.BalanceAmount = conv;

          this.balanceResponse.responseContent.Data.FundsAvailableResult = this.balanceResponse.responseContent.Data.FundsAvailableResult;
          this.balanceList.push(this.balanceResponse.responseContent.Data.FundsAvailableResult);

          this.toDisplay = true;





        }



        else {


          this.snackBar.open("Record not found", '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',


            });





        }
        // this.balanceResponse.responseContent.data.fundsAvailableResult = this.balanceResponse.responseContent.data.fundsAvailableResult;
        // this.balanceList.push(this.balanceResponse.responseContent.data.fundsAvailableResult);
        // this.toDisplay = true;
      })
    }
  }
  ftAccountNumberSelect() {



   

    this.service.fetchAccountNumber().subscribe(accountnumberDetails => {

      const encryptData = this.encryptionAndDecryption.decryptfinal(accountnumberDetails.data, this.encryptandDecryptkey);



      this.parentMenu = JSON.parse(encryptData);

      this.accountnumberlist1 = this.parentMenu.responseContent;
      this.accountnumberlist2 = this.parentMenu.responseContent;
    })
  }


  selectedAccountNumber(AccNo: string) {


    this.balanceList = [];
    this.toDisplay = false;
    this.accountnumbervalue = false;
    this.selectedCustomerID = AccNo;
    for (let i = 0; i < this.parentMenu.responseContent.length; i++) {
      if (this.parentMenu.responseContent[i].customerId == this.selectedCustomerID) {
        this.selectedAccountNumberValue = this.parentMenu.responseContent[i].accNo;
      }
      else {
      }
    }
  }


  onlyNumberKey(event: any) {

    event.target.maxLength = 30;
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }




  getkey() {


    this.service.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;

      
      this.keyValue1 = keys.split("//");
      const firstDecrypt = this.encryptionAndDecryption.decryptfinal(this.keyValue1[1].trim(), this.keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      this.finalkeyValue1 = finalkeyValue;



      this.encryptandDecryptkey = this.finalkeyValue1[0].trim();
      this.ftencryptKey = this.finalkeyValue1[1].trim();
      this.accountnumbervalue = false;
      this.ftAccountNumberSelect();


    });



  }







}































