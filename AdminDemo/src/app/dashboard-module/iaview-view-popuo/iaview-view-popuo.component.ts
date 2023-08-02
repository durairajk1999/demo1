import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServicesService } from 'src/app/services.service';

@Component({
  selector: 'app-iaview-view-popuo',
  templateUrl: './iaview-view-popuo.component.html',
  styleUrls: ['./iaview-view-popuo.component.scss']
})
export class IaviewViewPopuoComponent implements OnInit {
  message = '';

  constructor(public dialogRef: MatDialogRef<IaviewViewPopuoComponent>,private cdref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: ServicesService) {

      this.dialogRef.disableClose=true;


     }

  ngOnInit(): void {
  }
  ngAfterContentChecked() {
    
    this.cdref.detectChanges();
 }
}