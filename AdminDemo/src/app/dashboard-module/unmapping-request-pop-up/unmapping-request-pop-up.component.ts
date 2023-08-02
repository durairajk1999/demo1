import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { strings } from '@material/select/helper-text/constants';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServicesService } from 'src/app/services.service';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';
import { RoleDeletePopupComponent } from '../role-delete-popup/role-delete-popup.component';

@Component({
  selector: 'app-unmapping-request-pop-up',
  templateUrl: './unmapping-request-pop-up.component.html',
  styleUrls: ['./unmapping-request-pop-up.component.scss']
})
export class UnmappingRequestPopUpComponent implements OnInit {

  signInNavResponse: SignInNavResponse = new SignInNavResponse();
  


  
  constructor(public dialogRef: MatDialogRef<RoleDeletePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: ServicesService ,private cdref: ChangeDetectorRef, public Service: ServicesService,private snackBar: MatSnackBar,private spinnerService: NgxSpinnerService , private router:Router ) 
    {
      this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');



     }



onNoClick(): void {
this.dialogRef.close();

//this.reloadCurrentRoute();
}

confirmDelete():void
{

 

  this.dialogRef.close(true);
 }
  


  ngOnInit(): void {
  }
  ngAfterContentChecked() {
    
    this.cdref.detectChanges();
 }


   
 reloadCurrentRoute() {
  let currentUrl = this.router.url;
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentUrl]);
  });
}















}
