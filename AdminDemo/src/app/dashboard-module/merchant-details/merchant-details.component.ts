import { TemplateBindingParseResult } from '@angular/compiler';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { formatNumber } from '@angular/common';

import { NgxSpinnerService } from 'ngx-spinner';

import { Merchantdetails } from 'src/app/merchantdetails';
import { ServicesService } from 'src/app/services.service';
import { State } from 'src/app/state-details';
import { StatedetailsResult } from 'src/app/statedetails-result';



@Component({
  selector: 'app-merchant-details',
  templateUrl: './merchant-details.component.html',
  styleUrls: ['./merchant-details.component.scss']
})
export class MerchantDetailsComponent implements AfterViewInit, OnInit {


  constructor(private service: ServicesService, private cdref: ChangeDetectorRef, private snackBar: MatSnackBar, private spinnerService: NgxSpinnerService) { }
  merchantState = false;
  merchantDistrict = false;
  merchantIa = false;
  newMerchant = false;
  table = false;
  merchant!: string;

  pagination = false;
  table1 = false;

  newMerchantID = "";
  selectedStateName = "";
  districtSelectedValue = "";
  selectedIa = "";
  selectedMerchantValue = "";
  merchantValue: any;
  stateListResponse: State = new State();

  stateResult: StatedetailsResult[] = [];




  selectediaName = "";

  selectedstate = "";
  selecteddistrict = "";
  selectedmerchant = "";

  merchantCodeEnter = new FormControl();




  statelist1: Record<any, any>[] = this.stateResult;
  statelist2: Record<any, any>[] = this.stateResult;

  statelist3: Record<any, any>[] = this.stateResult;




  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;

  districtListResponse: State = new State();
  statedetailsResult: StatedetailsResult[] = [];

  iadetailsResult: StatedetailsResult[] = [];

  merchantDetailsResult: StatedetailsResult[] = [];

  merchantdetailsResult: StatedetailsResult[] = [];
  iaDetailsResult: StatedetailsResult[] = [];


  districtlist1: Record<any, any>[] = this.statedetailsResult;
  districtlist2: Record<any, any>[] = this.statedetailsResult;


  // districtResponse:State[] = [];
  iaListResponse: State = new State();

  ialist1: Record<any, any>[] = this.iaDetailsResult;
  ialist2: Record<any, any>[] = this.iaDetailsResult;



  merchantListResponse: State = new State();

  merchantlist1: Record<any, any>[] = this.merchantDetailsResult;
  merchantlist2: Record<any, any>[] = this.merchantDetailsResult;



  merchantBalanceResponse: State = new State();
  merchantobject: StatedetailsResult = new StatedetailsResult();
  merchantobject2: Merchantdetails = new Merchantdetails();
  merchantTableResponse: StatedetailsResult[] = [];





  sta = new FormControl();
  dis = new FormControl();
  ia = new FormControl();
  mer = new FormControl();
  ngOnInit() {
    this.stateSelected()
  }
  merchantdetailsform!: FormGroup;
  hideRequiredMarker = true;
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }
  merchantdetails: Merchantdetails = new Merchantdetails();
  displayedColumns: string[] = ['state_Name','district_Name','IA','merchantname', 'merchantID', 'pin', 'tpin', 'walletbalance', 'incentiveearned'];
  private sort!: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.dataSource.sort = this.sort;
  }
  dataSource = new MatTableDataSource<StatedetailsResult>(this.merchantTableResponse);
  @ViewChild('paginator', { static: false }) set paginatorPageSize(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl();
      this.dataSource.paginator._intl.itemsPerPageLabel = "";
      this.dataSource.paginator.selectConfig.disableOptionCentering = true;
    }
  }
  @ViewChild('paginatorNew', { static: false }) set paginator(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl();
      this.dataSource.paginator._intl.itemsPerPageLabel = "";
      this.dataSource.paginator.selectConfig.disableOptionCentering = true;
    }
  }
  stateSelected() {
    this.service.getStateService().subscribe(statelist => {
      this.stateResult = statelist.result;
      this.statelist1 = this.stateResult;
      this.statelist2 = this.stateResult;


    })
  }
  stateSelectedValue(stateName: string) {
    this.selectedStateName = stateName;
    this.districtSelectedValue = "";
    this.dis.reset();
    this.ia.reset();
    this.mer.reset();
    this.merchantState = false;
    this.merchantobject.merchantID = "";
    this.statedetailsResult = [];
    this.iaListResponse.result = [];





    this.merchantlist1 = [];
    this.merchantlist2 = [];


    this.ialist1 = [];
    this.ialist2 = [];

    this.selectediaName = "";

    this.selectedstate = stateName;
    this.selecteddistrict = "";
    this.selectedmerchant = "";





    this.dataSource.data = [];
    this.pagination = false;
    this.table1 = false;



    this.merchant = "";
    this.service.districtNameFetch(stateName).subscribe(districtlist => {
      this.statedetailsResult = districtlist.result;
      this.districtlist1 = this.statedetailsResult;
      this.districtlist2 = this.statedetailsResult;
    })
  }
  selectedDistrict(districtName: string) {
    this.districtSelectedValue = districtName;
    this.merchantDistrict = false;

    this.iaListResponse.result = [];
    this.selectedIa = "";


    this.merchantlist1 = [];
    this.merchantlist2 = [];




    this.selectediaName = "";


    this.selecteddistrict = districtName;
    this.selectedmerchant = "";



    this.dataSource.data = [];
    this.pagination = false;
    this.table1 = false;

    this.ia.reset();
    this.mer.reset();

    this.service.getIaNameList(this.selectedStateName, districtName).subscribe(iadetailslist => {


      this.iaListResponse = iadetailslist;
      this.iaDetailsResult = this.iaListResponse.result;
      if (this.iaListResponse.result[0] == null) {
        this.snackBar.open('IA name not found', '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',
          }
        )
      }

      this.ialist1 = this.iaDetailsResult;
      this.ialist2 = this.iaDetailsResult;
    })
  }


  iaSelect(iaId: any) {
    this.selectedIa = iaId;
    this.merchantIa = false;


    this.selectediaName = iaId;



    this.selectedmerchant = "";

    //this.selectedia=iaId;

    this.selectedmerchant = "";

    this.dataSource.data = [];
    this.pagination = false;
    this.table1 = false;

    this.merchant = "";
    this.merchantListResponse.result = [];
    this.mer.reset();
    this.selectedMerchantValue = "";
    this.service.merchantDetails(iaId).subscribe(merchantdetailslist => {

      this.merchantListResponse = merchantdetailslist;
      this.merchantDetailsResult = this.merchantListResponse.result;

      if (this.merchantListResponse.result[0] == null) {

        this.snackBar.open('Merchant name not found', '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',
          })

        this.newMerchant = false;

      }

      this.merchantlist1 = this.merchantDetailsResult
      this.merchantlist2 = this.merchantDetailsResult
    })
  }
  selectedMerchant(merchantid: string) {
    this.newMerchant = false;
    this.merchant = "";


    this.dataSource.data = [];
    this.pagination = false;
    this.table1 = false;

    this.selectedMerchantValue = merchantid;

  }
  change() {
    this.merchantState = false;
    this.merchantDistrict = false;


    this.dataSource.data = [];
    this.pagination = false;
    this.table1 = false;

    this.merchantIa = false;
    this.newMerchant = false;
    this.selectedMerchantValue = this.merchantobject2.merchantID;
    this.sta.reset();
    this.dis.reset();
    this.ia.reset();
    this.mer.reset();
  }
  getNewMerchant() {

    if (this.merchantCodeEnter.valid) {
      this.merchantValue = this.merchant;
      var merchantORphone = "";

      //var isMerchantCode=this.onlyLettersAndNumbers(this.merchantValue)



      if (this.merchantValue.match(/[A-Z_a-z]/)) {
        merchantORphone = "merchant";

        
      }
      else {
        merchantORphone = "mobile";
        
      }



      
      this.spinnerService.show();

      const merchantUpperCase = this.merchantValue.toUpperCase();
      this.merchantValue = merchantUpperCase.trim();
    

      this.table = true;

      this.service.fetchmerchantBalance(this.merchantValue, merchantORphone,).subscribe(merchantResponse => {
        
        
        
        this.merchantBalanceResponse = merchantResponse;
        this.merchantTableResponse = this.merchantBalanceResponse.result;

        
        if (merchantResponse.result.length == 0) {
          this.spinnerService.hide();
          this.pagination = false;
          this.table1 = false;
          this.snackBar.open('Record not found', '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',
            });
        }
        else {
          this.service.merchantWalletbalancefetch(this.merchantTableResponse[0].merchantID).subscribe(merchantwalletrespose => {
            
            
           
            if (merchantwalletrespose == null) {
              this.spinnerService.hide();
              

              this.snackBar.open('The merchant is not yet logged in', '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',
                });
                this.pagination = false;
              this.table1 = true;

                this.dataSource.data =merchantResponse.result;;


            } else {
              // this.snackBar.open('Data fetched successfully', '',
              //   {
              //     horizontalPosition: 'center',
              //     verticalPosition: 'top',
              //     duration: 3000,
              //     panelClass: 'center',
              //   });

              this.pagination = false;
              this.table1 = true;

              // pending work  for wallet balance 

              for (let i = 0; i < this.merchantTableResponse.length; i++) {
                this.merchantTableResponse[i].incentivewalletamount = merchantwalletrespose.incentivewalletamount;
                this.merchantTableResponse[i].masterwalletamount = merchantwalletrespose.masterwalletamount
              }
              this.merchantTableResponse.forEach(amt => {
                var amo = amt.masterwalletamount
                var incen = amt.incentivewalletamount
                var numAmo: number = +amo;
                var numIncen: number = +incen

                let formatAmo = formatNumber(numAmo, 'en-US',
                  '1.2');
                let formatInc = formatNumber(numIncen, 'en-US',
                  '1.2');
                var wholeAmo = formatAmo.replace(/,/g, "")
                var wholeIncen = formatInc.replace(/,/g, "")

                var deciAmo = Number(wholeAmo)
                var deciIncen = Number(wholeIncen)

                var convAmou = deciAmo.toLocaleString('en-IN', {
                  minimumFractionDigits: 2, maximumFractionDigits: 2
                })
                var convIncen = deciIncen.toLocaleString('en-IN', {
                  minimumFractionDigits: 2, maximumFractionDigits: 2
                })
                amt.masterwalletamount = convAmou
                amt.incentivewalletamount = convIncen
              })
              this.spinnerService.hide();
              this.dataSource.data = this.merchantTableResponse;
            }


          })





        }

      })

    }
    else {


    }




  }

  onlyLettersAndNumbers(str: any) {
    return /[A-Z][0-9]/.test(str);
  }
  getMerchant() {

    if ((this.merchantobject.state == null || this.merchantobject.state == "") && (this.merchantobject.district == null || this.merchantobject.district == "")
      && (this.merchantobject.name_of_SHPI == null || this.merchantobject.name_of_SHPI == "") && (this.selectedMerchantValue == null || this.selectedMerchantValue == "")
    ) {
      this.merchantState = true;
      this.merchantDistrict = true;
      this.merchantIa = true;
      this.newMerchant = true;
    }
    else if (this.merchantobject.state == null || this.merchantobject.state == "") {
      this.merchantState = true;
      this.merchantDistrict = true;
      this.merchantIa = true;
      this.newMerchant = true;

    } else if (this.merchantobject.district == null || this.merchantobject.district == "") {
      this.merchantDistrict = true;
      this.merchantIa = true;
      this.newMerchant = true;


    } else if (this.merchantobject.name_of_SHPI == null || this.merchantobject.name_of_SHPI == "") {
      this.merchantIa = true;
      this.newMerchant = true;


    } else if (this.selectedMerchantValue == null || this.selectedMerchantValue == "") {
      this.newMerchant = true;

      //  if(this.merchantListResponse.result[0].merchantID == "")
      //  {
      // this.snackBar.open('Selected Merchant Invalid', '',
      //   {
      //     horizontalPosition: 'center',
      //     verticalPosition: 'top',
      //     duration: 3000,
      //     panelClass: 'center',
      //   })
      //  }
    }
    else {
      this.table = true;
      this.spinnerService.show();

      this.service.fetchmerchantBalance(this.selectedMerchantValue, "").subscribe(merchantResponse => {


       
        this.merchantBalanceResponse = merchantResponse;
        this.merchantTableResponse = this.merchantBalanceResponse.result;
        // if (this.merchantTableResponse[0].trainers_Name == null) {



        if (merchantResponse.result.length == 0) {

          this.spinnerService.hide();

          this.pagination = false;
          this.table1 = false;
          this.snackBar.open("Record not found", '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',
            });

        }
        else {




          this.service.merchantWalletbalancefetch(this.merchantTableResponse[0].merchantID).subscribe(merchantwalletrespose => {


            
          
            if (merchantwalletrespose == null) {
              this.spinnerService.hide();


              this.pagination = false;
              this.table1 = true;
              
              this.dataSource.data = this.merchantTableResponse;
              this.snackBar.open("The merchant is not yet logged in", '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',
                });
            } else {

              // this.snackBar.open("Data fetched successfully", '',
              //   {
              //     horizontalPosition: 'center',
              //     verticalPosition: 'top',
              //     duration: 3000,
              //     panelClass: 'center',
              //   });



              this.pagination = false;
              this.table1 = true;



              // pending work  for wallet balance 

              for (let i = 0; i < this.merchantTableResponse.length; i++) {

                this.merchantTableResponse[i].incentivewalletamount = merchantwalletrespose.incentivewalletamount;

                this.merchantTableResponse[i].masterwalletamount = merchantwalletrespose.masterwalletamount

              }


              this.merchantTableResponse.forEach(amt => {
                var amo = amt.masterwalletamount
                var incen = amt.incentivewalletamount
                var numAmo: number = +amo;
                var numIncen: number = +incen

                let formatAmo = formatNumber(numAmo, 'en-US',
                  '1.2');
                let formatInc = formatNumber(numIncen, 'en-US',
                  '1.2');
                var wholeAmo = formatAmo.replace(/,/g, "")
                var wholeIncen = formatInc.replace(/,/g, "")

                var deciAmo = Number(wholeAmo)
                var deciIncen = Number(wholeIncen)

                var convAmou = deciAmo.toLocaleString('en-IN', {
                  minimumFractionDigits: 2, maximumFractionDigits: 2
                })
                var convIncen = deciIncen.toLocaleString('en-IN', {
                  minimumFractionDigits: 2, maximumFractionDigits: 2
                })
                amt.masterwalletamount = convAmou
                amt.incentivewalletamount = convIncen
              })
              this.dataSource.data = this.merchantTableResponse;
              this.spinnerService.hide();
            }
          })






        }



        // }

      })
    }
    // this.merchantobject.merchantID = "AE33000003";
    // service call
  }

  submit() {

    if (this.merchant == "" || this.merchant == null) {
      this.getMerchant();
    }
    else {
      this.getNewMerchant();
    }


  }





  letterOnly(event: any) {
    event.target.maxLength = 30;

    var charCode = event.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)

      return true;
    else
      return false;
  }



  districtTouch() {


    if (this.selectedstate == "") {

      this.snackBar.open("Please select state ", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',


      });

    }

  }

  iaTouch() {

    if (this.selecteddistrict == "") {

      this.snackBar.open("Please select district", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',


      });
    }



  }

  merchantTouch() {

    if (this.selectediaName == "") {

      this.snackBar.open("Please select IA name", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',


      });
    }




  }

}