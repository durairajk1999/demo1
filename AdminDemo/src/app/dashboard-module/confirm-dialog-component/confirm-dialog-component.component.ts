import { Component, OnInit,Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA ,MatDialog} from '@angular/material/dialog';




@Component({
  selector: 'app-confirm-dialog-component',
  templateUrl: './confirm-dialog-component.component.html',
  styleUrls: ['./confirm-dialog-component.component.scss']
})
export class ConfirmDialogComponentComponent implements OnInit {

  message: string = "Are you sure want to close ?"
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,private cdref: ChangeDetectorRef,
  private dialogRef: MatDialogRef<ConfirmDialogComponentComponent>) { }

  ngOnInit(): void {
  }
  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
  ngAfterContentChecked() {
    
    this.cdref.detectChanges();
 }
  onNoClick(): void {

    this.dialogRef.close();
  }
}