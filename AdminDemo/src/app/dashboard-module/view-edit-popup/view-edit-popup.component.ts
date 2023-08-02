import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EditIA } from 'src/app/edit-ia';
import { Iacreation } from 'src/app/iacreation';
import { ServicesService } from 'src/app/services.service';
import { State } from 'src/app/state-details';
import { StatedetailsResult } from 'src/app/statedetails-result';

@Component({
  selector: 'app-view-edit-popup',
  templateUrl: './view-edit-popup.component.html',
  styleUrls: ['./view-edit-popup.component.scss'],
  providers: [DatePipe]
})
export class ViewEditPopupComponent implements OnInit {




  secname = false;






  hideRequiredMarker = "true"

  ianame = false;
  stateName = false;
  districtname = false;
  ceoname = false;
  ceoContact = false;

  categoryvalue = false;
  regDateValue = false;


  districtnamese = "";

  ceocontact = ""
  // selectedCategory = "";

  // selectedSecretaryName = "";

  // selectedRegistrationNumber = "";

  // selectedImsOperator = "";

  ceoNameForm = new FormControl();

  iaNameForm = new FormControl();

  category = new FormControl();

  registerationNumber = new FormControl();

  registrationDate = new FormControl();

  secretaryName = new FormControl();

  misOperatorName = new FormControl();

  misOperatorContactNumber = new FormControl('', [Validators.required, Validators.pattern("^(?:[0-9]{3,4}[0-9]{7,8}|[6-9][0-9]{9})$")]);

  iaEmailId1 = new FormControl('', { validators: [Validators.required, Validators.pattern('[a-zA-Z0-9.-]{4,}@([a-zA-Z]+([.-]?[a-zA-Z])){2,}[.]{1}[a-zA-Z]{3}$')] });
  iaEmailId2 = new FormControl('', { validators: [Validators.required, Validators.pattern('[a-zA-Z0-9.-]{4,}@([a-zA-Z]+([.-]?[a-zA-Z])){2,}[.]{1}[a-zA-Z]{3}$')] });

  convFromDate: any;




  categoryDetails: State = new State();

  categoryList: StatedetailsResult[] = [];

  categorylist1: Record<any, any>[] = this.categoryList;
  categorylist2: Record<any, any>[] = this.categoryList;




  statedetailObject: State = new State();

  statelist: StatedetailsResult[] = [];

  statelist1: Record<any, any>[] = this.statelist;
  statelist2: Record<any, any>[] = this.statelist;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;

  today = new Date();


  districtDetails: State = new State();

  districtList: StatedetailsResult[] = [];

  districtList1: Record<any, any>[] = this.districtList;
  districtList2: Record<any, any>[] = this.districtList;

  editDetails: EditIA = new EditIA();

  input = ""
  message = ""
  text = ""
  valuee = ""
  demo = ""

  convRegDate: any;

  payoutToggle: any;

  ngoNameToggle: any;

  shgtxnToggle: any;

  ngoLogoToggle: any;

  memberNameToggle: any;


  selectedid = this.data.id;
  selectedianame = this.data.name_of_SHPI;
  selectedCategory = this.data.category;
  selectedRegNo = this.data.reg_No;
  selectedRegDate = this.data.reg_Date;
  selectedaddress = this.data.address;
  // selectedstatename = this.data.state_Name;
  // selecteddistrictname = this.data.district_Name;
  selectedceoname = this.data.name_of_CEO;
  selectedceocontact = this.data.conNo_CEO;
  selectedSecretaryName = this.data.name_of_Secretary;
  selectedImsOperator = this.data.name_of_MIS_Operator;
  // selectedngopayoutflag = this.data.ngO_Payout_Flag;
  selectedshgtranscom = this.data.shG_Trans_Com;
  selectedngologoflag = this.data.ngO_Logo_Flag;
  selectedngonameflag = this.data.ngO_Name_Flag;
  selectedngomemberflag = this.data.ngO_Member_Flag

  convRegDate1: any;




  payoutFormControl = new FormControl();

  //mobile = new FormControl('', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]);

  mobile = new FormControl('', [Validators.required, Validators.pattern("^(?:[0-9]{3,4}[0-9]{7,8}|[6-9][0-9]{9})$")]);




  constructor(private datepipe: DatePipe, private dateAdapter: DateAdapter<Date>, public dialogRef: MatDialogRef<ViewEditPopupComponent>, private cdref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any, public service: ServicesService, private snackBar: MatSnackBar, private spinnerService: NgxSpinnerService, private router: Router) {
    // this.id = this.data.id;
    this.dateAdapter.setLocale('en-GB');



    

   
    const date = new Date(this.data.reg_Date);
    


    //this.convRegDate = this.datepipe.transform(this.data.reg_Date, 'yyyy/MM/dd');

    this.convRegDate1 = date;



    


  }



  mobileValidator() {

    
  }


  letterOnly(event: any) {
    event.target.maxLength = 30;
  }


  onNoClick(): void {
    this.dialogRef.close();
    // this.reloadCurrentRoute();
  }

  stopEdit(): void {
    // this.Service.updateView(this.data);

    // service calling
  }



  enterSecretaryname(secretaryName: string) {

    this.secname = false;

    this.selectedSecretaryName = secretaryName;


  }

  enterOperatorName(operatorName: string) {
    this.selectedImsOperator = operatorName;

  }

  getCeo() {
    return 'CEO name is required';
  }

  getMobile1Error() {
    if (this.misOperatorContactNumber.hasError('required')) {
      return ' MIS operator contact number is required';
    }
    return this.misOperatorContactNumber.hasError('pattern') ? 'Enter valid contact number' : '';
  }

  getEmail1Error() {
    if (this.iaEmailId1.hasError('required')) {
      return 'IA Email ID 1 is required';
    }
    return this.iaEmailId1.hasError('pattern') ? 'Enter valid Email ID' : '';
  }

  getEmail2Error() {
    if (this.iaEmailId2.hasError('required')) {
      return 'IA Email ID 2 is required';
    }
    return this.iaEmailId2.hasError('pattern') ? 'Enter valid Email ID 2' : '';
  }

  iacreate: Iacreation = new Iacreation();

  ngOnInit() {


    this.payoutToggle = this.data.ngO_Payout_Flag;

    this.ngoNameToggle = this.data.ngO_Name_Flag

    this.shgtxnToggle = this.data.shG_Trans_Com;

    this.ngoLogoToggle = this.data.ngO_Logo_Flag;

    this.memberNameToggle = this.data.ngO_Member_Flag;








    // this.stateDetail()
    // this.getDistrictName(this.data.state_Name);
    this.getCategory();
    

    //  this.togglemethod();




  }







  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }


  stateDetail() {

    this.service.getStateService().subscribe(statedetail => {
      this.statedetailObject = statedetail;

      this.statelist = this.statedetailObject.result;
      this.statelist1 = this.statelist;
      this.statelist2 = this.statelist;
    })
  }

  getDistrictName(stateName: string) {
    this.service.districtNameFetch(stateName).subscribe(districtName => {
      this.districtDetails = districtName;
      this.districtList = this.districtDetails.result;
      this.districtList1 = this.districtList;
      this.districtList2 = this.districtList;
    });
  }

  registrationNumberEnter(regi: string) {

    this.selectedRegNo = regi;



  }

  orgValueChange() {


  }

  regDateSelect(registerDate: string) {
    this.data.selectedRegDate = registerDate;
    this.regDateValue = false;
    
  }





  iaNameEnter(ianame: string) {

    this.selectedianame = ianame;
    this.ianame = false;

  }





  ceoNameEnter(ceoname: string) {

    this.ceoname = false;
    this.selectedceoname = ceoname;

  }

  ceoContactEnter(ceocontact: string) {
    this.ceoContact = false;
    this.ceocontact = "CEO contact number is required"

    this.selectedceocontact = ceocontact
  }

  selectCategoryName(category: string) {
    this.categoryvalue = false;
    this.selectedCategory = category;
  }

  getCategory() {
    this.service.getCategoryList().subscribe(categoryName => {
      this.categoryDetails = categoryName;
      this.categoryList = this.categoryDetails.result;
      this.categorylist1 = this.categoryList;
      this.categorylist2 = this.categoryList;
    });

  }

  onclick(): void {

    this.iaNameForm.markAsUntouched();



    this.registrationDate.markAsUntouched();
    this.ceoNameForm.markAsUntouched();

    this.secretaryName.markAsUntouched();
    this.misOperatorName.markAsUntouched();
    this.misOperatorContactNumber.markAsUntouched();

  }

  setMessage0(e: any) {


    


    if (e.checked == true) {

      // this.payoutToggle=null;

      this.payoutToggle = "Yes";

      

    }
    else {
      // this.payoutToggle=null;
      this.payoutToggle = "No";

    }
  }

  setMessage(e: any) {
    if (e.checked == true) {

      //  this.shgtxnToggle = null;

      this.shgtxnToggle = "Yes"
    }
    else {

      this.shgtxnToggle = "No"
    }

  }

  setMessage1(e: any) {
    if (e.checked == true) {

      // this.ngoNameToggle = null;
      this.ngoNameToggle = "Yes";
    }
    else {

      this.ngoNameToggle = "No";
    }

  }
  setMessage2(e: any) {
    if (e.checked == true) {

      // this.ngoLogoToggle = null;

      this.ngoLogoToggle = "Yes";
    }
    else {

      this.ngoLogoToggle = "No";
    }

  }

  setMessage3(e: any) {
    if (e.checked == true) {

      // this.memberNameToggle = null;
      this.memberNameToggle = "Yes";
    }
    else {
      this.memberNameToggle = "No";

    }

  }







  submit() {

    this.convFromDate = this.datepipe.transform(this.registrationDate.value, 'MM/dd/YYYY');
    this.data.reg_Date = this.convFromDate;

    if (this.selectedid == null || this.selectedid == "") {


    }

    if (this.data.name_of_SHPI == "" || this.data.name_of_SHPI == null) {
      this.ianame = true;


    }

    if (this.data.category == "" || this.data.category == null) {
      this.categoryvalue = true;;
    }

    if (this.data.reg_No == "" || this.data.reg_No == null) {


    }

    if (this.data.reg_Date == "") {

      this.regDateValue = true;


    }


    // if (this.data.state_Name == "" || this.data.state_Name == null) {
    //   this.stateName = true;

    // }

    // if (this.data.district_Name == "" || this.data.district_Name == null) {

    //   this.districtname = true;
    // }




    if (this.data.name_of_CEO == null || this.data.name_of_CEO == "") {

      this.ceoname = true;
    }

    if (this.data.conNo_CEO == "" || this.data.conNo_CEO == null) {
      this.ceoContact = true;
      this.ceocontact = "CEO contact number is required"

    }

    // if(this.data.name_of_Secretary == null || this.data.name_of_Secretary == ""){

    //   this.secname = true;


    // } 




    if ((this.data.name_of_SHPI != "") && (this.data.category != " ") && (this.data.reg_No != "") && (this.data.reg_Date != "") && (this.data.name_of_CEO != "") && (this.data.conNo_CEO != "") && (this.data.name_of_Secretary != null) && (this.data.name_of_MIS_Operator != null)) {

      this.regDateValue = false;

      if (this.mobile.invalid && this.iaEmailId1.invalid && this.iaEmailId2.invalid && this.misOperatorContactNumber.invalid) {

        

      }



      else {

        // this.data.ngO_Payout_Flag = 'No'
        // this.iacreate.shG_Trans_Com = 'No';
        // this.iacreate.ngO_Name_Flag = 'No';
        // this.iacreate.ngO_Logo_Flag = 'No';
        // this.iacreate.ngO_Member_Flag = 'No';



        if (this.iaNameForm.status == 'VALID' && this.ceoNameForm.status == 'VALID' && this.secretaryName.status == 'VALID' && this.misOperatorName.status == 'VALID' &&
          this.mobile.status == 'VALID' && this.misOperatorContactNumber.status == 'VALID' && this.iaEmailId1.status == 'VALID' && this.iaEmailId2.status == 'VALID') {


          // this.data.state_Name = this.selectedstatename;
          // this.data.district_Name = this.selecteddistrictname;





          if (this.payoutToggle == true || this.payoutToggle == "Yes") {

            this.data.ngO_Payout_Flag = "Yes";
            
          }
          else {

            this.data.ngO_Payout_Flag = "No";
            
          }


          if (this.shgtxnToggle == true || this.shgtxnToggle == "Yes") {
            this.data.shG_Trans_Com = "Yes";

          }
          else {
            this.data.shG_Trans_Com = "No";
          }

          if (this.ngoNameToggle == true || this.ngoNameToggle == "Yes") {

            this.data.ngO_Name_Flag = "Yes";
          }

          else {
            this.data.ngO_Name_Flag = "No";
          }


          if (this.ngoLogoToggle == true || this.ngoLogoToggle == "Yes") {
            this.data.ngO_Logo_Flag = "Yes";
          }
          else {
            this.data.ngO_Logo_Flag = "No";
          }

          if (this.memberNameToggle == true || this.memberNameToggle == "Yes") {
            this.data.ngO_Member_Flag = "Yes";
          }
          else {
            this.data.ngO_Member_Flag = "No";
          }








          //  this.data.ngO_Logo_Flag = this.ngoLogoToggle;

          //  this.memberNameToggle;

          // if(this.data.ngO_Payout_Flag==true){
          //   this.data.ngO_Payout_Flag = "Yes"
          // }else{
          //   this.data.ngO_Payout_Flag = "No"
          // }

          // if(this.data.shG_Trans_Com == true){
          //   this.data.shG_Trans_Com = "Yes"
          // }else{
          //   this.data.shG_Trans_Com = "No"
          // }

          // if(this.data.ngO_Name_Flag == true){
          //   this.data.ngO_Name_Flag = "Yes"
          // }else{
          //   this.data.ngO_Name_Flag = "No"
          // }

          // if(this.data.ngO_Logo_Flag == true){
          //   this.data.ngO_Logo_Flag = "Yes"
          // }else{
          //   this.data.ngO_Logo_Flag = "No"
          // }

          // if(this.data.ngO_Member_Flag == true){
          //   this.data.ngO_Member_Flag = "Yes"
          // }else{
          //   this.data.ngO_Member_Flag = "No"
          // }


          const ianame = this.data.name_of_SHPI.toUpperCase();
          const secretatyName = this.data.name_of_Secretary.replace(/\b\w/g, (x: string) => x.toUpperCase());
          const ceoname = this.data.name_of_CEO.replace(/\b\w/g, (x: string) => x.toUpperCase());


          const misoperatorname = this.data.name_of_MIS_Operator.replace(/\b\w/g, (x: string) => x.toUpperCase());


          this.data.name_of_SHPI = ianame.trim();
          this.data.name_of_Secretary = secretatyName.trim();
          this.data.name_of_CEO = ceoname.trim();
          this.data.name_of_MIS_Operator = misoperatorname.trim();




          this.spinnerService.show();
          this.service.editIAViewDeails(this.data).subscribe(editIAView => {

            this.spinnerService.hide();

           



           



            if (editIAView.result == "success") {

              this.snackBar.open("Data updated successfully", '', {

                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                // panelClass: ['blue-snackbar']
                panelClass: 'center',


              });

              this.onNoClick();


            }


            else {


              if(editIAView.result == "Name Already Exsist")
              {

                this.snackBar.open("IA name already exists", '', {

                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  // panelClass: ['blue-snackbar']
                  panelClass: 'center',
  
  
                });

              }
              else{

                this.snackBar.open(editIAView.message, '', {

                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  // panelClass: ['blue-snackbar']
                  panelClass: 'center',
  
  
                });

              }

             

            }
            return this.data;
          });

        }




      }





    }

    else {


    }
  }


  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }


  getMobileError() {
    if (this.mobile.hasError('required')) {
      return 'CEO contact number is required';
    }
    return this.mobile.hasError('pattern') ? ' Enter valid contact number' : '';
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



  handleInput(event: any) {
    if (event.target.selectionEnd === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }


  onBlur(): void {
    this.iaNameForm.markAsUntouched();
    this.registrationDate.markAsUntouched();
    // this.districtName.markAsUntouched();
    // this.banktype.markAsUntouched();
    //this.bank.markAsUntouched();

    // this.branchName.markAsUntouched();
    //this.ifsc.markAsUntouched();
    //this.contactNumber.markAsUntouched();
  }



}