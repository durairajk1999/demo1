import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-beneficiary-info-popup',
  templateUrl: './beneficiary-info-popup.component.html',
  styleUrls: ['./beneficiary-info-popup.component.scss']
})
export class BeneficiaryInfoPopupComponent implements OnInit {

  request: any;
  parentMenu: any;




  constructor(public dialogRef: MatDialogRef<BeneficiaryInfoPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {



    this.request = data.viewBeneDetails;
    this.parentMenu = JSON.parse(data.BeneDetails);




  }

  ngOnInit(): void {


  }
  cancel() {
    this.dialogRef.close(true);
  }
}