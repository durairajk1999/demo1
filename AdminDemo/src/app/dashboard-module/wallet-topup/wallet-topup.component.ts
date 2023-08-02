import { DatePipe, formatNumber } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServicesService } from 'src/app/services.service';
import { Wallettopupdata } from 'src/app/wallettopupdata';
import { Wallettopuprequest } from 'src/app/wallettopuprequest';
import { Wallettopupresponse } from 'src/app/wallettopupresponse';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-wallet-topup',
  templateUrl: './wallet-topup.component.html',
  styleUrls: ['./wallet-topup.component.scss'],
  providers: [DatePipe]
})
export class WalletTopupComponent implements OnInit {
  dateconv: any
  today = new Date();
  startDate = new FormControl();
  endDate = new FormControl();
  hideRequiredMarker = "true"

  pagination = false
  show = false;
  table1 = false;

  startdatevalue!: boolean
  todateValue!: boolean

  disToDate!: any

  todate = "";

  notes=true;

  topupRequest: Wallettopuprequest = new Wallettopuprequest();
  topupResponse: Wallettopupresponse = new Wallettopupresponse();
  topupList: Wallettopupdata[] = [];



  filter = new FormControl();

  private sort!: MatSort;


  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }



  dataSource = new MatTableDataSource<Wallettopupdata>(this.topupList);

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


  displayedColumns: string[] = ['date', 'merchantID', 'referenceId','utr', 'amount', 'transactionStatus'];

  constructor(private service: ServicesService, private dateAdapter: DateAdapter<Date>,private cdref: ChangeDetectorRef, private spinnerService: NgxSpinnerService, private datepipe: DatePipe, private snackBar: MatSnackBar) {


    this.dateAdapter.setLocale('en-GB');

    this.today.setDate(this.today.getDate());

  }

  ngOnInit(): void {
    this.startdatevalue = false;
    this.todateValue = false;
    this.disToDate = true
  }


  endDateValue!: boolean



  convFromDate: any
  convToDate: any


  orgValueChange() {
    this.endDateValue = false


  }

  parseDate(date: any) {

    var parseDate = date.split('-').join('/');

    return parseDate

  }

  exportExcel() {
    const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data.map((item) => {return {"Date & Time": item.date,"Merchant Code": item.merchantID,"Reference ID":item.referenceId,"UTR Number":item.utr,"Amount (₹)":item.amount,"Transaction Status": item.transactionStatus  };       })     );
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
    XLSX.writeFile(workBook, 'Wallet Topup.xlsx');
}

startToday = new Date();

  txndate() {


    this.notes=true;
    if (this.startDate.dirty && (this.topupRequest.fromDate != null || this.topupRequest.fromDate != "")) {
      this.disToDate = false;

      this.dataSource.data = [];
      this.show = false;
      this.pagination = false;
      this.table1 = false;

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
    // this.responseStartDate = statusStartDate;
    this.startdatevalue = false;
  }

  monthDiff(dateFrom: any, dateTo: any) {
    if (dateFrom != undefined) {
      return dateTo.getMonth() - dateFrom.getMonth() +
        (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
    } else {
      return null;
    }
  }

  todateselect(transdate: string) {

    this.notes=true;
    this.convToDate = transdate;

    this.dataSource.data = [];
    this.show = false;
    this.pagination = false;


    this.todateValue = false;
    this.table1 = false;

  }



  walletTopup() {

    this.convFromDate = this.datepipe.transform(this.startDate.value, 'dd/MM/yyyy');
    this.convToDate = this.datepipe.transform(this.endDate.value, 'dd/MM/yyyy');

    this.topupRequest.fromDate = this.convFromDate;
    this.topupRequest.toDate = this.convToDate;

    if ((this.topupRequest.fromDate == "" || this.topupRequest.fromDate == null) &&
      (this.topupRequest.toDate == "" || this.topupRequest.toDate == null)) {

      this.startdatevalue = true;
      this.todateValue = true;
      this.todate = "To date is required"

    } else

      if (this.topupRequest.fromDate == "" || this.topupRequest.fromDate == null)

        this.startdatevalue = true;

      else if (this.topupRequest.toDate == "" || this.topupRequest.toDate == null) {

        this.todateValue = true;
        this.todate = "To date is required"
      }
      else {

        if (this.endDate.status == 'VALID') {
          this.spinnerService.show();
          this.todateValue = false;

          this.service.getwalletTopup(this.topupRequest).subscribe(topup => {
            // this.topupResponse = topup;

           
            this.spinnerService.hide();
            this.topupResponse = topup;


            this.topupResponse.data.forEach(stat => {
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



            var datePipe = new DatePipe("en-US");

            this.topupResponse.data.forEach(dte => {
              var dat = dte.date
              // var numdate: number = +date;
              
              // this.dateconv = datePipe.transform(dat, 'MM/dd/yyyy hh:mm:ss a');
              let myDate = dat.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
              this.dateconv = this.datepipe.transform(myDate, 'dd/MM/yyyy hh:mm:ss a', 'es-ES');
              dte.date = this.dateconv;
              


            })
            this.topupResponse.data.forEach(amt => {
              var amo = amt.amount
              var numAmo: number = +amo;
              let formatAmo = formatNumber(numAmo, 'en-US',
                '1.2');
              var wholeAmo = formatAmo.replace(/,/g, "")
              var deciAmo = Number(wholeAmo)
              var conv = deciAmo.toLocaleString('en-IN', {
                minimumFractionDigits: 2, maximumFractionDigits: 2
              })
              amt.amount = conv

            })

            this.topupList = this.topupResponse.data

            this.dataSource.data = this.topupList

            if ((this.topupResponse.status == 'true') && (this.topupList.length != 0)) {
              this.dataSource.data = []
              this.filter.reset();
              this.dataSource.filter = " "
              this.dataSource.data = this.topupList
              // this.snackBar.open("Data fetched successfully", '',
              //   {
              //     horizontalPosition: 'center',
              //     verticalPosition: 'top',
              //     duration: 3000,
              //     panelClass: 'center',
              //   });
              this.notes=false;

              this.pagination = true
              this.show = true;
              this.table1 = true;

            } else if ((this.topupList.length == 0) && (this.topupResponse.status == 'true')) {

              this.snackBar.open("Record not found", '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',
                });

                this.notes=true;
              this.pagination = false
              this.show = false;
              this.table1 = false;

            }
            else if (this.topupResponse.status == 'false') {
              this.snackBar.open("Failure", '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',
                });
                this.notes=false;
              this.pagination = false
              this.show = false
              this.table1 = false;

            }

          })

        }
        else {
          this.todateValue = true;
          this.todate = "To date is invalid"
          this.pagination = false
          this.show = false;
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
