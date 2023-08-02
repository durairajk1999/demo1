import { Component, OnInit } from '@angular/core';
import { AnniyamUserInterfaceComponent } from '../dashboard-module/anniyam-user-interface/anniyam-user-interface.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EnvService } from '../service/env.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {


  constructor(private router: Router, private env: EnvService, private spinnerService: NgxSpinnerService, private snackBar: MatSnackBar, private dialog: MatDialog) {




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
    this.userLogedIn();

  }

  userLogedIn() {


    var sess = sessionStorage.getItem("wel")

   
    if (sess === "1") {
      this.router.navigateByUrl('Admin')
    } else {
      const dialogRef = this.dialog.open(AnniyamUserInterfaceComponent, {
        panelClass: "dialog-responsive",
        backdropClass: 'popupBackdropClass',
        autoFocus: false,
        data: {
          message: 'Money Purse '
        }
      });
    }
  }



  display1() {
    //this.dialogRef.close();
  }



}
