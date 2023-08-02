import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EmailResponse } from 'src/app/email-response';
import { ServicesService } from 'src/app/services.service';


@Component({
  selector: 'app-emailverification',
  templateUrl: './emailverification.component.html',
  styleUrls: ['./emailverification.component.scss']
})
export class EmailverificationComponent implements OnInit {

  emailAddress!: string;

  otp!: string;

  responseMessage!: string;

  emailResponse: EmailResponse = new EmailResponse();

  hideRequiredMarker = true;

  verify = false;





  email!: any;
  constructor(private service: ServicesService,private cdref: ChangeDetectorRef, private router: Router, private snackBar: MatSnackBar, private spinnerService: NgxSpinnerService) { }



  ngOnInit() {
    this.email = localStorage.getItem('email');
    this.service.currentApprovalStageMessage.subscribe(msg => this.emailAddress = msg);

  }
  ngAfterContentChecked() {
    
    this.cdref.detectChanges();
 }
  resendOTP() {

    // this.service.getOTP(this.email).subscribe(data => {
      
    // })
  }

  getVerification() {
    if (this.otp == "" || this.otp == null) {
      this.verify = true;

    } else {
      this.spinnerService.show();
      
      // this.service.getOTPVerification(this.email, this.otp).subscribe(data => {
      //   this.emailResponse = data;

      //   if (this.emailResponse.statusCode == 200) {
      //     this.spinnerService.hide();
      //     this.responseMessage = this.emailResponse.message;
      //     this.snackBar.open(this.responseMessage, '',
      //       {
      //         horizontalPosition: 'center',
      //         verticalPosition: 'top',
      //         duration: 3000,
      //         panelClass: 'center',


      //       });
      //     this.router.navigateByUrl('email/newPassword');

      //   } else if (this.emailResponse.statusCode == 409) {
      //     this.spinnerService.hide();
      //     this.responseMessage = this.emailResponse.message;
      //     this.snackBar.open(this.responseMessage, '',
      //       {
      //         horizontalPosition: 'center',
      //         verticalPosition: 'top',
      //         duration: 3000,
      //         panelClass: 'center',


      //       });

      //   }
      //   else {


      //   }
      // })
    }
  }


}