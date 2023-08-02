import { formatNumber } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, Provider, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { AuditRequestAndResponse } from 'src/app/audit-request-and-response';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';
import { EncryptionDTO } from 'src/app/encryption-dto';
import { Locations } from 'src/app/locations';
import { Operaters } from 'src/app/operaters';
import { Recharge } from 'src/app/Recharge';
import { RechargeRequest } from 'src/app/recharge-request';
import { RechargeResponse } from 'src/app/recharge-response';
import { RechargeResponseContent } from 'src/app/recharge-response-content';
import { ServicesService } from 'src/app/services.service';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';






@Component({
  selector: 'app-sample-recharge',
  templateUrl: './sample-recharge.component.html',
  styleUrls: ['./sample-recharge.component.scss']
})
export class SampleRechargeComponent implements OnInit {

  rechargenumbervalue!: boolean;
  locationvalue!: boolean;
  providervalue!: boolean;
  mvalid = false;

  encryptandDecryptkey!: string;


  pagination = false;


  table = false;
  auditRequest: AuditRequestAndResponse = new AuditRequestAndResponse();
  auditDTO: EncryptionDTO = new EncryptionDTO();

  signInNavResponse: SignInNavResponse = new SignInNavResponse();

  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  recharge: Recharge = new Recharge();
  rechargeForm!: FormGroup;
  providers: Provider[] = [];
  hideRequiredMarker = "true";

  rcEncryptKey!: string;
  jriKey!: string;

  encryptDTO: EncryptionDTO = new EncryptionDTO();

  RechargeEncryptDTO: EncryptionDTO = new EncryptionDTO();

  rechargeRequest: RechargeRequest = new RechargeRequest;
  rechargeNumber !: string;

  rechargeResponse !: RechargeResponse;
  rechargeResponseContent !: RechargeResponseContent;
  rechargeResponseContents: RechargeResponseContent[] = [];
  operators: Operaters[] = [];
  locations: Locations[] = [];

  operator1: Record<any, any>[] = this.operators;
  operator2: Record<any, any>[] = this.operators;

  location1: Record<any, any>[] = this.locations;
  location2: Record<any, any>[] = this.locations;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;


  mobile = new FormControl('', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]);


  operator = new FormControl();
  circle = new FormControl();
  constructor(private service: ServicesService, private spinnerService: NgxSpinnerService, private cdref: ChangeDetectorRef, public dialog: MatDialog, private snackBar: MatSnackBar, private router: Router) {


    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');


  }
  isShow = false;
  // @ViewChild(MatSort) sort!: MatSort;



  // @ViewChild('firstTableSort', {static: false}) set firstTableSort(sort: MatSort) {
  //   this.dataSource.sort = sort;
  // }




  private sort!: MatSort;


  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.dataSource.sort = this.sort;
  }

  dataSource = new MatTableDataSource<RechargeResponseContent>(this.rechargeResponseContents);
  displayedColumns: string[] = ['date', 'location', 'message', 'provider', 'systemrefer', 'commisionamt', 'failurereason',
    'rechargenumber', 'amount', 'transrefer'];

  // @ViewChild('paginator', {static: false}) paginator!: MatPaginator;
  @ViewChild('paginator', { static: false }) set paginatorPageSize(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = "";
    }
  }
  //  ngAfterViewInit() {

  //       this.dataSource.sort = this.firstTableSort;
  //   }
  toggleDisplay() {
    this.isShow = true;
  }

  ngOnInit(): void {

    this.rechargenumbervalue = false;
    this.locationvalue = false;
    this.providervalue = false;
    this.rechargeRequest.serviceType = "M";
    this.service.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;
      const keyValue1 = keys.split("//");
      const firstDecrypt = this.encryptAndDecrypt.decryptfinal(keyValue1[1].trim(), keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      const finalkeyValue1 = finalkeyValue;

      this.encryptandDecryptkey = finalkeyValue1[0].trim();
      this.jriKey = finalkeyValue1[2].trim();

      if (this.encryptandDecryptkey != "" || this.encryptandDecryptkey != null) {
        this.getValue();
      }
    });








    // const encryptData = this.encryptAndDecrypt.encryptfinal(this.rechargeRequest, this.rcEncryptKey)


    //this.encryptDTO.data = encryptData;





  }
  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }
  getMobileError() {
    if (this.mobile.hasError('required')) {
      return 'Mobile number is required';
    }
    return this.mobile.hasError('pattern') ? 'Please enter valid 10 digit mobile number' : '';
  }

  onBlur(): void {

    this.mobile.markAsUntouched();

  }

  providerselect(provider: string) {

    this.table = false;

    this.isShow = false;

    this.pagination = false;

    this.dataSource.data = [];


    this.providervalue = false;
    this.recharge.provider = provider;
  }

  locationselect(location: string) {


    this.table = false;

    this.isShow = false;

    this.pagination = false;

    this.dataSource.data = [];


    this.locationvalue = false;
    this.recharge.location = location;


  }


  sampleRecharge() {


    this.mobile.setValidators([Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]);
    this.mobile.updateValueAndValidity();


    if ((this.recharge.rechargeNumber == null || this.recharge.rechargeNumber == "") && (this.recharge.location == null || this.recharge.location == "") && (this.recharge.provider == null || this.recharge.provider == "")) {
      this.rechargenumbervalue = true;
      this.locationvalue = true;
      this.providervalue = true;


    }
    else {

      if (this.recharge.location == null || this.recharge.location == "") {

        this.locationvalue = true;

        if (this.recharge.provider == null || this.recharge.provider == "") {
          this.providervalue = true;
        }

        if (this.recharge.rechargeNumber == null || this.recharge.rechargeNumber == "") {

          this.rechargenumbervalue = true;
        }

      }

      else if (this.recharge.provider == null || this.recharge.provider == "") {

        this.providervalue = true;

        if (this.recharge.rechargeNumber == null || this.recharge.rechargeNumber == "") {

          this.rechargenumbervalue = true;
        }

        if (this.recharge.location == null || this.recharge.location == "") {

          this.locationvalue = true;

          if (this.recharge.provider == null || this.recharge.provider == "") {

            this.providervalue = true;

          }


          if (this.recharge.rechargeNumber == null || this.recharge.rechargeNumber == "") {

            this.rechargenumbervalue = true;
          }

        }



      }

      else if (this.mobile.invalid) {

        this.rechargenumbervalue = true;




      }



      else {



        this.dataSource.data = [];
        this.rechargeResponseContents = [];



        this.pagination = false;
        this.table = false;



        this.rechargeRequest.location = this.recharge.location;
        this.rechargeRequest.provider = this.recharge.provider;
        this.rechargeRequest.amount = "10";
        this.rechargeRequest.isPostpaid = "N";
        this.rechargeRequest.merchantId = "AE33000136";
        this.rechargeRequest.rechargeNumber = this.recharge.rechargeNumber;

        this.rechargeRequest.serviceType = "M";
        this.rechargeRequest.useIncentive = "No";

        this.rechargeRequest.agentId = "";
        this.rechargeRequest.nickName = "";
        this.rechargeRequest.isspecial = "N";
        this.rechargeRequest.securityKey = "";
        this.rechargeRequest.systemReference = "";
        this.rechargeRequest.apicheckSum = "";
        this.rechargeRequest.authKey = "";
        this.rechargeRequest.corporateNumber = "";




        //




        // {
        //   "agentId": "",
        //   "amount": "10",
        //   "apicheckSum": "",
        //   "appId": "F6E46507-07FB-4CA7-90FC-D1A48111864C", // o
        //   "authKey": "string",
        //   "corporateNumber": "",
        //   "isPostpaid": "N",
        //   "isspecial": "",
        //   "location": "",
        //   "merchantId": "AE33000136",

        //   "nickName": "",
        //   "provider": "Airtel",
        //   "rechargeNumber": "9976695806",
        //   "securityKey": "",
        //   "serviceType": "M",
        //   "systemReference": "",
        //   "useIncentive": "Yes"
        // }





        this.spinnerService.show();




        const rechargeRequest = this.encryptAndDecrypt.encryptfinal(this.rechargeRequest, this.jriKey);

        this.RechargeEncryptDTO.data = rechargeRequest;

        this.service.sampleRecharge(this.RechargeEncryptDTO).subscribe(data => {


          const rechargeDecryptResposne = this.encryptAndDecrypt.decryptfinal(data.data, this.jriKey);


          const rechargeResposne = JSON.parse(rechargeDecryptResposne);



          this.rechargeResponse = rechargeResposne;
          this.rechargeResponseContent = this.rechargeResponse.responseContent;

          if (rechargeResposne.statusCode == 409) {

            this.snackBar.open("Recharge Failed", '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',


              });

            this.rechargeAudit(this.rechargeRequest.merchantId, this.rechargeRequest.amount, "Failed");
          }
          else {


            if (this.rechargeResponseContent.Message == "Recharge Successful") {
              this.spinnerService.hide();
              var stringToConvert = this.rechargeResponseContent.Amount;
              var numberValue = Number(stringToConvert);

              let formatAmo = formatNumber(numberValue, 'en-US',
                '1.2');
              var wholeAmo = formatAmo.replace(/,/g, "")
              var deciAmo = Number(wholeAmo)
              var conv = deciAmo.toLocaleString('en-IN', {
                minimumFractionDigits: 2, maximumFractionDigits: 2
              })


              this.rechargeResponseContent.Amount = conv;


              this.rechargeResponseContent.Message = "Recharge Success";

              this.snackBar.open("Recharge success", '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',


                });

              this.mobile.reset();
              this.mobile.setErrors(null);
              this.operator.reset();
              this.circle.reset();
              this.pagination = true;
              this.table = true;

              this.rechargeResponseContent.failureReason = "-";


              this.rechargeResponseContents.push(this.rechargeResponseContent);
              this.dataSource.data = this.rechargeResponseContents;
              this.rechargeAudit(this.rechargeRequest.merchantId, this.rechargeRequest.amount, "Success");
            }
            else {


              this.spinnerService.hide();

              if (this.rechargeResponseContent.Message == "Recharge Unsuccessful") {

                this.snackBar.open("Recharge failed", '',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 3000,
                    panelClass: 'center',


                  });

                this.pagination = true;
                this.table = true;
                this.mobile.reset();
                this.mobile.setErrors(null);
                this.operator.reset();
                this.circle.reset();

                var stringToConvert = this.rechargeResponseContent.Amount;
                var numberValue = Number(stringToConvert);

                let formatAmo = formatNumber(numberValue, 'en-US',
                  '1.2');
                var wholeAmo = formatAmo.replace(/,/g, "")
                var deciAmo = Number(wholeAmo)
                var conv = deciAmo.toLocaleString('en-IN', {
                  minimumFractionDigits: 2, maximumFractionDigits: 2
                })


                this.rechargeResponseContent.Amount = conv;

                this.rechargeResponseContent.CommissionAmount = "0.00";
                this.rechargeResponseContent.Message = "Recharge Failed";

                this.rechargeResponseContents.push(this.rechargeResponseContent);
                this.dataSource.data = this.rechargeResponseContents;

                this.rechargeAudit(this.rechargeRequest.merchantId, this.rechargeRequest.amount, "unsuccessful");
              }

              else {




                if (this.rechargeResponseContent.Message == "Recharge Inprocess") {

                  this.spinnerService.hide();


                  var stringToConvert = this.rechargeResponseContent.Amount;
                  var numberValue = Number(stringToConvert);

                  let formatAmo = formatNumber(numberValue, 'en-US',
                    '1.2');
                  var wholeAmo = formatAmo.replace(/,/g, "")
                  var deciAmo = Number(wholeAmo)
                  var conv = deciAmo.toLocaleString('en-IN', {
                    minimumFractionDigits: 2, maximumFractionDigits: 2
                  })


                  this.rechargeResponseContent.Amount = conv;

                  this.snackBar.open("Recharge In Progress", '',
                    {
                      horizontalPosition: 'center',
                      verticalPosition: 'top',
                      duration: 3000,
                      panelClass: 'center',


                    });
                  this.pagination = true;
                  this.table = true;
                  this.mobile.reset();
                  this.mobile.setErrors(null);
                  this.operator.reset();
                  this.circle.reset();

                  this.rechargeResponseContent.Message = "Recharge In Progress";

                  this.rechargeResponseContents.push(this.rechargeResponseContent);
                  this.dataSource.data = this.rechargeResponseContents;
                  this.rechargeAudit(this.rechargeRequest.merchantId, this.rechargeRequest.amount, "inprogress");

                }
                else {


                }





              }



            }

          }













        });

        // end here 



        // this.rechargeResponseContent.amount = "10.00";
        // this.rechargeResponseContent.commissionAmount = "0.12";
        // this.rechargeResponseContent.date = "2022-11-09";
        // this.rechargeResponseContent.failureReason = "Recharge successful";
        // this.rechargeResponseContent.isPostPaid = "N";
        // this.rechargeResponseContent.isSpecial = "N";
        // this.rechargeResponseContent.location = this.rechargeRequest.location;
        // this.rechargeResponseContent.message = "Success";
        // this.rechargeResponseContent.provider = this.rechargeRequest.provider;
        // this.rechargeResponseContent.rechargeNumber = this.rechargeRequest.rechargeNumber;
        // this.rechargeResponseContent.serviceType = "M";
        // this.rechargeResponseContent.rechargeRequestDateTime = "10:33:55 AM";
        // this.rechargeResponseContent.systemReference = "LYM09298398379";
        // this.rechargeResponseContent.transactionReference = "8847294019822";


        // this.rechargeResponseContents.push(this.rechargeResponseContent);







      }


    }









  }




  //           Message
  // : 
  // "Success"
  // isValid
  // : 
  // false


  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }


  letterOnly(event: any) {
    event.target.maxLength = 30;

    var charCode = event.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)

      return true;
    else
      return false;
  }



  getValue() {



    const encryptDTO = this.encryptAndDecrypt.encryptfinal(this.rechargeRequest, this.jriKey);

    this.encryptDTO.data = encryptDTO;

    this.service.getProvidersAndLocations(this.encryptDTO).subscribe(response => {



      const decryptData = this.encryptAndDecrypt.decryptfinal(response.data, this.jriKey)

      const decryptresposne = JSON.parse(decryptData);



      this.rechargeResponse = decryptresposne;
      this.rechargeResponseContent = this.rechargeResponse.responseContent;
      this.locations = this.rechargeResponseContent.locations;


      this.location1 = this.locations;
      this.location2 = this.locations;




      this.operators = this.rechargeResponseContent.operators;

      this.operator1 = this.operators;
      this.operator2 = this.operators;


    });
  }


  rechargeAudit(merchantid: any, amt: any, msg: any) {



    this.auditRequest.actionName = "Recharge"
    this.auditRequest.responseStatus = msg;
    this.auditRequest.userId = this.signInNavResponse.responseContent.id.toString();
    this.auditRequest.userName = this.signInNavResponse.responseContent.username;
    this.auditRequest.beneficiary = merchantid;
    this.auditRequest.amount = amt;


    const encryptData = this.encryptAndDecrypt.encryptfinal(this.auditRequest, this.encryptandDecryptkey);

    this.auditDTO.data = encryptData;



    this.service.auditRequest(this.auditDTO).subscribe(auditResponse => {


      const decryptData = this.encryptAndDecrypt.decryptfinal(auditResponse.data, this.encryptandDecryptkey);


      //("decryt respose ")
      //(decryptData);

      var decryptResposen = JSON.parse(decryptData);



      if (decryptResposen.statusCode == 200) {

      }
      else {

      }


    })

  }

}