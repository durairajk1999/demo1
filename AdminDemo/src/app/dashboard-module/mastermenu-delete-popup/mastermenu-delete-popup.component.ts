import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EncryptAndDecryptResponse } from 'src/app/encrypt-and-decrypt-response';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';


import { ServicesService } from 'src/app/services.service';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';

@Component({
  selector: 'app-mastermenu-delete-popup',
  templateUrl: './mastermenu-delete-popup.component.html',
  styleUrls: ['./mastermenu-delete-popup.component.scss']
})
export class MastermenuDeletePopupComponent implements OnInit {

  signInNavResponse: SignInNavResponse = new SignInNavResponse();

  //encryptAndDecrypt : EncryptionAndDecryption = new EncryptionAndDecryption();

  encryptandDecryptResponse: EncryptAndDecryptResponse = new EncryptAndDecryptResponse();

  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();
  encryptandDecryptkey!: string;

  constructor(public dialogRef: MatDialogRef<MastermenuDeletePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: ServicesService, private cdref: ChangeDetectorRef, private snackBar: MatSnackBar, private spinnerService: NgxSpinnerService, private router: Router) {

    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');

    
    
  }

  deletedId!: number;

  onNoClick(): void {
    this.dialogRef.close();
    // this.reloadCurrentRoute();



  }

  confirmDelete(): void {




    this.spinnerService.show();

    const userDetails = this.data.masterMenuId + " " + this.signInNavResponse.responseContent.username;

    const encryptData = this.encryptAndDecrypt.encryptfinal(userDetails, this.encryptandDecryptkey);

    this.dataService.masterMenuDelete(encryptData).subscribe(response => {

      const decryptData = this.encryptAndDecrypt.decryptfinal(response.data, this.encryptandDecryptkey);


      this.encryptandDecryptResponse = JSON.parse(decryptData);

      this.spinnerService.hide();



      if (this.encryptandDecryptResponse.statusCode == "200") {


        this.snackBar.open(this.encryptandDecryptResponse.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });

        this.onNoClick()
      }

      else {


        this.snackBar.open(this.encryptandDecryptResponse.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });

      }

    })
  }
  ngOnInit(): void {



    this.dataService.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;
      const keyValue1 = keys.split("//");
      const firstDecrypt = this.encryptAndDecrypt.decryptfinal(keyValue1[1].trim(), keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      const finalkeyValue1 = finalkeyValue;

      this.encryptandDecryptkey = finalkeyValue1[0].trim();

      // if (this.encryptandDecryptkey != null || this.encryptandDecryptkey != "") {
      //   this.getValue(this.encryptandDecryptkey);
      // }

    });


    
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