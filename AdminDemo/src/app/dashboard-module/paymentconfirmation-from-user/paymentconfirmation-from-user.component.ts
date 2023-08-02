import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServicesService } from 'src/app/services.service';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';
import { Usermenudetails } from 'src/app/usermenudetails';
import { UserUpdateRequest } from 'src/app/user-update-request';  
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-paymentconfirmation-from-user',
  templateUrl: './paymentconfirmation-from-user.component.html',
  styleUrls: ['./paymentconfirmation-from-user.component.scss']
})
export class PaymentconfirmationFromUserComponent implements OnInit {

  email!:string;
  mobileNumber!:string;
  userName!:string;
  firstName!:string;
  lastName!:string;
  userId!:number;
  public formGroup! : FormGroup;

  number!:string;
  hideRequiredMarker=true;
  form: any;


  fname!:boolean;

  lname!:boolean;

  selectedfirstname="";
  selectedlastename="";


  userNameform = new FormControl();

  lastnameform = new FormControl();
  

  constructor(public dialogRef: MatDialogRef<PaymentconfirmationFromUserComponent>,private cdref: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any , private service : ServicesService,private snackBar:MatSnackBar,private spinnerService: NgxSpinnerService,private formBuilder : FormBuilder) { 
      
   
   
   
    }
     userUpdate : UserUpdateRequest = new UserUpdateRequest();
    signInDetail: Usermenudetails = new Usermenudetails();
    signInNavResponse: SignInNavResponse = new SignInNavResponse();

  
    
  ngOnInit() {
    
    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');
    // this.firstName =this.signInNavResponse.responseContent.firstName;
    // this.lastName = this.signInNavResponse.responseContent.lastName;
    this.userId = this.signInNavResponse.responseContent.id;
    // this.userName = this.signInNavResponse.responseContent.username;
    // this.mobileNumber = this.signInNavResponse.responseContent.mobileNo;
    // this.email = this.signInNavResponse.responseContent.email;
  }

  ngAfterContentChecked() {
    
    this.cdref.detectChanges();
 }

  emailAddress=new FormControl('', { validators: [ Validators.pattern('[a-zA-Z0-9.-]{4,}@([a-zA-Z]+([.-]?[a-zA-Z])){2,}[.]{1}[a-zA-Z]{3}$')] });
  mobile = new FormControl('', [Validators.pattern('^[6-9][0-9]{9}$')]);

  
  getMobileError() {
    if (this.mobile.hasError('required')) {
      return 'Mobile number is required';
    }
    return this.mobile.hasError('pattern') ? 'Enter valid mobile number' : '';
  }
  getEmailError() {
   
    return this.emailAddress.hasError('pattern') ? 'Enter valid Email ID': '';
  }
  
  get value()
  {
    return this.formGroup.controls;
  }
  save() {


 this.dialogRef.close();
      
  }

   
  
  

  













firstNameEnter(firstname:string)
{

 
  
  this.selectedfirstname =firstname;
  //this.userUpdate.firstName = this.data.firstName=firstname;
  
  this.fname=false;
  
}

lastNameEnter(lastname:string)
{

  this.lname=false;
  this.selectedlastename =lastname;
  //this.userUpdate.lastName = this.data.lastName=lastname;
}

usernameEnter(username:string)
{
  this.userUpdate.userName = this.data.userName=username;
 
}

mobileNumberEnter(mobileNO:string)
{

  
  
  
  this.userUpdate.mobileNo=this.data.mobileNumber=mobileNO;
}

emailEnter(email:string)
{
  this.userUpdate.email = this.data.email=email;

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

  var arrowLeft = 'ArrowLeft'
  var arrowRight = 'ArrowRight'
  var arrow : any

  if (evt.key==arrowRight||evt.key == arrowLeft){
    arrow = false;

  }else {
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

  this.userNameform.markAsUntouched();

}

onBlur1(): void {

  this.lastnameform.markAsUntouched();

}


}