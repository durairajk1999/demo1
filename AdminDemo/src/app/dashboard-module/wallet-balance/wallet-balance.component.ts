import { DatePipe, formatNumber, NumberFormatStyle } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatTableDataSource } from '@angular/material/table';

import { Walletbalancerequest } from 'src/app/walletbalancerequest';
import { Walletbalanceresponse } from 'src/app/walletbalanceresponse';
import { ServicesService } from 'src/app/services.service';
import { Walletbalancedata } from 'src/app/walletbalancedata';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-wallet-balance',
  templateUrl: './wallet-balance.component.html',
  styleUrls: ['./wallet-balance.component.scss'],
  providers: [DatePipe]
})
export class WalletBalanceComponent implements OnInit {
  dateconv: any
  today = new Date();
  startDate = new FormControl();
  endDate = new FormControl();
  hideRequiredMarker = "true"
  pagination1 = false

  table1 = false;

  notes=true;


  balanceRequest: Walletbalancerequest = new Walletbalancerequest();
  balanceResponse: Walletbalanceresponse = new Walletbalanceresponse();
  balanceList: Walletbalancedata[] = [];



  private sort!: MatSort;

  startdate = ""
  startdatevalue!: boolean
  todate = ""
  toDateValue!: boolean

  disToDate!: any
  filter = new FormControl();

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }


  displayedColumns: string[] = ['date', 'pending_TransactionValue', 'opening', 'closing'];



  dataSource = new MatTableDataSource<Walletbalancedata>(this.balanceList);



  setDataSourceAttributes() {
    this.dataSource.sort = this.sort;
  }

  @ViewChild('paginator', { static: false }) set paginatorPageSize(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = " ";
    }
  }



  constructor(private service: ServicesService,private cdref: ChangeDetectorRef, private spinnerService: NgxSpinnerService, private datepipe: DatePipe, private dateAdapter: DateAdapter<Date>, private snackBar: MatSnackBar) {

    this.dateAdapter.setLocale('en-GB');

    this.today.setDate(this.today.getDate());


  }

  isShow = false
  show = false


  ngOnInit(): void {

    this.startdatevalue = false;
    this.toDateValue = false;
    this.disToDate = true;
  }


  endDateValue!: boolean
  convFromDate: any
  convToDate: any

  startToday = new Date();

  orgValueChange() {
    this.endDateValue = false

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

  parseDate(date: any) {
    var parseDate = date.split('-').join('/');

    return parseDate
  }

  exportExcel() {
    const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data.map((item) => {return {"Date & Time": item.date,"Pending Transaction Value (₹)": item.pending_TransactionValue,"Opening Balance (₹)":item.opening,"Closing Balance (₹)":item.closing   };       })     );
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
    XLSX.writeFile(workBook, 'Wallet Information.xlsx');
}
  txndate() {

    this.notes=true;
    if (this.startDate.dirty && (this.balanceRequest.fromDate != null || this.balanceRequest.fromDate != "")) {

      this.show = false;
      this.pagination1 = false;
      this.dataSource.data = [];
      this.disToDate = false;
      this.table1 = false;

           

    }

    if (this.endDate.dirty) {

      this.endDate.reset()
    }


    this.startdatevalue = false;

  }

  todateselect(transdate: string) {

    this.notes=true;

    this.show = false;
    this.pagination1 = false;
    this.dataSource.data = [];
    this.convToDate = transdate;

    this.toDateValue = false;
    this.table1 = false;
  }


  viewWalletBalance() {

    this.convFromDate = this.datepipe.transform(this.startDate.value, 'dd/MM/yyyy');
    this.convToDate = this.datepipe.transform(this.endDate.value, 'dd/MM/yyyy');

    this.balanceRequest.fromDate = this.convFromDate;
    this.balanceRequest.toDate = this.convToDate;


    if ((this.balanceRequest.fromDate == "" || this.balanceRequest.fromDate == null) &&
      (this.balanceRequest.toDate == "" || this.balanceRequest.toDate == null)) {

      this.startdatevalue = true;
      this.toDateValue = true;
      this.todate = "To date is required"

    } else

      if (this.balanceRequest.fromDate == "" || this.balanceRequest.fromDate == null) {
        this.startdatevalue = true;
        this.toDateValue = false;

      }
      else if (this.balanceRequest.toDate == "" || this.balanceRequest.toDate == null) {

        this.toDateValue = true;
        this.todate = "To date is required"
      }

      else {


        if (this.endDate.status == 'VALID') {
          this.spinnerService.show();
          this.toDateValue = false
          this.todate = " "

          this.service.getwalletBalance(this.balanceRequest).subscribe(balance => {

            //this.balanceResponse = balance;
            this.spinnerService.hide();




            this.balanceResponse = balance;

            // for (let i = 0; i < this.balanceResponse.data.length; i++) {

            //   var closingbls = this.balanceResponse.data[i].closing;
            //   var openingbls = this.balanceResponse.data[i].opening;
            //   var pendingbls = this.balanceResponse.data[i].pending_TransactionValue;
            //   var closingValue = Number(closingbls);
            //   var openingValue = Number(openingbls);
            //   var pendingValue = Number(pendingbls);



            //   let closenum = closingValue;
            //   let opennum = openingValue;
            //   let pennum = pendingValue;

            //   let closeAmount = closenum.toLocaleString("en-IN");
            //   let openAmount = opennum.toLocaleString("en-IN");
            //   let pendingAmount = pennum.toLocaleString("en-IN");


            //   this.balanceResponse.data[i].closing = closeAmount;
            //   this.balanceResponse.data[i].opening = openAmount;
            //   this.balanceResponse.data[i].pending_TransactionValue = pendingAmount;


            // }




            var datePipe = new DatePipe("en-US");

            this.balanceResponse.data.forEach(dte => {
              var dat = dte.date
              // var numdate: number = +date;
              
              // this.dateconv = datePipe.transform(dat, 'MM/dd/yyyy hh:mm:ss a');
              let myDate = dat.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
              this.dateconv = this.datepipe.transform(myDate, 'dd/MM/yyyy hh:mm:ss a', 'es-ES');
              dte.date = this.dateconv;
              


            })
            this.balanceResponse.data.forEach(amt => {
              var amoClosing = amt.closing;
              var amoOpening = amt.opening;
              var amoTransactionValue = amt.pending_TransactionValue;

              var x: number = +amoClosing;
              var y: number = +amoOpening;
              var z: number = +amoTransactionValue;

              let currX = formatNumber(x, 'en-IN',
                '1.2');

              let currY = formatNumber(y, 'en-IN',
                '1.2');
              let currZ = formatNumber(z, 'en-IN',
                '1.2');

              var wholeClos = currX.replace(/,/g, "")
              var wholeOpen = currY.replace(/,/g, "")
              var wholePend = currZ.replace(/,/g, "")

              var deciClos = Number(wholeClos)
              var deciOpen = Number(wholeOpen)
              var deciPend = Number(wholePend)

              var convClos = deciClos.toLocaleString('en-IN', {
                minimumFractionDigits: 2, maximumFractionDigits: 2
              })
              var convOpen = deciOpen.toLocaleString('en-IN', {
                minimumFractionDigits: 2, maximumFractionDigits: 2
              })
              var convPend = deciPend.toLocaleString('en-IN', {
                minimumFractionDigits: 2, maximumFractionDigits: 2
              })

              amt.closing = convClos;
              amt.opening = convOpen
              amt.pending_TransactionValue = convPend
            })

            this.balanceList = this.balanceResponse.data

            this.dataSource.data = this.balanceList


            if ((this.balanceResponse.status == 'true') && (this.balanceList.length != 0)) {
              this.dataSource.data = []
              this.filter.reset();
              this.dataSource.filter = " "
              this.dataSource.data = this.balanceList
              // this.snackBar.open("Data fetched successfully", '',
              //   {
              //     horizontalPosition: 'center',
              //     verticalPosition: 'top',
              //     duration: 3000,
              //     panelClass: 'center',
              //   });

             
              this.notes=false;
              this.pagination1 = true
              this.show = true
              this.table1 = true;

            } else if ((this.balanceList.length == 0) && (this.balanceResponse.status == 'true')) {

              this.snackBar.open("Record not found", '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',
                });

                this.notes=true;
              this.pagination1 = false
              this.show = false;
              this.table1 = false;

            }
            else if (this.balanceResponse.status == 'false') {
              this.snackBar.open("Failure", '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',
                });

                this.notes=true;
              this.pagination1 = false
              this.show = false
              this.table1 = false;

            }

            this.toDateValue = false
            this.todate = " "

          })



        } else {

          this.toDateValue = true;
          this.todate = "To date is invalid"
          this.pagination1 = false
          this.show = false
          this.table1 = false;
        }
      }
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


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleInput(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }
  ngAfterContentChecked() {
    
    this.cdref.detectChanges();
 }

  isAlfa(evt: any) {

    evt = (evt || window.event);
    var charCode = (evt.which || evt.keyCode);
    var del = 'Delete'

    var arrowLeft = 'ArrowLeft'
    var arrowRight = 'ArrowRight'
    var arrow: any

    if (evt.key == arrowRight || evt.key == arrowLeft || evt.key == del ||evt.key =="," ||evt.key=="." ||evt.key=="/" || evt.key==":") {
      arrow = false;

    }  else {
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


}
