import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { concatAll } from 'rxjs';
import { Iacreation } from 'src/app/iacreation';
import { PasswordValidation } from 'src/app/password-validation';
import { ServicesService } from 'src/app/services.service';
import { State } from 'src/app/state-details';
import { StatedetailsResult } from 'src/app/statedetails-result';




@Component({
  selector: 'app-create-ia',
  templateUrl: './create-ia.component.html',
  styleUrls: ['./create-ia.component.scss'],
  providers: [DatePipe]
})
export class CreateIaComponent implements OnInit {


  selectedStateName = "";
  selectedDistrictName = "";
  selectedCategory = "";
  disabled = false;
  hide = true;
  hide1 = true;

  registrationdate = ""

  message = "";
  text = "";
  value = "";
  demo = ""
  input = ""
  statevalue!: boolean;
  districtvalue!: boolean;
  categoryvalue!: boolean;
  iaNameValue!: boolean;
  registrationNumber!: boolean;
  regDateValue!: boolean;
  convFromDate: any;
  enterFirstPass = "";
  enterSecondPass = "";
  firstpassword!: boolean;
  confirmpassword!: boolean;
  confirmpassmsg = "";
  firstpassmsg = "";
  // registrationDate!:boolean
  // ceoName!:boolean;
  // ceoContactNumber!:boolean;
  // secretaryName!:boolean;
  // misOperatorName!:boolean;
  // misOpeartorContactNumber!:boolean;
  // iaEmailId1!:boolean;
  // iaEmailId2!:boolean;
  // userName!:boolean;
  // password!:boolean;
  // confirmPassword!:boolean;

  // ia create 

  enterIaName = "";
  enterRegistrationNumber = "";
  enterCeoName = "";
  secretatyName = "";
  enterImsOperator = "";
  enterUserName = "";

  selectedIaName = "";
  selectedRegistrationNumber = "";
  selectedCeoName = "";
  selectedSecretaryName = "";
  selectedImsOperator = "";
  selectedUserName = "";

  today = new Date();


  constructor(private service: ServicesService, private cdref: ChangeDetectorRef, private spinnerService: NgxSpinnerService, private snackBar: MatSnackBar, private dateAdapter: DateAdapter<Date>, private datepipe: DatePipe, private router: Router) {
    this.dateAdapter.setLocale('en-GB');
    // this.formGroup = formBuilder.group({

    //   password: ['', [Validators.required]],
    //   confirm_password: ['', [Validators.required]]
    // }, {
    //   validator: PasswordValidation('password', 'confirm_password')
    // })
  }





  iacreationform!: FormGroup;



  iaName = new FormControl();
  category = new FormControl();
  registerationNumber = new FormControl();


  registrationDate = new FormControl();
  // stateName = new FormControl('', [Validators.required]);
  // districtName = new FormControl('', [Validators.required]);
  ceoName = new FormControl();
  ceoContactNumber = new FormControl('', [Validators.required, Validators.pattern("^(?:[0-9]{3,4}[0-9]{7,8}|[6-9][0-9]{9})$")]);
  secretaryName = new FormControl();
  misOperatorName = new FormControl();
  misOperatorContactNumber = new FormControl('', [Validators.required, Validators.pattern("^(?:[0-9]{3,4}[0-9]{7,8}|[6-9][0-9]{9})$")]);
  iaEmailId1 = new FormControl('', { validators: [Validators.required, Validators.pattern('[a-zA-Z0-9.-]{4,}@([a-zA-Z]+([.-]?[a-zA-Z])){2,}[.]{1}[a-zA-Z]{3}$')] });
  iaEmailId2 = new FormControl('', { validators: [Validators.required, Validators.pattern('[a-zA-Z0-9.-]{4,}@([a-zA-Z]+([.-]?[a-zA-Z])){2,}[.]{1}[a-zA-Z]{3}$')] });
  userName = new FormControl();
  password = new FormControl('', { validators: [Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$#!%*?&]).{8,15}')] });

  // pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&]).{8,15}" new pattern


  //password = new FormControl('',{ validators: [Validators.required, Validators.pattern('(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*).{8,}$')]});
  confirmPassword = new FormControl();
  //startDate = new FormControl();

  // get f() {
  //   return this.formGroup.controls;
  // }

  letterOnly(event: any) {
    event.target.maxLength = 30;

    var charCode = event.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)

      return true;
    else
      return false;
  }

  onclick(): void {

    this.iaName.markAsUntouched();
    //  this.category.markAsUntouched();
    this.registerationNumber.markAsUntouched();

    //  this.registrationDate.markAsUntouched();
    this.ceoName.markAsUntouched();
    this.ceoContactNumber.markAsUntouched();
    this.secretaryName.markAsUntouched();
    this.misOperatorName.markAsUntouched();
    this.misOperatorContactNumber.markAsUntouched();
    this.iaEmailId1.markAsUntouched();
    this.iaEmailId2.markAsUntouched();
    this.userName.markAsUntouched();
    this.password.markAsUntouched();
    this.confirmPassword.markAsUntouched();

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
    return this.iaEmailId2.hasError('pattern') ? 'Enter valid Email ID' : '';
  }

  getMobileError() {
    if (this.ceoContactNumber.hasError('required')) {
      return 'CEO contact number is required';
    }
    return this.ceoContactNumber.hasError('pattern') ? 'Enter valid contact number' : '';
  }

  getMobile1Error() {
    if (this.misOperatorContactNumber.hasError('required')) {
      return ' MIS operator contact number is required';
    }
    return this.misOperatorContactNumber.hasError('pattern') ? 'Enter valid contact number' : '';
  }

  getPwdError() {
    if (this.password.hasError('required')) {
      return 'Password is required';
    }
    // return this.password.hasError('pattern') ? 'Password should have 1 lower case 1 upper case 1 special character and 1 number' : '';
    return this.password.hasError('pattern') ? 'Enter valid password' : '';

  }


  credential: StatedetailsResult = new StatedetailsResult();

  categoryDetails: State = new State();

  categoryList: StatedetailsResult[] = [];

  categorylist1: Record<any, any>[] = this.categoryList;
  categorylist2: Record<any, any>[] = this.categoryList;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;

  stateNameDetails: State = new State();

  stateList: StatedetailsResult[] = [];

  statelist1: Record<any, any>[] = this.stateList;
  statelist2: Record<any, any>[] = this.stateList;

  districtDetails: State = new State();

  districtList: StatedetailsResult[] = [];

  districtlist1: Record<any, any>[] = this.districtList;
  districtlist2: Record<any, any>[] = this.districtList;

  hideRequiredMarker = true;

  iacreate: Iacreation = new Iacreation();

  iaResponseDetails: State = new State()



  setMessage0(e: any) {
    if (e.checked === true) {
      this.input = 'Yes';
      this.iacreate.ngO_Payout_Flag = this.input;
      this.message;
    }
    else
      this.input = 'No'
    this.iacreate.ngO_Payout_Flag = this.input;
  }

  setMessage(e: any) {
    if (e.checked === true) {
      this.message = 'Yes';
      this.iacreate.shG_Trans_Com = this.message;
      this.message;
    }
    else
      this.message = 'No'
    this.iacreate.shG_Trans_Com = this.message;
  }
  setMessage1(e: any) {
    if (e.checked === true) {
      this.text = 'Yes'
      this.iacreate.ngO_Name_Flag = this.text
    }
    else
      this.text = 'No'
    this.iacreate.ngO_Name_Flag = this.text
  }
  setMessage2(e: any) {
    if (e.checked === true) {
      this.value = 'Yes'
      this.iacreate.ngO_Logo_Flag = this.value;
    }
    else
      this.value = 'No'
    this.iacreate.ngO_Logo_Flag = this.value;
  }

  setMessage3(e: any) {
    if (e.checked === true) {
      this.demo = 'Yes'
      this.iacreate.ngO_Member_Flag = this.demo;
    }
    else
      this.demo = 'No'
    this.iacreate.ngO_Member_Flag = this.demo;
  }
  getPermission = "";

  ngOnInit(): void {



    this.getCategory();
    this.getStateList();

    this.statevalue = false;
    this.districtvalue = false;
    this.regDateValue = false;
    this.categoryvalue = false;
    this.iacreate.ngO_Payout_Flag = 'No'
    this.iacreate.shG_Trans_Com = 'No';
    this.iacreate.ngO_Name_Flag = 'No';
    this.iacreate.ngO_Logo_Flag = 'No';
    this.iacreate.ngO_Member_Flag = 'No';
  }
  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }
  getCategory() {
    this.service.getCategoryList().subscribe(categoryName => {
      this.categoryDetails = categoryName;
      this.categoryList = this.categoryDetails.result;
      this.categorylist1 = this.categoryList;
      this.categorylist2 = this.categoryList;
    });

  }

  selectCategoryName(category: string) {
    this.categoryvalue = false;
    this.selectedCategory = category;
  }

  getStateList() {

    this.service.getStateService().subscribe(stateName => {
      this.stateNameDetails = stateName;
      this.stateList = this.stateNameDetails.result;
      this.statelist1 = this.stateList;
      this.statelist2 = this.stateList;


    });

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
    var slash = "/";
    var hypen = "-";
    var openBracket = "(";
    var closeBracket = ")";
    var specialCharacters: any

    var arrowLeft = 'ArrowLeft';
    var arrowRight = 'ArrowRight';
    var arrowUp = 'ArrowUp';
    var arrowDown = 'ArrowDown';
    var del = 'Delete'




    if (evt.key == arrowUp || evt.key == arrowDown || evt.key == arrowRight || evt.key == arrowRight || evt.key == arrowLeft || slash == evt.key || hypen == evt.key || openBracket == evt.key || closeBracket == evt.key || evt.key == "." || evt.key == "," || evt.key == del) {
      specialCharacters = false;
    }
    else {
      specialCharacters = true;
    }
    // number if
    var numberBoolean: any;
    if (evt.key == "0" || evt.key == "1" || evt.key == "2" || evt.key == "3" || evt.key == "4" || evt.key == "5" || evt.key == "6" || evt.key == "7" || evt.key == "8" || evt.key == "9") {
      numberBoolean = false;
    }
    else {
      numberBoolean = true;
    }
    return (((charCode > 32) && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122) && (specialCharacters) && (numberBoolean)) || this.willCreateWhitespaceSequence(evt)) ? false : true;
  }


  handleInput(event: any) {
    if (event.target.selectionEnd === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }


  passwordEnter(password1: string) {

    this.firstpassword = false;
    this.firstpassmsg = "";
    this.enterFirstPass = password1;


    if (this.getPermission.length == 0) {

      this.getPermission = "pass1";
    }


    if (this.enterFirstPass.length == 0) {

      //this.firstpassword = true;
      //this.firstpassmsg = "Password is required";
      this.enterFirstPass = "";
      //this.getPermission="";

      if (this.getPermission == "pass2") {

      }
      else {
        this.getPermission = "";

      }

    }

    if (this.enterFirstPass.length != 0) {
      if (this.enterFirstPass.length <= 8) {
        

      }
    }


  }


  confirmPasswordEnter(confirmpassword: string) {

    this.confirmpassword = false;
    this.confirmpassmsg = "";
    this.enterSecondPass = confirmpassword;


    if (this.getPermission.length == 0) {

      this.getPermission = "pass2";
    }

    if (this.enterSecondPass.length == 0) {
      //this.confirmpassword = true;
      //this.confirmpassmsg = "Confirm Password is required";
      this.enterSecondPass = "";
      //this.getPermission="";


      if (this.getPermission == "pass1") {

      }
      else {
        this.getPermission = "";

      }
    }

  }

  getDistrictName(stateName: string) {
    this.selectedStateName = stateName;
    this.selectedDistrictName = "";
    this.iacreate.district_Name = "";
    this.statevalue = false;

    this.service.districtNameFetch(stateName).subscribe(districtName => {
      this.districtDetails = districtName;
      this.districtList = this.districtDetails.result;
      this.districtlist1 = this.districtList;
      this.districtlist2 = this.districtList;
    });
  }

  selectDistrict(district: string) {
    this.districtvalue = false;
    this.selectedDistrictName = district;
  }

  regDateSelect(registerDate: string) {
    this.registrationdate = registerDate;
    this.regDateValue = false;
   
  }

  //refresh
  // @ViewChild('f') signupForm: NgForm 
  //   reset(){
  //     this.iacreationform.reset({
  //       "username": "",
  //       "email": "",
  //       "secret": ""
  //   })
  //   }
  reloadCurrentRoute() {
    //   this.iacreationform.reset();
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  orgValueChange() {

  }

  // submit() {
  //   this.convFromDate = this.datepipe.transform(this.registrationDate.value, 'dd/MM/yyyy');
  //   if ((this.selectedStateName == "" || this.selectedStateName == null) && (this.selectedDistrictName == null || this.selectedDistrictName == "") && (this.selectedCategory == null || this.selectedCategory== "")
  //     && (this.iacreate.reg_Date == "" || this.iacreate.reg_Date == null)) {
  //     this.statevalue = true;
  //     this.districtvalue = true;
  //     this.categoryvalue = true;
  //     this.iaNameValue = true;
  //     this.regDateValue = true;
  //     //this.firstpassword = true;
  //     this.confirmpassword = true;

  //     this.confirmpassmsg = " Confirm password is required";
  //     //this.firstpassmsg = "Password is required";
  //     this.passwordChecking()
  //     //this.merchantvalue = true;
  //   }
  //   else {
  //     if (this.selectedStateName == null || this.selectedStateName == "") {

  //       this.statevalue = true;
  //       this.districtvalue = true;
  //       // this.regDateValue=true
  //       // this.iavalue = false;
  //       // this.merchantvalue = false;

  //       if (this.enterFirstPass == "" || this.enterFirstPass == null) {

  //         this.firstpassword = true;
  //         this.firstpassmsg = "Password is required";

  //       }

  //       if (this.enterSecondPass == null || this.enterSecondPass == "") {

  //         this.confirmpassword = true;
  //         this.confirmpassmsg = " Confirm password is required";
  //       }
  //       if (this.iacreate.reg_Date == null) {
  //         this.regDateValue = true;
  //       }
  //     }

  //     else if (this.selectedDistrictName == null || this.selectedDistrictName == "") {
  //       this.statevalue = false;
  //       this.districtvalue = true;
  //       //this.iavalue = true;
  //       //this.merchantvalue = true;
  //       if (this.enterFirstPass == "" || this.enterFirstPass == null) {

  //         this.firstpassword = true;
  //         this.firstpassmsg = "Password is required";

  //       }

  //       if (this.enterSecondPass == null || this.enterSecondPass == "") {

  //         this.confirmpassword = true;
  //         this.confirmpassmsg = " Confirm password is required";
  //       }
  //       // if (this.iacreate.reg_Date==null) {
  //       //   this.regDateValue = true;
  //       // }
  //       if (this.iacreate.reg_Date == null) {
  //         this.regDateValue = true;
  //       }
  //       if (this.iacreate.category == null) {
  //         this.categoryvalue = true;
  //       }


  //     }
  //     else if (this.selectedCategory == null || this.selectedCategory == "") {
  //       this.categoryvalue = true;
  //       //this.iavalue = true;
  //       //this.merchantvalue = true;
  //       if (this.enterFirstPass == "" || this.enterFirstPass == null) {

  //         this.firstpassword = true;
  //         this.firstpassmsg = "Password is required";

  //       }

  //       if (this.enterSecondPass == null || this.enterSecondPass == "") {

  //         this.confirmpassword = true;
  //         this.confirmpassmsg = " Confirm password is required";
  //       }

  //       if (this.iacreate.reg_Date==null) {
  //         this.regDateValue = true;
  //       }
  //       // if (this.iacreate.reg_Date==null) {
  //       //   this.regDateValue = true;
  //       // }
  //     }
  //     else if (this.convFromDate == null) {
  //       this.regDateValue = true;

  //       if (this.enterFirstPass == "" || this.enterFirstPass == null) {

  //         this.firstpassword = true;
  //         this.firstpassmsg = "Password is required";

  //       }

  //       if (this.enterSecondPass == null || this.enterSecondPass == "") {

  //         this.confirmpassword = true;
  //         this.confirmpassmsg = " Confirm password is required";
  //       }

  //     }










  //     else {
  //       if (this.selectedStateName != null && this.selectedDistrictName != null
  //         && this.iacreate.name_of_SHPI != null && this.iacreate.reg_No != null
  //         && this.iacreate.reg_Date != null && this.iacreate.name_of_CEO != null
  //         && this.iacreate.conNo_CEO != null && this.iacreate.name_of_Secretary != null
  //         && this.iacreate.name_of_MIS_Operator != null && this.iacreate.email_ID1_SHPI != null
  //         && this.iacreate.email_ID2_SHPI != null && this.iacreate.username != null
  //         && this.iacreate.password != null && this.iacreate.ngO_Payout_Flag != null
  //         && this.iacreate.shG_Trans_Com != null && this.iacreate.ngO_Name_Flag != null
  //         && this.iacreate.ngO_Logo_Flag != null && this.iacreate.ngO_Member_Flag != null) {
  //         this.statevalue = false;
  //         this.districtvalue = false;
  //         this.categoryvalue = false;
  //         this.regDateValue = false;

  //         if (this.getPermission == "pass1") {

  //           // pass1

  //           if (this.enterFirstPass == this.enterSecondPass) {



  //             if ((this.enterFirstPass != null || this.enterFirstPass != "") && (this.enterSecondPass != null || this.enterSecondPass != "")) {
  //               this.serviceCall()
  //             }




  //             this.firstpassword = true;
  //             this.confirmpassword = true;

  //             this.confirmpassmsg = "Confirm password is required";
  //             this.firstpassmsg = "Password is required";
  //           }
  //           else {



  //             if (this.enterFirstPass == "") {
  //               this.firstpassmsg = "Password is required";

  //               this.firstpassword = true;

  //             }

  //             if (this.enterSecondPass == "") {
  //               this.confirmpassword = true;
  //               this.confirmpassmsg = "Confirm password is required";
  //             }


  //             else {
  //               this.enterSecondPass="";
  //               this.confirmPassword.reset();
  //               this.confirmpassmsg = "Password mismatch";
  //               this.confirmpassword = true;
  //             }

  //           }
  //         }

  //         else {


  //           if (this.enterSecondPass == this.enterFirstPass) {

  //             if ((this.enterFirstPass != null || this.enterFirstPass != "") && (this.enterSecondPass != null || this.enterSecondPass != "")) {
  //               this.serviceCall()
  //             }

  //             this.firstpassword = true;
  //             this.confirmpassword = true;
  //             this.confirmpassmsg = " Confirm password is required ";
  //             this.firstpassmsg =  "Password is required";
  //           }

  //           else {


  //             if (this.enterFirstPass == "") {
  //               this.firstpassmsg =  "Password is required";

  //               this.firstpassword = true;

  //             }

  //             if (this.enterSecondPass == "") {
  //               this.confirmpassword = true;
  //               this.confirmpassmsg = "Confirm password is required";
  //             }
  //             else {

  //               this.enterSecondPass="";
  //               this.confirmPassword.reset();
  //               this.confirmpassmsg = "Password mismatch";
  //               this.confirmpassword = true;

  //             }
  //             // this.password.reset();
  //             // this.firstpassword = true;
  //             // this.firstpassmsg ="Password Not Match";
  //           }

  //           // pass2 

  //         }








  //         // this.spinnerService.show();

  //         // this.iacreate.reg_Date = this.convFromDate;

  //         // this.service.iaCreation(this.iacreate).subscribe(response => {
  //         //   this.iaResponseDetails = response;
  //         //   this.spinnerService.hide();

  //         //   if (response.length === 0) {
  //         //     this.message = "Failed";
  //         //     this.spinnerService.hide();
  //         //     this.snackBar.open(this.message, '', {

  //         //       horizontalPosition: 'center',
  //         //       verticalPosition: 'top',
  //         //       duration: 3000,

  //         //       panelClass: 'center',


  //         //     });
  //         //   }
  //         //   else {
  //         //     this.message = this.iaResponseDetails.message;
  //         //     this.spinnerService.hide();
  //         //     this.snackBar.open(this.message, '', {
  //         //       horizontalPosition: 'center',
  //         //       verticalPosition: 'top',
  //         //       duration: 3000,
  //         //       panelClass: 'center',
  //         //     });
  //         //   }

  //         // });



  //         // this.reloadCurrentRoute();

  //       }
  //       else {
  //         if (this.enterFirstPass == "" || this.enterFirstPass == null) {

  //           this.firstpassword = true;
  //           this.firstpassmsg = "Password is required";

  //         }

  //         if (this.enterSecondPass == null || this.enterSecondPass == "") {

  //           this.confirmpassword = true;
  //           this.confirmpassmsg = " Confirm password is required";
  //         }

  //       }
  //     }
  //   }
  // }

  // Reset(){
  //   this.iacreationform.reset();
  // }


  submit() {

    
    this.convFromDate = this.datepipe.transform(this.registrationDate.value, 'MM/dd/yyyy');

   

    this.iacreate.reg_Date = this.convFromDate


    // this.iacreate.category = this.selectedCategory;
    if ((this.selectedStateName == "" || this.selectedStateName == null) && (this.selectedDistrictName == null || this.selectedDistrictName == "") && (this.selectedCategory == null || this.selectedCategory == "")
      && (this.iacreate.reg_Date == "" || this.iacreate.reg_Date == null)) {
      this.statevalue = true;
      this.districtvalue = true;
      this.categoryvalue = true;
      this.iaNameValue = true;
      this.regDateValue = true;
      //this.firstpassword = true;
      this.confirmpassword = true;

      this.confirmpassmsg = " Confirm password is required";
      //this.firstpassmsg = "Password is required";
      this.passwordChecking()
      //this.merchantvalue = true;
    }
    else {
      if (this.selectedStateName == null || this.selectedStateName == "") {

        this.statevalue = true;
        this.districtvalue = true;
        // this.regDateValue=true
        // this.iavalue = false;
        // this.merchantvalue = false;

        if (this.enterFirstPass == "" || this.enterFirstPass == null) {

          this.firstpassword = true;
          this.firstpassmsg = "Password is required";

        }

        if (this.enterSecondPass == null || this.enterSecondPass == "") {

          this.confirmpassword = true;
          this.confirmpassmsg = " Confirm password is required";
        }
        if (this.iacreate.reg_Date == null) {
          this.regDateValue = true;
        }

        // if (this.registrationDate == null) {
        //   this.regDateValue = true;
        // }
      }

      else if (this.selectedDistrictName == null || this.selectedDistrictName == "") {
        this.statevalue = false;
        this.districtvalue = true;
        //this.iavalue = true;
        //this.merchantvalue = true;
        if (this.enterFirstPass == "" || this.enterFirstPass == null) {

          this.firstpassword = true;
          this.firstpassmsg = "Password is required";

        }

        if (this.enterSecondPass == null || this.enterSecondPass == "") {

          this.confirmpassword = true;
          this.confirmpassmsg = " Confirm password is required";
        }
        if (this.iacreate.reg_Date == null) {
          this.regDateValue = true;
        }
        if (this.iacreate.category == null) {
          this.categoryvalue = true;
        }
        // if (this.convFromDate == null) {
        //   this.regDateValue = true;
        // }
        // if (this.registrationDate == null) {
        //   this.regDateValue = true;
        // }


      }
      else if (this.selectedCategory == null || this.selectedCategory == "") {
        this.categoryvalue = true;
        //this.iavalue = true;
        //this.merchantvalue = true;
        if (this.enterFirstPass == "" || this.enterFirstPass == null) {

          this.firstpassword = true;
          this.firstpassmsg = "Password is required";
        }
        if (this.enterSecondPass == null || this.enterSecondPass == "") {

          this.confirmpassword = true;
          this.confirmpassmsg = " Confirm password is required";
        }
        if (this.iacreate.reg_Date == null) {
          this.regDateValue = true;
        }
      }

      else if (this.iacreate.reg_Date == "" || this.iacreate.reg_Date == null) {
        this.regDateValue = true;
        if (this.enterFirstPass == "" || this.enterFirstPass == null) {

          this.firstpassword = true;
          this.firstpassmsg = "Password is required";

        }

        if (this.enterSecondPass == null || this.enterSecondPass == "") {

          this.confirmpassword = true;
          this.confirmpassmsg = " Confirm password is required";
        }

      }










      else {
        if (this.selectedStateName != null && this.selectedDistrictName != null
          && this.iacreate.name_of_SHPI != null && this.iacreate.reg_No != null
          && this.iacreate.reg_Date != null && this.iacreate.name_of_CEO != null
          && this.iacreate.conNo_CEO != null && this.iacreate.name_of_Secretary != null
          && this.iacreate.name_of_MIS_Operator != null && this.iacreate.email_ID1_SHPI != null
          && this.iacreate.email_ID2_SHPI != null && this.iacreate.username != null
          && this.iacreate.password != null && this.iacreate.ngO_Payout_Flag != null
          && this.iacreate.shG_Trans_Com != null && this.iacreate.ngO_Name_Flag != null
          && this.iacreate.ngO_Logo_Flag != null && this.iacreate.ngO_Member_Flag != null) {
          this.statevalue = false;
          this.districtvalue = false;
          this.categoryvalue = false;
          this.regDateValue = false;

          if (this.getPermission == "pass1") {

            // pass1

            if (this.enterFirstPass == this.enterSecondPass) {



              if ((this.enterFirstPass != null || this.enterFirstPass != "") && (this.enterSecondPass != null || this.enterSecondPass != "")) {
                this.serviceCall()
              }




              this.firstpassword = true;
              this.confirmpassword = true;

              this.confirmpassmsg = "Confirm password is required";
              this.firstpassmsg = "Password is required";
            }
            else {



              if (this.enterFirstPass == "") {
                this.firstpassmsg = "Password is required";

                this.firstpassword = true;

              }

              if (this.enterSecondPass == "") {
                this.confirmpassword = true;
                this.confirmpassmsg = "Confirm password is required";
              }


              else {
                this.enterSecondPass = "";
                this.confirmPassword.reset();
                this.confirmpassmsg = "Password mismatch";
                this.confirmpassword = true;
              }

            }
          }

          else {


            if (this.enterSecondPass == this.enterFirstPass) {

              if ((this.enterFirstPass != null || this.enterFirstPass != "") && (this.enterSecondPass != null || this.enterSecondPass != "")) {
                this.serviceCall()
              }
              this.firstpassword = true;
              this.confirmpassword = true;
              this.confirmpassmsg = " Confirm password is required ";
              this.firstpassmsg = "Password is required";
            }
            else {
              if (this.enterFirstPass == "") {
                this.firstpassmsg = "Password is required";
                this.firstpassword = true;
              }
              if (this.enterSecondPass == "") {
                this.confirmpassword = true;
                this.confirmpassmsg = "Confirm password is required";
              }
              else {
                this.enterSecondPass = "";
                this.confirmPassword.reset();
                this.confirmpassmsg = "Password mismatch";
                this.confirmpassword = true;

              }
              // this.password.reset();
              // this.firstpassword = true;
              // this.firstpassmsg ="Password Not Match";
            }

            // pass2 

          }








          // this.spinnerService.show();

          // this.iacreate.reg_Date = this.convFromDate;

          // this.service.iaCreation(this.iacreate).subscribe(response => {
          //   this.iaResponseDetails = response;
          //   this.spinnerService.hide();

          //   if (response.length === 0) {
          //     this.message = "Failed";
          //     this.spinnerService.hide();
          //     this.snackBar.open(this.message, '', {

          //       horizontalPosition: 'center',
          //       verticalPosition: 'top',
          //       duration: 3000,

          //       panelClass: 'center',


          //     });
          //   }
          //   else {
          //     this.message = this.iaResponseDetails.message;
          //     this.spinnerService.hide();
          //     this.snackBar.open(this.message, '', {
          //       horizontalPosition: 'center',
          //       verticalPosition: 'top',
          //       duration: 3000,
          //       panelClass: 'center',
          //     });
          //   }

          // });



          // this.reloadCurrentRoute();

        }
        else {
          if (this.enterFirstPass == "" || this.enterFirstPass == null) {

            this.firstpassword = true;
            this.firstpassmsg = "Password is required";

          }

          if (this.enterSecondPass == null || this.enterSecondPass == "") {

            this.confirmpassword = true;
            this.confirmpassmsg = " Confirm password is required";
          }

        }
      }
    }
  }
  refreshPage() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }





  serviceCall() {

    if (this.iaName.status == 'VALID' && this.ceoName.status == 'VALID' && this.secretaryName.status == 'VALID' && this.misOperatorName.status == 'VALID' &&
      this.userName.status == 'VALID' && this.ceoContactNumber.status == 'VALID' && this.misOperatorContactNumber.status == 'VALID' && this.iaEmailId1.status == 'VALID' && this.iaEmailId2.status == 'VALID' && this.password.status == 'VALID' && this.confirmPassword.status == 'VALID') {



      if (this.selectedStateName != null && this.selectedDistrictName != null
        && this.iacreate.name_of_SHPI != null && this.iacreate.reg_No != null
        && this.iacreate.reg_Date != null && this.iacreate.name_of_CEO != null
        && this.iacreate.conNo_CEO != null && this.iacreate.name_of_Secretary != null
        && this.iacreate.name_of_MIS_Operator != null && this.iacreate.email_ID1_SHPI != null
        && this.iacreate.email_ID2_SHPI != null && this.iacreate.username != null
        && this.iacreate.password != "" && this.iacreate.ngO_Payout_Flag != null
        && this.iacreate.shG_Trans_Com != null && this.iacreate.ngO_Name_Flag != null
        && this.iacreate.ngO_Logo_Flag != null && this.iacreate.ngO_Member_Flag != null) {
        this.spinnerService.show();

        this.iacreate.reg_Date = this.convFromDate;

        const iaName = this.iacreate.name_of_SHPI.toUpperCase();
        this.iacreate.name_of_SHPI = iaName;

        const registerNo = this.iacreate.reg_No.trim();
        this.iacreate.reg_No = registerNo;

        
          const address = this.iacreate.address;
          this.iacreate.address = address;
        




        const ceoName = this.iacreate.name_of_CEO.replace(/\b\w/g, (x: string) => x.toUpperCase());

        this.iacreate.name_of_CEO = ceoName.trim();

        const secretatyName = this.iacreate.name_of_Secretary.replace(/\b\w/g, (x: string) => x.toUpperCase());

        this.iacreate.name_of_Secretary = secretatyName.trim();

        const operatorName = this.iacreate.name_of_MIS_Operator.replace(/\b\w/g, (x: string) => x.toUpperCase());
        this.iacreate.name_of_MIS_Operator = operatorName.trim();

        const email1 = this.iacreate.email_ID1_SHPI.trim();
        this.iacreate.email_ID1_SHPI = email1;

        const email2 = this.iacreate.email_ID2_SHPI.trim();
        this.iacreate.email_ID2_SHPI = email2;

        const username = this.iacreate.username.replace(/\b\w/g, (x: string) => x.toUpperCase());
        this.iacreate.username = username.trim();



       

        this.service.iaCreation(this.iacreate).subscribe(response => {
          this.iaResponseDetails = response;
          this.spinnerService.hide();

          if (response.length === 0) {
            this.message = "Failed";
            this.spinnerService.hide();
            this.snackBar.open(this.message, '', {

              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,

              panelClass: 'center',
            });
          }
          else {
            this.message = this.iaResponseDetails.message;
            this.spinnerService.hide();

            if (this.message == "Success") {
              this.router.navigate(['Admin/ia/view'])
              this.snackBar.open("IA added successfully", '', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',
              });
            }
            else {
              this.snackBar.open("IA name is already exists", '', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',
              });

            }


          }

        });



        // this.reloadCurrentRoute();
      }

    }

    else {



    }



    // else if (this.ceoName.invalid) {


    // }

    // else if (this.secretaryName.invalid) {

    // }

    // else if (this.misOperatorName.valid) {


    // }

    // else if (this.userName.invalid) {

    // }

    // if (this.ceoContactNumber.invalid) {
    // }

    // else if (this.misOperatorContactNumber.valid) {
    // }


    // else if (this.iaEmailId1.valid) {

    // }


    // else if (this.iaEmailId2.valid) {

    // }

    // else if (this.password.invalid) {

    // }

    // else {




    // }





  }



  iaNameEnter(iaName: string) {

    this.selectedIaName = "";


  }


  registrationNumberEnter(regi: string) {

    this.selectedRegistrationNumber = "";


  }

  enterceoName(ceoname: string) {

    this.selectedCeoName = "";

  }

  enterSecretaryname(secretaryName: string) {

    this.selectedSecretaryName = "";


  }


  enterOperatorName(operatorName: string) {
    this.selectedImsOperator = "";

  }

  enterUsername(userName: string) {

    this.selectedUserName = "";
  }

  districtTouch(name: any) {

    if (this.districtList.length == 0) {
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
  passwordChecking() {
    if (this.getPermission == "pass1") {



      if (this.enterFirstPass == this.enterSecondPass) {



        if ((this.enterFirstPass != null || this.enterFirstPass != "") && (this.enterSecondPass != null || this.enterSecondPass != "")) {
          this.serviceCall()
        }




        this.firstpassword = true;
        this.confirmpassword = true;

        this.confirmpassmsg = "Confirm password is required";
        this.firstpassmsg = "Password is required";
      }
      else {



        if (this.enterFirstPass == "") {
          this.firstpassmsg = "Password is required";

          this.firstpassword = true;

        }

        if (this.enterSecondPass == "") {
          this.confirmpassword = true;
          this.confirmpassmsg = "Confirm password is required";
        }

        else {
          this.enterSecondPass = "";
          this.confirmPassword.reset();
          this.confirmpassmsg = "Password mismatch";
          this.confirmpassword = true;

        }
      }
    }
    else {


      if (this.enterSecondPass == this.enterFirstPass) {


        if ((this.enterFirstPass != null || this.enterFirstPass != "") && (this.enterSecondPass != null || this.enterSecondPass != "")) {
          this.serviceCall()
        }




        this.firstpassword = true;
        this.confirmpassword = true;

        this.confirmpassmsg = " Confirm password is required ";
        this.firstpassmsg = "Password is required";
      }

      else {


        if (this.enterFirstPass == "") {
          this.firstpassmsg = "Password is required";

          this.firstpassword = true;

        }

        if (this.enterSecondPass == "") {
          this.confirmpassword = true;
          this.confirmpassmsg = "Confirm password is required";
        }

        else {
          this.enterSecondPass = "";
          this.confirmPassword.reset();
          this.confirmpassmsg = "Password mismatch";
          this.confirmpassword = true;
        }



      }



    }
  }

}

