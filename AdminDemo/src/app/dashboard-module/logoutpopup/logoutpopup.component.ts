import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServicesService } from 'src/app/services.service';

@Component({
  selector: 'app-logoutpopup',
  templateUrl: './logoutpopup.component.html',
  styleUrls: ['./logoutpopup.component.scss']
})
export class LogoutpopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LogoutpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public Service: ServicesService,private cdref: ChangeDetectorRef,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }
onNoClick(): void {
    this.dialogRef.close();
 
    // this.reloadCurrentRoute();
  }
  ngAfterContentChecked() {
    
    this.cdref.detectChanges();
 }
  ProfileLogOut(){
    this.dialogRef.close(true);
  }
}
