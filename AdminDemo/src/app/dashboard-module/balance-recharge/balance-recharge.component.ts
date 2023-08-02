import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { RechargeResponse } from 'src/app/recharge-response';
import { formatNumber } from '@angular/common';

import { RechargeResponseContent } from 'src/app/recharge-response-content';
import { ServicesService } from 'src/app/services.service';
import { EncryptAndDecryptResponse } from 'src/app/encrypt-and-decrypt-response';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';

@Component({
  selector: 'app-balance-recharge',
  templateUrl: './balance-recharge.component.html',
  styleUrls: ['./balance-recharge.component.scss']
})
export class BalanceRechargeComponent implements OnInit {

  constructor(private service: ServicesService, private cdref: ChangeDetectorRef, private spinnerService: NgxSpinnerService, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  Balance !: string;

  rechargeResponse !: RechargeResponse;
  rechargeResponseContent !: RechargeResponseContent;

  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  encryptKeyValue!: string;

  ngOnInit(): void {
    this.spinnerService.show();

    this.service.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;
      const keyValue1 = keys.split("//");
      const firstDecrypt = this.encryptAndDecrypt.decryptfinal(keyValue1[1].trim(), keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      const finalkeyValue1 = finalkeyValue;

      this.encryptKeyValue = finalkeyValue1[2].trim();

      if (this.encryptKeyValue != "" || this.encryptKeyValue != null) {
        this.getValue(this.encryptKeyValue);
      }
    });


  }

  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }

  getValue(key: string) {






    this.service.getRechargeBalance().subscribe(data => {
      this.spinnerService.hide();





      const decryptResposne = this.encryptAndDecrypt.decryptfinal(data.data, key);


      this.rechargeResponse = JSON.parse(decryptResposne);
      console.log(this.rechargeResponse);
      this.rechargeResponseContent = this.rechargeResponse.responseContent;

      if (this.rechargeResponse.responseContent == null) {

        this.snackBar.open("Record not found", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });

      }

      else {

        // this.snackBar.open("Data fetched successfully",'' ,
        // {
        // horizontalPosition:'center',
        // verticalPosition:'top',
        // duration: 3000,
        // panelClass: 'center',


        // });

        var blsAmount = this.rechargeResponseContent.Balance;
        var numberValue = Number(blsAmount);


        let formatAmo = formatNumber(numberValue, 'en-US',
          '1.2');
        var wholeAmo = formatAmo.replace(/,/g, "")
        var deciAmo = Number(wholeAmo)
        var conv = deciAmo.toLocaleString('en-IN', {
          minimumFractionDigits: 2, maximumFractionDigits: 2
        })
        // let num = numberValue;
        // let Amount = num.toLocaleString("en-IN");

        this.Balance = conv;




        // this.balance = this.rechargeResponseContent.balance =Amount;

      }



    });
  }
}
