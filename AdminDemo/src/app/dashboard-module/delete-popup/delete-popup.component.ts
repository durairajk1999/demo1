import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';


import { ServicesService } from 'src/app/services.service';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.scss']
})
export class DeletePopupComponent implements OnInit 
{

  encryptandDecryptkey!:string;
  encryptAndDecrypt:EncryptionAndDecryption = new EncryptionAndDecryption();

  constructor(public dialogRef: MatDialogRef<DeletePopupComponent>,private cdref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any, public dataService: ServicesService) { }

deletedId!:number;
signInNavResponse: SignInNavResponse = new SignInNavResponse();
//encryptAnddecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();


keyValue1!:string;

finalkeyValue1!:string;

onNoClick(): void {
this.dialogRef.close();
}

confirmDelete(): void 
{


  this.deletedId = this.data.roleGroupId

  const userDetails= this.deletedId+" "+this.signInNavResponse.responseContent.username;
  
 const encryptData= this.encryptAndDecrypt.encryptfinal(userDetails,this.encryptandDecryptkey);

 //const encodeValu = encodeURIComponent(encryptData);

this.dataService.deleteIssue(encryptData).subscribe(response=>
  {
  
  })
}
  ngOnInit(): void {

   

    this.dataService.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;
      this.keyValue1 = keys.split("//");
      const firstDecrypt = this.encryptAndDecrypt.decryptfinal(this.keyValue1[1].trim(), this.keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      this.finalkeyValue1 = finalkeyValue;

      this.encryptandDecryptkey = this.finalkeyValue1[0].trim();

     
    });

this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');


  }
  ngAfterContentChecked() {
    
    this.cdref.detectChanges();
 }
}