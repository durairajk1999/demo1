import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServicesService } from 'src/app/services.service';
import { PaymentReportComponent } from '../payment-report/payment-report.component';


@Component({
  selector: 'app-report-popup',
  templateUrl: './report-popup.component.html',
  styleUrls: ['./report-popup.component.scss']
})
export class ReportPopupComponent implements OnInit {

  message = '';

  constructor(public dialogRef: MatDialogRef<PaymentReportComponent>,private cdref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: ServicesService) { }

  ngOnInit(): void {
  }
  ngAfterContentChecked() {
    
    this.cdref.detectChanges(); 
 }

}
