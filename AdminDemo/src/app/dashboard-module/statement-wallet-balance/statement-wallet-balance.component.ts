import { DatePipe, formatNumber } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { MerchantWalletBalance } from 'src/app/merchant-wallet-balance';
import { ServicesService } from 'src/app/services.service';
import { State } from 'src/app/state-details';
import { StatedetailsResult } from 'src/app/statedetails-result';
import * as XLSX from 'xlsx';
export interface Details {

  date: any;
  merchantID: string;
  referenceId: string;
  opening: any;
  amount: any;
  closing: any;
  transactionType: string;
  serviceType: string;
  transactionStatus: string;

}

@Component({
  selector: 'app-statement-wallet-balance',
  templateUrl: './statement-wallet-balance.component.html',
  styleUrls: ['./statement-wallet-balance.component.scss'],
  providers: [DatePipe]
})
export class StatementWalletBalanceComponent implements OnInit {

  // ELEMENT_DATA: Details[] = [
  //   {
  //     "date": "12/05/2023",
  //     "merchantid": "AE33000003",
  //     "referenceId": "AE33333300345678",
  //     "beforetrans": 10000,
  //     "amount": 199900000,
  //     "aftertrans": 340000,
  //     "transactionType": "Credit",
  //     "serviceType": "Commission",
  //     "transactionStatus": "Success"

  //   }
  // ];
  private sort!: MatSort;


  startToday = new Date();

  notes = true;

  walletBalanceResponse: Details[] = [];

  displayedColumns: string[] = ['date', 'referenceId', 'opening', 'amount', 'closing', 'transactionType', 'serviceType', 'transactionStatus'];
  // dataSource = this.ELEMENT_DATA;
  @ViewChild('firstTableSort') set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.sort = this.sort;
  }
  dataSource = new MatTableDataSource<Details>(this.walletBalanceResponse);

  table!: boolean;
  table1!: boolean;

  statedetails: State = new State();

  today = new Date();
  now = new Date();

  hideRequiredMarker = "true"

  walletBalance: any;



  resetState = new FormControl();
  resetDistrict = new FormControl();
  resetIa = new FormControl();
  resetMerchant = new FormControl();
  merchantabc = new FormControl();
  filter = new FormControl();

  credential: StatedetailsResult = new StatedetailsResult();

  selectedStateName = "";
  selectedDistrictName = "";
  selectedIaName: any;
  selectedMerchant = "";
  statevalue!: boolean;
  districtvalue!: boolean;
  iavalue!: boolean;
  merchantvalue!: boolean;
  fromDateValue!: boolean;
  toDateValue!: boolean;

  message!: string;

  districtNamedetails: State = new State();
  districtlist: StatedetailsResult[] = [];

  districtlist1: Record<any, any>[] = this.districtlist;
  districtlist2: Record<any, any>[] = this.districtlist;

  statelist: StatedetailsResult[] = [];

  statelist1: Record<any, any>[] = this.statelist;
  statelist2: Record<any, any>[] = this.statelist;

  ialist: StatedetailsResult[] = [];

  ialist1: Record<any, any>[] = this.ialist;
  ialist2: Record<any, any>[] = this.ialist;

  iaListDetails: State = new State();

  merchantID = "";
  merchantCodeValueForm = new FormControl();

  merchantCodeValue = "";

  merchantList: StatedetailsResult[] = [];

  merchantlist1: Record<any, any>[] = this.merchantList;
  merchantlist2: Record<any, any>[] = this.merchantList;

  merchantDetails: State = new State();

  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;

  stateNameSelect = "";
  districtNameSelect = "";
  iaNameSelect = "";
  merhcnatNameSelect = "";
  date = "";


  startDate = new FormControl();
  endDate = new FormControl();

  disToDate!: boolean;

  convFromDate: any;
  convToDate: any;

  endDateValid = false;

  merchantBalanceREq: MerchantWalletBalance = new MerchantWalletBalance();

  constructor(private cdref: ChangeDetectorRef, private dateAdapter: DateAdapter<Date>, private service: ServicesService, private spinnerService: NgxSpinnerService, private snackBar: MatSnackBar, private datepipe: DatePipe) {
    this.dateAdapter.setLocale('en-GB');
    this.today.setDate(this.today.getDate())
  }

  ngOnInit(): void {
    this.getStateDetailsList();
    this.statevalue = false;
    this.districtvalue = false;
    this.iavalue = false;
    this.merchantvalue = false;
    this.fromDateValue = false;
    this.toDateValue = false;
    this.disToDate = true;
    this.table = false;
    this.table1 = false;

    this.dataSource.data = [];
  }


  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }


  @ViewChild('paginator1', { static: false }) set paginatorPageSize1(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl();
      this.dataSource.paginator._intl.itemsPerPageLabel = "";
      this.dataSource.paginator.selectConfig.disableOptionCentering = true;
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getStateDetailsList() {
    // this.statevalue=true;
    this.service.getStateService().subscribe(statelist => {
      this.statedetails = statelist;
      this.statelist = this.statedetails.result;
      this.statelist1 = this.statelist;
      this.statelist2 = this.statelist;
    })
  }


  getDistrictName(statename: string) {

    this.table = false;
    this.table1 = false;
    this.statevalue = false;
    this.stateNameSelect = statename;
    this.selectedStateName = statename;
    this.merchantCodeValueForm.reset();
    this.merchantCodeValue = "";

    this.resetDistrict.reset();
    this.resetIa.reset();
    this.resetMerchant.reset();
    this.service.districtNameFetch(statename).subscribe(data => {
      this.districtNamedetails = data;
      this.districtlist = this.districtNamedetails.result;
      this.districtlist1 = this.districtlist;
      this.districtlist2 = this.districtlist;
    })
  }

  iaList(districtname: string) {
    this.table = false;
    this.table1 = false;
    this.districtNameSelect = districtname;
    this.iaNameSelect = "";
    this.merhcnatNameSelect = "";
    this.resetIa.reset();
    this.resetMerchant.reset();
    this.merchantCodeValueForm.reset();
    this.merchantCodeValue = "";

    // this.iavalue=false;
    this.ialist1 = [];
    this.ialist2 = [];
    this.merchantlist2 = [];
    this.merchantlist1 = [];
    this.selectedDistrictName = districtname;
    this.selectedIaName = "";
    this.selectedMerchant = "";
    this.districtvalue = false;
    this.service.getIaNameList(this.selectedStateName, districtname).subscribe(ialistfetch => {

      this.iaListDetails = ialistfetch;
      this.ialist = this.iaListDetails.result;
      // this.dataSource.data = this.ialist;
      if (this.ialist.length === 0) {
        this.message = "IA name not found";



        this.snackBar.open(this.message, '', {
          horizontalPosition: 'center',

          verticalPosition: 'top',

          duration: 3000,
          // panelClass: ['blue-snackbar']
          panelClass: 'center',
        });
      }
      this.ialist1 = this.ialist;
      this.ialist2 = this.ialist;
    });
  }

  getMerchantName(ngoId: any) {
    this.table = false;
    this.table1 = false;
    this.resetMerchant.reset();
    if (typeof (ngoId) == "undefined") {
    }
    else {
      this.iaNameSelect = ngoId;
      this.merhcnatNameSelect = "";
      this.merchantlist2 = [];
      this.merchantlist1 = [];
      this.iavalue = false;

      this.merchantCodeValueForm.reset();
      this.merchantCodeValue = "";
      this.selectedIaName = ngoId;

      this.selectedMerchant = "";

      this.service.merchantDetails(ngoId).subscribe(merchantName => {
        this.merchantDetails = merchantName;
        this.merchantList = this.merchantDetails.result;
        if (this.merchantList.length === 0) {
          this.message = "Merchant name not found";
          this.snackBar.open(this.message, '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            // panelClass: ['blue-snackbar']
            panelClass: 'center',
          });
        }
        this.merchantlist1 = this.merchantList;
        this.merchantlist2 = this.merchantList;
      });
    }
  }

  getMerchantID(merchantID: string) {
    this.table = false;
    this.table1 = false;
    this.merhcnatNameSelect = merchantID;
    this.selectedMerchant = "";
    this.merchantvalue = false;
    this.selectedMerchant = merchantID;
  }

  passwordChange() {
    if (this.merchantCodeValueForm.hasError('pattern')) {
      return 'Enter valid merchant code';
    }
    return this.merchantCodeValueForm.hasError('minlength') ? 'Should have minimum 9 characters' : '';
  }

  merchantCodeEnter(merchantEnterValue: string) {
    this.table = false;
    this.table1 = false;
    this.merchantCodeValue = merchantEnterValue;
    this.statevalue = false;
    this.districtvalue = false;
    this.iavalue = false;
    this.merchantvalue = false;
    this.selectedDistrictName = "";
    this.selectedStateName = "";
    this.selectedIaName = "";
    this.selectedMerchant = ""
    this.resetState.reset();
    this.resetDistrict.reset();
    this.resetIa.reset();
    this.resetMerchant.reset();
  }

  submit() {

    this.filter.reset();
    this.dataSource.filter = ""
    this.merchantBalanceREq.fromDate = this.datepipe.transform(this.startDate.value, 'dd/MM/yyyy');
    this.merchantBalanceREq.toDate = this.datepipe.transform(this.endDate.value, 'dd/MM/yyyy');

    var merchantCode = this.merchantCodeValueForm.value
    if ((merchantCode == null || merchantCode == "")) {
      if ((this.selectedStateName == null || this.selectedStateName == "")) {
        this.statevalue = true;
        this.districtvalue = true;
        this.iavalue = true;

        this.merchantvalue = true;
        if (this.merchantBalanceREq.fromDate == "" || this.merchantBalanceREq.fromDate == null) {
          this.fromDateValue = true;
          this.toDateValue = true;

        }
        else if (this.merchantBalanceREq.toDate == "" || this.merchantBalanceREq.toDate == null) {
          this.fromDateValue = false;
          this.toDateValue = true;
        }

      } else if ((this.selectedDistrictName == null || this.selectedDistrictName == "")) {
        this.districtvalue = true;

        this.iavalue = true;
        this.merchantvalue = true;
        if (this.merchantBalanceREq.fromDate == "" || this.merchantBalanceREq.fromDate == null) {

          this.fromDateValue = true;
          this.toDateValue = true;
        }
        else if (this.merchantBalanceREq.toDate == "" || this.merchantBalanceREq.toDate == null) {
          this.fromDateValue = false;
          this.toDateValue = true;
        }
      } else if ((this.selectedIaName == null || this.selectedIaName == "")) {
        this.iavalue = true;
        this.merchantvalue = true;
        if (this.merchantBalanceREq.fromDate == "" || this.merchantBalanceREq.fromDate == null) {
          this.fromDateValue = true;
          this.toDateValue = true;
        }
        else if (this.merchantBalanceREq.toDate == "" || this.merchantBalanceREq.toDate == null) {
          this.fromDateValue = false;
          this.toDateValue = true;
        }
      }
      else if ((this.selectedMerchant == null || this.selectedMerchant == "")) {
        this.merchantvalue = true;
        if (this.merchantBalanceREq.fromDate == "" || this.merchantBalanceREq.fromDate == null) {
          this.fromDateValue = true;
          this.toDateValue = true;

        }
        else if (this.merchantBalanceREq.toDate == "" || this.merchantBalanceREq.toDate == null) {
          this.fromDateValue = false;
          this.toDateValue = true;
        }
      } else if (this.merchantBalanceREq.fromDate == "" || this.merchantBalanceREq.fromDate == null) {
        this.fromDateValue = true;
        this.toDateValue = true;
      } else if (this.merchantBalanceREq.toDate == "" || this.merchantBalanceREq.toDate == null) {
        this.fromDateValue = false;
        this.toDateValue = true;
      } else {
        this.serviceCall(this.merchantBalanceREq);
      }
    }
    else if (this.merchantCodeValueForm.value != null || this.merchantCodeValueForm.value != null) {

      if (this.merchantBalanceREq.fromDate == "" || this.merchantBalanceREq.fromDate == null) {
        this.fromDateValue = true;
        this.toDateValue = true;
      }
      else if (this.merchantBalanceREq.toDate == "" || this.merchantBalanceREq.toDate == null) {
        this.fromDateValue = false;
        this.toDateValue = true;
      } else {
        this.merchantBalanceREq.merchantID = this.merchantCodeValueForm.value
        this.serviceCall(this.merchantBalanceREq);
      }
    }

  }

  serviceCall(request: MerchantWalletBalance) {

    this.spinnerService.show();
    this.service.getMerchantWalletBalanceReport(this.merchantBalanceREq).subscribe(data => {
      this.spinnerService.hide();

      if (data.status === "true") {
        if (data.data.length > 0) {


          this.dataSource.data = [];


          this.table = true;
          this.table1 = true;
          this.walletBalanceResponse = data.data


          this.walletBalanceResponse.forEach(stat => {
            var response = stat.transactionStatus
            // var numdate: number = +date;
            if (response == "true") {
              var statusConv = response.replace("true", "Success")
              stat.transactionStatus = statusConv;

            } else if (response == "Pending") {
              var statusConv = response.replace("Pending", "Pending")
              stat.transactionStatus = statusConv;
            }

            else {
              var statusConv = response.replace("false", "Failure")
              stat.transactionStatus = statusConv;
            }


          })



          this.walletBalanceResponse.forEach(dte => {
            var dat = dte.date
            let myDate = dat.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
            var convDate = this.datepipe.transform(myDate, 'dd/MM/yyyy hh:mm:ss a', 'es-ES');
            dte.date = convDate;
          })

          this.walletBalanceResponse.forEach(amt => {
            var amo = amt.amount
            var open = amt.opening
            var close = amt.closing

            var numAmo: number = +amo;
            var numOpen: number = +open;
            var numClos: number = +close;


            let formatAmo = formatNumber(numAmo, 'en-US',
              '1.2');
            let formatOpen = formatNumber(numOpen, 'en-US',
              '1.2');
            let formatCLose = formatNumber(numClos, 'en-US',
              '1.2');
            var wholeAmo = formatAmo.replace(/,/g, "")
            var wholeOpen = formatOpen.replace(/,/g, "")
            var wholeClose = formatCLose.replace(/,/g, "")

            var deciAmo = Number(wholeAmo);
            var deciOpen = Number(wholeOpen);
            var deciCLose = Number(wholeClose);
            var conv = deciAmo.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })
            var convOpen = deciOpen.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })
            var convClose = deciCLose.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })
            amt.amount = conv;
            amt.opening = convOpen;
            amt.closing = convClose;
          })
          this.dataSource.data = this.walletBalanceResponse;
          this.walletBalance = data.walletBalance
        } else {
          this.table = false;
          this.table1 = false;
          this.snackBar.open("Record not found", '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',
            });
        }

      } else {
        this.table = false;
        this.table1 = false;
        this.snackBar.open("Failure", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',

          });
      }
    })
  }

  iaTouch() {
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

  animatorTouch() {
    if (this.iaNameSelect == "") {
      this.snackBar.open("Please select IA name", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',


      });
    }
    else {

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

  orgValueChange() {
    this.table = false;
    this.table1 = false;
    this.endDateValid = false;
    this.fromDateValue = false
    if (this.startDate.dirty) {
      this.disToDate = false

    }
    if (this.endDate.dirty) {
      this.endDate.reset()

    }

    this.today = new Date();
    var currDate = new Date();
    var diff = this.monthDiff(this.startDate.value, currDate) as any
    if (diff >= 3) {
      var newDate = new Date(this.startDate.value);
      newDate.setMonth(newDate.getMonth() + 3)

      if (newDate > this.today) {
        this.today = new Date();
      } else {
        this.today = newDate;
      }
    }
  }

  monthDiff(dateFrom: any, dateTo: any) {
    if (dateFrom != undefined) {
      return dateTo.getMonth() - dateFrom.getMonth() +
        (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
    } else {
      return null;
    }
  }
  orgValueChange1() {
    this.table = false;
    this.table1 = false;
    this.toDateValue = false
  }

  clickEndDate() {
    if (!this.startDate.dirty) {
      this.snackBar.open('Please select From date', '',
        {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'center',
        });
    }
  }

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



  exportExcel() {
    const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data.map((item) => { return { "Date & Time": item.date, " Reference ID": item.referenceId, "Before Transaction Amount (₹)": item.opening, "Amount (₹)": item.amount, "After Transaction Amount (₹)": item.closing, " Transaction Type": item.transactionType, "Service Type": item.serviceType, "Transaction Status": item.transactionStatus }; }));
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
    XLSX.writeFile(workBook, 'Wallet Balance.xlsx');
  }
}