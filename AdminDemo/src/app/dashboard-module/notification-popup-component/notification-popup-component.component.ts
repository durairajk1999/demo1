import { Component, OnInit ,Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ServicesService } from 'src/app/services.service';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';
import { StatusUpdateRequest } from '../notify-component/StatusUpdateRequest';

@Component({
  selector: 'app-notification-popup-component',
  templateUrl: './notification-popup-component.component.html',
  styleUrls: ['./notification-popup-component.component.scss']
})
export class NotificationPopupComponentComponent implements OnInit {

  message:any;
  userId:any;
  accountNo:any;
  statusRange:any;

  request : StatusUpdateRequest = new  StatusUpdateRequest();
  
 signInNavResponse: SignInNavResponse = new SignInNavResponse();

 constructor(@Inject(MAT_DIALOG_DATA) private data: any,private service : ServicesService,private snackBar:MatSnackBar,private route:Router,private dialogRef: MatDialogRef<NotificationPopupComponentComponent>) { }

 
 reloadCurrentRoute() {
   let currentUrl = this.route.url;
   this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
     this.route.navigate([currentUrl]);
   });
 }

 ngOnInit(): void {
   this.message = this.data.message;
   this.userId = this.data.user;
   this.accountNo = this.data.accountNumber;
   this.statusRange = this.data.statusValue;

   
 }

 onConfirmClick(): void {
  this.dialogRef.close(true);
   
 }

 onNoClick(){

  this.dialogRef.close(false);
     

 }


}