import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServicesService } from 'src/app/services.service';
import { BeneficiaryAccountDetailsComponent } from '../beneficiary-account-details/beneficiary-account-details.component';


@Component({
  selector: 'app-account-details-view-popup',
  templateUrl: './account-details-view-popup.component.html',
  styleUrls: ['./account-details-view-popup.component.scss']
})
export class AccountDetailsViewPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<BeneficiaryAccountDetailsComponent>,private cdref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: ServicesService) { }

  ngOnInit(): void {
  }

  ngAfterContentChecked() {
    
    this.cdref.detectChanges(); 
 }

}
