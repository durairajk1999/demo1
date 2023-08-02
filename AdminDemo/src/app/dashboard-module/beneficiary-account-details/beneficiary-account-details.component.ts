import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ServicesService } from 'src/app/services.service';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';
import { NotificationPopupComponentComponent } from '../notification-popup-component/notification-popup-component.component';
import { FTBeneficiaryDetailsDTO } from '../notify-component/FTBeneficiaryDetailsDTO';
import { ResponseBene } from '../notify-component/ResponseBene';
import { StatusUpdateRequest } from '../notify-component/StatusUpdateRequest';
import { PopUpComponentComponent } from '../pop-up-component/pop-up-component.component';
import { DatePipe, formatNumber } from '@angular/common';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxSpinnerService } from 'ngx-spinner';
import { AccountDetailsViewPopupComponent } from '../account-details-view-popup/account-details-view-popup.component';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';
import { EncryptionDTO } from 'src/app/encryption-dto';
import { EncryptAndDecryptResponse } from 'src/app/encrypt-and-decrypt-response';

@Component({
  selector: 'app-beneficiary-account-details',
  templateUrl: './beneficiary-account-details.component.html',
  styleUrls: ['./beneficiary-account-details.component.scss'],
  providers: [DatePipe]
})
export class BeneficiaryAccountDetailsComponent implements OnInit {

  userid: any;

  dateconv!: any
  todateValue!: any;

  addressValue: any;

  debitAccountNoValue: any;

  beneficiaryAccountNoValue: any;

  beneficiaryIFSCValue: any;

  pagination = false;

  beneficiaryNameValue: any;

  maxLimitValue: any;

  finalkeyValue1!:string;

  keyValue1!:string;
  statusValue: any;

  decryptResposneCatch: ResponseBene = new ResponseBene();

  encryptDTO: EncryptionDTO = new EncryptionDTO();

  transferTypeValue: any;

  beneAccountNumber = "";

  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  bankNameValue: any;

  branchNameValue: any;

  shortNameValue: any;

  show!: boolean
  comment!: any;
  encryptandDecryptkey!: string;

  groupNameSearch = new FormControl();



  signInNavResponse: SignInNavResponse = new SignInNavResponse();
  request: StatusUpdateRequest = new StatusUpdateRequest();
  responseBene: ResponseBene = new ResponseBene();
  details: FTBeneficiaryDetailsDTO[] = [];

  displayedColumns: string[] = ['createdDate', 'beneficiaryName', 'beneficiaryAccountNumber', 'beneficiaryIFSC', 'shortName', 'bankName', 'branchName', 'beneficiaryStatus', 'actions', 'actions1'];


  // displayedColumns: string[] = ['createdDate', 'beneficiaryName', 'beneficiaryAccountNumber', 'beneficiaryIFSC', 'shortName', 'bankName', 'branchName', 'maxLimit', 'userName', 'debitAccountNumber', 'beneficiaryStatus', 'approvedBy', 'modifiedDate', 'accountStatus', 'actions1','actions'];

  constructor(private spinnerService: NgxSpinnerService, private datePipe: DatePipe, public dialog: MatDialog, private cdref: ChangeDetectorRef, private service: ServicesService, private snackBar: MatSnackBar, private route: Router) {


    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');

  }

  dataSource = new MatTableDataSource<FTBeneficiaryDetailsDTO>(this.details);



  @ViewChild('paginator', { static: false }) set paginatorPageSize(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = "";
      this.dataSource.paginator.selectConfig.disableOptionCentering = true;
    }
  }


  private sort!: MatSort;
  private sort2!: MatSort;


  @ViewChild('firstTableSort') set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }


  setDataSourceAttributes() {
    this.dataSource.sort = this.sort;

  }
  ngOnInit(): void {


  

    this.service.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;
      this.keyValue1 = keys.split("//");
      const firstDecrypt = this.encryptAndDecrypt.decryptfinal(this.keyValue1[1].trim(), this.keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      this.finalkeyValue1 = finalkeyValue;

      this.encryptandDecryptkey = this.finalkeyValue1[0].trim();

      if (this.encryptandDecryptkey != "" || this.encryptandDecryptkey != null) {
        this.display(this.encryptandDecryptkey);
      }
    });



    
   
  }

  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }
  approve(accountNo: any, userId: any) {

    {


      if (userId == this.signInNavResponse.responseContent.id) {
        this.snackBar.open("Can\'t approve the request raised by yourself", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });

      }
      else {
        this.beneAccountNumber = accountNo;

        const dialogRef = this.dialog.open(NotificationPopupComponentComponent, {
          width: '400px',
          data: {
            message: 'Are you sure want to approve ?',
            //user:userId,
            accountNumber: accountNo,
            //statusValue :status

          }

        });

        dialogRef.afterClosed().subscribe(result => {

          

          if (result) {
           
            this.approveConfirmed(this.beneAccountNumber);
          }
          else {
          
            this.beneAccountNumber = "";
          }



        });


      }



    }
  }

  



  // this.request.approvedBy = this.signInNavResponse.responseContent.username;
  // this.request.status = "Approved";
  // this.request.modifiedBy = this.signInNavResponse.responseContent.id;
  // this.request.userId=this.userid;
  // // this.request.beneficiaryAccountNumber =this.responseBene.responseContent.beneficiaryAccountNumber;


  //     this.service.statusUpdate(this.request).subscribe(data=>
  //       {
  //        

  //         if(data.statusCode == 200)
  //         {
  //           this.snackBar.open(data.message, '',
  //             {
  //               horizontalPosition: 'center',
  //               verticalPosition: 'top',
  //               duration: 3000,
  //               panelClass: 'center',


  //             });
  //             this.reloadCurrentRoute();
  //             // this.dialogRef.close();


  //         }
  //         else {

  //           this.snackBar.open(data.message, '',
  //             {
  //               horizontalPosition: 'center',
  //               verticalPosition: 'top',
  //               duration: 3000,
  //               panelClass: 'center',


  //             });
  //             this.reloadCurrentRoute();
  //             // this.dialogRef.close();

  //         }
  //       })


  //   }

  reject(accountNo: any, userId: any) {

    {



      {

        if (userId == this.signInNavResponse.responseContent.id) {
          this.snackBar.open("Can\'t reject the request raised by yourself", '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',


            });
        }
        else {
          this.beneAccountNumber = accountNo;

          const dialogRef = this.dialog.open(NotificationPopupComponentComponent, {
            width: '400px',
            data: {
              message: 'Are you sure want to reject ?',
              //user:userId,
              accountNumber: accountNo,
              //statusValue:status

            }

          });

          dialogRef.afterClosed().subscribe(result => {

          
            if (result) {
              
              this.rejectConfirmed(this.beneAccountNumber);
            }
            else {
            
              this.beneAccountNumber = "";
            }

          });

        }



      }
    }


  }






  //     this.request.approvedBy = this.signInNavResponse.responseContent.username;
  // this.request.status = "Rejected";
  // this.request.modifiedBy = this.signInNavResponse.responseContent.id;
  // this.request.userId=this.userid;
  // // this.request.beneficiaryAccountNumber =this.responseBene.responseContent.beneficiaryAccountNumber;

  //     this.service.statusUpdate(this.request).subscribe(data=>{
  //      
  //       if(data.statusCode == 200)
  //         {
  //           this.snackBar.open(data.message, '',
  //             {
  //               horizontalPosition: 'center',
  //               verticalPosition: 'top',
  //               duration: 3000,
  //               panelClass: 'center',


  //             });
  //             this.reloadCurrentRoute();
  //             // this.dialogRef.close();

  //         }
  //         else {

  //           this.snackBar.open(data.message, '',
  //             {
  //               horizontalPosition: 'center',
  //               verticalPosition: 'top',
  //               duration: 3000,
  //               panelClass: 'center',


  //             });
  //             this.reloadCurrentRoute();
  //             // this.dialogRef.close();

  //         }

  //     })





  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  isAlfa(evt: any) {


    evt = (evt || window.event);
    var charCode = (evt.which || evt.keyCode);
    var del = 'Delete'

    var arrowLeft = 'ArrowLeft'
    var arrowRight = 'ArrowRight'
    var arrow: any

    if (evt.key == arrowRight || evt.key == arrowLeft || evt.key == del || evt.key == '/' || evt.key == '@' || evt.key == ':' || evt.key == '.') {
      arrow = false;

    }


    else {
      arrow = true;
    }
    var numberBoolean: any;
    if (evt.key == "0" || evt.key == "1" || evt.key == "2" || evt.key == "3" || evt.key == "4" || evt.key == "5" || evt.key == "6" || evt.key == "7" || evt.key == "8" || evt.key == "9") {
      numberBoolean = false;
    }
    else {
      numberBoolean = true;
    }

    return ((
      (charCode > 32)
      && (charCode < 65 || charCode > 90)
      && (charCode < 97 || charCode > 122) && (arrow)

    ) && (numberBoolean) || this.willCreateWhitespaceSequence(evt)) ? false : true;
  }



  handleInput(event: any) {
    if (event.target.selectionEnd === 0 && event.code === 'Space') {
      event.preventDefault();
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  approveConfirmed(accNumber: string) {

    this.spinnerService.show();

    this.request.approvedBy = this.signInNavResponse.responseContent.username;
    this.request.status = "Approved";
    this.request.modifiedBy = this.signInNavResponse.responseContent.id;

    this.request.beneficiaryAccountNumber = accNumber;


   

    const encryptRequest = this.encryptAndDecrypt.encryptfinal(this.request, this.encryptandDecryptkey)


    this.encryptDTO.data = encryptRequest;


    this.service.statusUpdate(this.encryptDTO).subscribe(data => {


      const decryptResposne = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptandDecryptkey);



      this.decryptResposneCatch = JSON.parse(decryptResposne);

      this.spinnerService.hide();

      if (this.decryptResposneCatch.statusCode == 200) {

        this.snackBar.open(this.decryptResposneCatch.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });
       this.reloadCurrentRoute();
      } else {

        if (this.decryptResposneCatch.statusCode == 409) {
          this.snackBar.open("Account verification Failed", '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',


            });
        }

        this.reloadCurrentRoute();

      }
    })

  }

  rejectConfirmed(accNo: string) {




    this.spinnerService.show();
    this.request.approvedBy = this.signInNavResponse.responseContent.username;
    this.request.status = "Rejected";
    this.request.modifiedBy = this.signInNavResponse.responseContent.id;

    this.request.beneficiaryAccountNumber = accNo;


    


    const encryptRejectRequest = this.encryptAndDecrypt.encryptfinal(this.request, this.encryptandDecryptkey);

    this.encryptDTO.data = encryptRejectRequest;


    this.service.statusUpdate(this.encryptDTO).subscribe(data => {


      const rejectResposne = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptandDecryptkey);


      this.decryptResposneCatch = JSON.parse(rejectResposne);

      this.spinnerService.hide();

      if (this.decryptResposneCatch.statusCode == 200) {

        this.snackBar.open(this.decryptResposneCatch.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });
         
        this.reloadCurrentRoute();
      } else {

        if (this.decryptResposneCatch.statusCode == 409) {
          this.snackBar.open("Account verification Failed", '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',


            });
        }
        

        
        this.reloadCurrentRoute();


      }
    })
  }

  display(keyValue: string) {


    this.spinnerService.show();
    this.service.beneficiaryGet().subscribe(data => {


      const decryptData = this.encryptAndDecrypt.decryptfinal(data.data, keyValue);



      this.responseBene = JSON.parse(decryptData);


      this.spinnerService.hide();




      if (this.responseBene.responseContent.length == 0) {
        this.dataSource.data = [];


        this.snackBar.open("Record not found", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });



      }
      else {

        // this.responseBene = data;



        for (let i = 0; i < this.responseBene.responseContent.length; i++) {

          if (this.responseBene.responseContent[i].createdDate == "-") {

          }
          else {
            var dat = this.responseBene.responseContent[i].createdDate
            let myDate1 = dat.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
            this.dateconv = this.datePipe.transform(myDate1, 'dd/MM/yyyy hh:mm:ss a', 'es-ES');
            this.responseBene.responseContent[i].createdDate = this.dateconv;
          }



          if (this.responseBene.responseContent[i].modifiedDate === '-') {

          }
          else {
            var todate = this.responseBene.responseContent[i].modifiedDate
            let updateDate = todate.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
            this.todateValue = this.datePipe.transform(updateDate, 'dd/MM/yyyy hh:mm:ss a', 'es-ES');
            this.responseBene.responseContent[i].modifiedDate = this.todateValue;



          }

        }




        this.responseBene.responseContent.forEach(amt => {
          var amount = amt.maxLimit

          var numDepo: number = +amount;


          let formatDepo = formatNumber(numDepo, 'en-US',
            '1.2');

          var wholeDep = formatDepo.replace(/,/g, "")


          var deciDep = Number(wholeDep)


          var convDep = deciDep.toLocaleString('en-IN', {
            minimumFractionDigits: 2, maximumFractionDigits: 2
          })

          amt.maxLimit = convDep


        })

        this.show = true;
        this.pagination = true;



        this.dataSource.data = this.responseBene.responseContent;

      }




    });

  }

  startView(debitAccountNumber: string, userName: string, maxLimit: string, approvedBy: string, modifiedDate: string, accountStatus: string) {
    const dialogRef = this.dialog.open(AccountDetailsViewPopupComponent, {

      width: '380px',
      autoFocus: false,

      data: {
        debitAccountNumber: debitAccountNumber, userName: userName, maxLimit: maxLimit, approvedBy: approvedBy, modifiedDate: modifiedDate, accountStatus: accountStatus
      }
    });
  }
}



