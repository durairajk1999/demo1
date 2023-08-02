import { formatNumber } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServicesService } from 'src/app/services.service';

@Component({
  selector: 'app-merchantpop-up-view',
  templateUrl: './merchantpop-up-view.component.html',
  styleUrls: ['./merchantpop-up-view.component.scss']
})
export class MerchantpopUpViewComponent implements OnInit {


  amt!: string;
  constructor(private snackBar: MatSnackBar,public dialogRef: MatDialogRef<MerchantpopUpViewComponent>, private cdref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: ServicesService) {

      this.dialogRef.disableClose=true;

     

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


      this.snackBar.open(data.merchantinfo.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',
          }
        )

     }



  ngOnInit(): void {
  }


  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }
}
