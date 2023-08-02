import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
//import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { Bankbranchaddition } from 'src/app/bankbranchaddition';
import { ServicesService } from 'src/app/services.service';
import { State } from 'src/app/state-details';
import { StatedetailsResult } from 'src/app/statedetails-result';
//import { SnackbarMessageComponent } from '../snackbar-message/snackbar-message.component';


@Component({
  selector: 'app-bank-branch-addition',
  templateUrl: './bank-branch-addition.component.html',
  styleUrls: ['./bank-branch-addition.component.scss']
})
export class BankBranchAdditionComponent implements OnInit {
  branchMessage!: string;

  constructor(private service: ServicesService,private cdref: ChangeDetectorRef, private snackBar: MatSnackBar, private router: Router, private spinnerService: NgxSpinnerService) { }

  hideRequiredMarker = true;
  selectedBankType: any;

  selectedStateName = "";
  selectedDistrictName = "";
  selectedBankName = "";

  durationInSeconds = 5;
  // message = "Success";
  // error = "Failed to create"
  stateValue!: boolean
  districtValue!: boolean
  bankNameValue!: boolean
  bankTypeValue!: boolean
  branchValue!: boolean
  ifscValue!: boolean


  stateNameSelect = "";
  districtNameSelect = "";
  bankTypeSelect = "";
  bankNameSelct = "";


  credential: StatedetailsResult = new StatedetailsResult();

  stateDetails: State = new State();

  stateList: StatedetailsResult[] = [];


  statelist1: Record<any, any>[] = this.stateList;
  statelist2: Record<any, any>[] = this.stateList;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;







  districtDetails: State = new State();

  districtList: StatedetailsResult[] = [];

  //district

  districtlist1: Record<any, any>[] = this.districtList;
  districtlist2: Record<any, any>[] = this.districtList;


  bankTypeDetails: State = new State();

  bankTypeList: StatedetailsResult[] = [];

  // bank type 
  banktypelist1: Record<any, any>[] = this.bankTypeList;
  banktypelist2: Record<any, any>[] = this.bankTypeList;

  bankNameDetails: State = new State();


  bankNameList: StatedetailsResult[] = [];

  //bank 
  banklist1: Record<any, any>[] = this.bankNameList;
  banklist2: Record<any, any>[] = this.bankNameList;

  bankbranchaddition: Bankbranchaddition = new Bankbranchaddition();

  stateName = new FormControl();
  districtName = new FormControl();
  banktype = new FormControl();
  // bankName = new FormControl('', [Validators.required]);
  bank = new FormControl();


  branchName = new FormControl();
  
  //ifsc = new FormControl('', { validators: [Validators.required, Validators.pattern("^[A-Z_a-z]{4}0[A-Z0-9a-z]{6}$")] });


  ifsc = new FormControl('', { validators: [Validators.required, Validators.pattern("^[A-Z_a-z]{4}0[A-Z0-9a-z]{6}$")] });



  ngOnInit(): void {
    // this.stateName.setErrors({'required':false})

    this.stateValue = false
    this.districtValue = false
    this.bankNameValue = false
    this.bankTypeValue = false
    this.branchValue = false
    this.ifscValue = false
    this.getStateList();
    // this.getBankType();
  }
  onBlur(): void {
    this.stateName.markAsUntouched();
    this.districtName.markAsUntouched();
    this.banktype.markAsUntouched();
    this.bank.markAsUntouched();

    this.branchName.markAsUntouched();
    this.ifsc.markAsUntouched();
    //this.contactNumber.markAsUntouched();
  }
  ngAfterContentChecked() {
    
    this.cdref.detectChanges();
 }
  ifscChange() {
    this.ifscValue = false
  }

  branchChange() {
    this.branchValue = false
  }

  getStateList() {
    this.service.getStateService().subscribe(stateNameList => {

      this.stateDetails = stateNameList;
      this.stateList = this.stateDetails.result;

      this.statelist1 = this.stateList;
      this.statelist2 = this.stateList;

    });
  }

  getDistrictName(stateName: string) {
    // this.banktype.reset();

    // this.bank.reset();


    this.stateNameSelect = stateName;
    this.districtNameSelect = "";
    this.bankTypeSelect = "";
    this.bankNameSelct = "";


    this.districtlist1 = [];
    this.districtlist2 = [];

    this.banktypelist1 = [];
    this.banktypelist2 = [];

    this.banklist1 = [];
    this.banklist2 = [];






    this.districtName.reset()
    this.banktype.reset();
    this.bank.reset();
    this.selectedStateName = stateName;
    this.stateValue = false

    this.selectedDistrictName = "";
    // this.credential.district_name = "";
    this.selectedBankType = "";
    this.selectedBankName = "";
    this.service.districtNameFetch(stateName).subscribe(districtNameList => {

      this.districtDetails = districtNameList;
      this.districtList = this.districtDetails.result;
      if (this.districtList.length <= 0) {
        this.snackBar.open('District not found', '', {

          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          // panelClass: ['blue-snackbar']
          panelClass: 'center',
        });
      }

      this.districtlist1 = this.districtList;
      this.districtlist2 = this.districtList;

    })
  }

  // selectDistrictName(districtName: any) {
  //   this.selectedDistrictName = districtName
  //   this.districtValue = false
  // }

  getBankType(districtName: any) {



    this.banktypelist1 = [];
    this.banktypelist2 = [];

    this.banklist1 = [];
    this.banklist2 = [];


    this.districtNameSelect = districtName;
    this.bankTypeSelect = "";
    this.bankNameSelct = "";


    this.banktype.reset();
    this.bank.reset();
    this.selectedDistrictName = districtName;
    this.selectedBankType = "";
    this.selectedBankName = "";
    this.districtValue = false
    this.service.getBankType(this.selectedStateName, districtName).subscribe(bankType => {

      this.bankTypeDetails = bankType;
      this.bankTypeList = this.bankTypeDetails.result;
      if (this.bankTypeList.length <= 0) {
        this.snackBar.open('Bank type not found', '', {

          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          // panelClass: ['blue-snackbar']
          panelClass: 'center',
        });
      }
      this.banktypelist1 = this.bankTypeList;
      this.banktypelist2 = this.bankTypeList;

    });
  }

  getBankName(type: any) {





    this.banklist1 = [];
    this.banklist2 = [];

    this.bankTypeSelect = type;
    this.bankNameSelct = "";

    this.bank.reset();
    this.selectedBankType = type;
    this.bankTypeValue = false
    this.selectedBankName = "";
    this.credential.bank = "";
    this.service.getBankName(this.selectedStateName, this.selectedDistrictName, type).subscribe(bankName => {

      this.bankNameDetails = bankName;
      this.bankNameList = this.bankNameDetails.result;
      if (this.bankNameList.length <= 0) {
        this.snackBar.open('Bank not found', '', {

          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          // panelClass: ['blue-snackbar']
          panelClass: 'center',


        });
      }
      this.banklist1 = this.bankNameList;
      this.banklist2 = this.bankNameList;

      this.branchMessage = this.bankNameDetails.message;
    });
  }

  selectBankName(bankName: string) {
    this.selectedBankName = bankName;
    this.bankNameValue = false

    this.bankNameSelct = bankName;
  }



  //refresh
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  // getMobileError() {
  //   if (this.contactNumber.hasError('required')) {
  //     return 'Contact Number is required';
  //   }
  //   return this.contactNumber.hasError('pattern') ? 'Enter valid Contact Number' : '';
  // }
  getIFSCError() {
    if (this.ifsc.hasError('required')) {
      return 'IFSC is required';
    }
    return this.ifsc.hasError('pattern') ? 'Enter valid IFSC' : '';


    // Enter valid IFSC
  }


  submit() {

    if ((this.selectedStateName == "" || this.selectedStateName == null) && (this.selectedDistrictName == "" || this.selectedDistrictName == null)
      && (this.selectedBankType == "" || this.selectedBankType == null) &&
      (this.selectedBankName == "" || this.selectedBankName == null) && (this.bankbranchaddition.brancH_NAME == "" || this.bankbranchaddition.brancH_NAME == null)
      && (this.bankbranchaddition.ifsC_CODE == "" || this.bankbranchaddition.ifsC_CODE == null) && (this.bankbranchaddition.contact == "" || this.bankbranchaddition.contact == null)
    ) {
      this.stateValue = true
      this.districtValue = true
      this.bankNameValue = true
      this.bankTypeValue = true
      this.branchValue = true
      this.ifscValue = true
    }
    // else if ((this.selectedStateName == "" || this.selectedStateName == null) && (this.selectedDistrictName == "" || this.selectedDistrictName == null)
    //   && (this.selectedBankType == "" || this.selectedBankType == null) &&
    //   (this.selectedBankName == "" || this.selectedBankName == null) && (this.bankbranchaddition.ifsC_CODE == "" || this.bankbranchaddition.ifsC_CODE == null)
    //   && (this.bankbranchaddition.brancH_NAME == "" || this.bankbranchaddition.brancH_NAME == null)) {
    //   this.stateValue = true
    //   this.districtValue = true
    //   this.bankNameValue = true
    //   this.bankTypeValue = true
    
    // }

    else if ((this.selectedStateName == "" || this.selectedStateName == null) && (this.selectedBankType == "" || this.selectedBankType == null)) {
      this.stateValue = true
      this.districtValue = true
      this.bankNameValue = true
      this.bankTypeValue = true
      if ((this.bankbranchaddition.brancH_NAME == "" || this.bankbranchaddition.brancH_NAME == null)) {
        this.branchValue = true
        this.ifscValue = false
      }
      else if ((this.bankbranchaddition.ifsC_CODE == "" || this.bankbranchaddition.ifsC_CODE == null)) {
        this.ifscValue = true
        this.branchValue = false
      }
      else {
        
      }

    }
    else if (this.selectedStateName == "" || this.selectedStateName == null) {
      this.stateValue = true
      this.districtValue = true
      if (this.selectedBankType == "" || this.selectedBankType == null) {
        this.bankTypeValue = true
        this.bankNameValue = true
      }
      if (this.selectedBankName == "" || this.selectedBankName == null) {
        this.bankTypeValue = false
        this.bankNameValue = true
      }
      if ((this.bankbranchaddition.brancH_NAME == "" || this.bankbranchaddition.brancH_NAME == null)) {
        this.branchValue = true

      }
      if ((this.bankbranchaddition.ifsC_CODE == "" || this.bankbranchaddition.ifsC_CODE == null)) {
        this.ifscValue = true

      }
    }
    else if (this.selectedDistrictName == "" || this.selectedDistrictName == null) {
      this.stateValue = false
      this.districtValue = true
      if (this.selectedBankType == "" || this.selectedBankType == null) {
        this.bankTypeValue = true
        this.bankNameValue = true
        if ((this.bankbranchaddition.brancH_NAME == "" || this.bankbranchaddition.brancH_NAME == null)) {
          this.branchValue = true

        }
        if ((this.bankbranchaddition.ifsC_CODE == "" || this.bankbranchaddition.ifsC_CODE == null)) {
          this.ifscValue = true

        }
      }
      else if (this.selectedBankName == "" || this.selectedBankName == null) {
        this.bankTypeValue = false
        this.bankNameValue = true
      }
      if ((this.bankbranchaddition.brancH_NAME == "" || this.bankbranchaddition.brancH_NAME == null)) {
        this.branchValue = true

      }
      if ((this.bankbranchaddition.ifsC_CODE == "" || this.bankbranchaddition.ifsC_CODE == null)) {
        this.ifscValue = true

      }
      else {
       
      }
    }
    else if (this.selectedBankType == "" || this.selectedBankType == null) {
      this.bankTypeValue = true
      this.bankNameValue = true
      if (this.selectedStateName == "" || this.selectedStateName == null) {
        this.stateValue = true
        this.districtValue = true
      }
      if ((this.bankbranchaddition.brancH_NAME == "" || this.bankbranchaddition.brancH_NAME == null)) {
        this.branchValue = true

      }
      if ((this.bankbranchaddition.ifsC_CODE == "" || this.bankbranchaddition.ifsC_CODE == null)) {
        this.ifscValue = true

      }
      else {
        
      }
    }
    else if (this.selectedBankName == "" || this.selectedBankName == null) {
      this.bankTypeValue = false
      this.bankNameValue = true
      if (this.selectedStateName == "" || this.selectedStateName == null) {
        this.stateValue = true
        this.districtValue = true
      }
      if ((this.bankbranchaddition.brancH_NAME == "" || this.bankbranchaddition.brancH_NAME == null)) {
        this.branchValue = true

      }
      if ((this.bankbranchaddition.ifsC_CODE == "" || this.bankbranchaddition.ifsC_CODE == null)) {
        this.ifscValue = true

      }
      else {
       
      }
    }
    else if ((this.bankbranchaddition.brancH_NAME == "" || this.bankbranchaddition.brancH_NAME == null)) {
      this.branchValue = true

    }
    else if ((this.bankbranchaddition.ifsC_CODE == "" || this.bankbranchaddition.ifsC_CODE == null)) {
      this.ifscValue = true

    }
    else if ((this.bankbranchaddition.brancH_NAME == "" || this.bankbranchaddition.brancH_NAME == null)
      && (this.bankbranchaddition.ifsC_CODE == "" || this.bankbranchaddition.ifsC_CODE == null)) {
      this.branchValue = true
      this.ifscValue = true
    }


    else {

      if (this.branchName.valid) {


        if (this.ifsc.valid) {


          

          this.spinnerService.show();
          //let bankbranch = this.branchName.value
          //this.branchName.setValue(bankbranch.toUpperCase())

          
          const branchName = this.bankbranchaddition.brancH_NAME.toUpperCase();

          const ifscName = this.bankbranchaddition.ifsC_CODE.toUpperCase();
          
          this.bankbranchaddition.brancH_NAME=branchName.trim();
          this.bankbranchaddition.ifsC_CODE = ifscName.trim();
          

         

          this.service.createBankBranch(this.bankbranchaddition).subscribe(bankName => {
            this.spinnerService.hide();


            const message = "Bank branch added successfully"

            this.snackBar.open(message, '', {

              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',


            });
          });


          this.reloadCurrentRoute();

        }

       

      }



      else {
      
      }









    }
  }

  handleInput(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }


  checkstuff(event: any) {
    if (event.target.value.substr(-1) === ' ' && event.code === 'Space') {
      
    }
  }

  isWhiteSpace(char: any) {
    return (/\s/).test(char);
  }
  willCreateWhitespaceSequence(evt: any) {
    var willCreateWSS = false;
    if (this.isWhiteSpace(evt.key)) {

      var elmInput = evt.currentTarget;
      var content = elmInput.value;

      var posStart = elmInput.selectionStart;
      var posEnd = elmInput.selectionEnd;

      willCreateWSS = (
        this.isWhiteSpace(content[posStart - 1] || '')
        || this.isWhiteSpace(content[posEnd] || '')
      );
    }
    return willCreateWSS;
  }


  isAlfa(evt: any) {

    evt = (evt || window.event);
    var charCode = (evt.which || evt.keyCode);
    var del = 'Delete'

    var arrowLeft = 'ArrowLeft'
    var arrowRight = 'ArrowRight'
    var arrow: any

    if (evt.key == arrowRight || evt.key == arrowLeft || evt.key == del) {
      arrow = false;

    } else {
      arrow = true;
    }


    return ((
      (charCode > 32)
      && (charCode < 65 || charCode > 90)
      && (charCode < 97 || charCode > 122) && (arrow)

    ) || this.willCreateWhitespaceSequence(evt)) ? false : true;
  }








  letterOnly(event: any) {
    event.target.maxLength = 30;

    var charCode = event.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)

      return true;
    else
      return false;
  }



  // 









  districtTouch() {


    if (this.stateNameSelect == "") {


      this.snackBar.open("Please select state", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',


      });
    }
    else {

    }
  }


  bankTypeTouch() {




    if (this.districtNameSelect == "") {


      this.snackBar.open("Please select district", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',


      });
    }
    else {

    }


  }
  bankNameTouch() {




    if (this.bankTypeSelect == "") {


      this.snackBar.open("Please select bank type", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',


      });
    }
    else {

    }




  }








}
