import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EncryptAndDecryptResponse } from 'src/app/encrypt-and-decrypt-response';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';


import { Global } from 'src/app/globalComponent/Global';
import { ServicesService } from 'src/app/services.service';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';

@Component({
  selector: 'app-group-delete-popup',
  templateUrl: './group-delete-popup.component.html',
  styleUrls: ['./group-delete-popup.component.scss']
})
export class GroupDeletePopupComponent implements OnInit {

  signInNavResponse: SignInNavResponse = new SignInNavResponse();

  encryptandDecryptkey!:string;

  encryptAndDecrypt:EncryptionAndDecryption = new EncryptionAndDecryption();

  //encryptAndDecrypt : EncryptionAndDecryption = new EncryptionAndDecryption();
  encryptAndDecryptRespose : EncryptAndDecryptResponse = new EncryptAndDecryptResponse();

  constructor(public dialogRef: MatDialogRef<GroupDeletePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: ServicesService,private cdref: ChangeDetectorRef, private snackBar: MatSnackBar,private spinnerService: NgxSpinnerService , private router:Router)
     { 

      this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');

     }

deletedId!:number;

userName =Global.userName;

onNoClick(): void {
this.dialogRef.close();
}
ngAfterContentChecked() {
    
  this.cdref.detectChanges();
}
confirmDelete(): void 
{

 

  this.spinnerService.show();

  const userDetails = this.data.roleGroupId+","+this.signInNavResponse.responseContent.username;

const encryptData = this.encryptAndDecrypt.encryptfinal(userDetails,this.encryptandDecryptkey);


this.dataService.deleteIssue(encryptData).subscribe(response=>
  {


    const decryptData = this.encryptAndDecrypt.decryptfinal(response.data,this.encryptandDecryptkey);

    this.encryptAndDecryptRespose = JSON.parse(decryptData);
    this.spinnerService.hide();

    if(this.encryptAndDecryptRespose.statusCode == "200")
    {

      
    this.snackBar.open(this.encryptAndDecryptRespose.message,'' ,
    {
    horizontalPosition:'center',
    verticalPosition:'top',
    duration: 3000,
    panelClass: 'center',
    
    
    });

    this.onNoClick();

   // this.reloadCurrentRoute();

    }

    else{

      
    this.snackBar.open(this.encryptAndDecryptRespose.message,'' ,
    {
    horizontalPosition:'center',
    verticalPosition:'top',
    duration: 3000,
    panelClass: 'center',
    
    
    });

    this.onNoClick();
    //this.reloadCurrentRoute();

    }

  })
}
  ngOnInit(): void {

    


    this.dataService.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;
      const keyValue1 = keys.split("//");
      const firstDecrypt = this.encryptAndDecrypt.decryptfinal(keyValue1[1].trim(),keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      const finalkeyValue1 = finalkeyValue;

      this.encryptandDecryptkey = finalkeyValue1[0].trim();

      
    });


    
    



    

  }





  
 reloadCurrentRoute() {
  let currentUrl = this.router.url;
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentUrl]);
  });
}
}