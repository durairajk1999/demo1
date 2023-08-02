import { formatNumber } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServicesService } from 'src/app/services.service';

@Component({
  selector: 'app-merchant-top-up-confirmation',
  templateUrl: './merchant-top-up-confirmation.component.html',
  styleUrls: ['./merchant-top-up-confirmation.component.scss']
})
export class MerchantTopUpConfirmationComponent implements OnInit {



  
  amt!: string;

  constructor(private snackBar: MatSnackBar, public dialogRef: MatDialogRef<MerchantTopUpConfirmationComponent>, private cdref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: ServicesService) {

    this.dialogRef.disableClose = true;

    




    var stringToConvert = data.merchantinfo.amount;
    var numberValue = Number(stringToConvert);

    let formatAmo = formatNumber(numberValue, 'en-US',
      '1.2');
    var wholeAmo = formatAmo.replace(/,/g, "")
    var deciAmo = Number(wholeAmo)
    var conv = deciAmo.toLocaleString('en-IN', {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    })


    this.amt = conv;


    // this.snackBar.open(data.merchantinfo.message, '',
    //     {
    //       horizontalPosition: 'center',
    //       verticalPosition: 'top',
    //       duration: 3000,
    //       panelClass: 'center',
    //     }
    //   )

  }



  ngOnInit(): void {
  }


  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }


  onNoClick(): void {
    this.dialogRef.close(false);

    //this.reloadCurrentRoute();
  }

  submit(): void {
    this.dialogRef.close(true);

    //this.reloadCurrentRoute();
  }

}

