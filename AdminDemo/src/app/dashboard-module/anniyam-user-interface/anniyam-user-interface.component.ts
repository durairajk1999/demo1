import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription, timer, map } from 'rxjs';
import { EnvService } from 'src/app/service/env.service';

@Component({
  selector: 'app-anniyam-user-interface',
  templateUrl: './anniyam-user-interface.component.html',
  styleUrls: ['./anniyam-user-interface.component.scss']
})
export class AnniyamUserInterfaceComponent implements OnInit {


  image!: boolean;




  constructor(private router: Router, private env: EnvService, private spinnerService: NgxSpinnerService, private snackBar: MatSnackBar, private dialog: MatDialog, public dialogRef: MatDialogRef<AnniyamUserInterfaceComponent>) {

    sessionStorage.setItem('wel', '1');
    sessionStorage.setItem('Q@123$></', '<>/{QWERGTSV#}');
    this.dialogRef.disableClose = true;



    this.env.isExpired = false;

    if (this.env.isExpired == false) {
      if (this.snackBar._openedSnackBarRef?.instance.data.message === "Session expired") {
        this.snackBar._openedSnackBarRef.dismissWithAction();
      }
    }


  }

  ngOnInit(): void {


    


    this.spinnerService.show();
    setTimeout(() => {


      this.display1();

    }, 2000);



  }







  display1() {




    this.spinnerService.hide();
  this.dialogRef.close();
 this.router.navigateByUrl('Admin')

  }
}


