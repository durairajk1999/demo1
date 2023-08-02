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
import { TransactionResponse } from 'src/app/transaction-response';
import { Walletincentivedata } from 'src/app/walletincentivedata';
import { Walletincentiverequest } from 'src/app/walletincentiverequest';
import { Walletincentiveresponse } from 'src/app/walletincentiveresponse';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-walletincentive',
  templateUrl: './walletincentive.component.html',
  styleUrls: ['./walletincentive.component.scss'],
  providers: [DatePipe]
})
export class WalletincentiveComponent implements OnInit {




  today = new Date();
  startDate = new FormControl();
  endDate = new FormControl();
  hideRequiredMarker = "true"
  pagination = false

  startdatevalue!: boolean
  toDateValue!: boolean

  disToDate!: any

  startdate = ""
  todate = "";
  table1 = false;
  notes = true;

  incentiveRequest: Walletincentiverequest = new Walletincentiverequest();
  incentiveResponse: Walletincentiveresponse = new Walletincentiveresponse();
  incentiveList: Walletincentivedata[] = [];

  private sort!: MatSort;

  filter = new FormControl();
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  transactionResponse: TransactionResponse[] = [];

  dataSource = new MatTableDataSource<Walletincentivedata>(this.incentiveList);

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



  displayedColumns: string[] = ['id', 'serviceType', 'incentive']

  constructor(private service: ServicesService, private spinnerService: NgxSpinnerService, private cdref: ChangeDetectorRef, private dateAdapter: DateAdapter<Date>, private datepipe: DatePipe, private snackBar: MatSnackBar) {

    this.dateAdapter.setLocale('en-GB');

    this.today.setDate(this.today.getDate());

  }

  ngOnInit(): void {

    this.startdatevalue = false;
    this.toDateValue = false;
    this.disToDate = true
  }


  endDateValue!: boolean


  convFromDate: any
  convToDate: any

  isShow = false
  show = false


  orgValueChange() {
    this.endDateValue = false

  }


  exportExcel() {
    const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data.map((item) => { return { "Service Type": item.serviceType, "Incentive (₹)": item.incentive }; }));
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
    XLSX.writeFile(workBook, 'Wallet Incentive.xlsx');
  }

  startToday = new Date();

  txndate() {


    this.notes = true;
    this.dataSource.data = [];
    this.pagination = false;
    this.show = false;
    this.table1 = false;

    if (this.startDate.dirty && (this.incentiveRequest.fromDate != null || this.incentiveRequest.fromDate != "")) {
      this.disToDate = false;
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
    this.notes = true;
    this.convToDate = transdate;
    this.toDateValue = false;
    this.dataSource.data = [];
    this.show = false;
    this.pagination = false;
    this.table1 = false;
  }

  walletIncentive() {

    this.convFromDate = this.datepipe.transform(this.startDate.value, 'dd/MM/yyyy');
    this.convToDate = this.datepipe.transform(this.endDate.value, 'dd/MM/yyyy');

    this.incentiveRequest.fromDate = this.convFromDate;
    this.incentiveRequest.toDate = this.convToDate;

    if ((this.incentiveRequest.fromDate == "" || this.incentiveRequest.fromDate == null) &&
      (this.incentiveRequest.toDate == "" || this.incentiveRequest.toDate == null)) {

      this.startdatevalue = true;
      this.toDateValue = true;
      this.todate = "To date is required"

    } else

      if (this.incentiveRequest.fromDate == "" || this.incentiveRequest.fromDate == null)

        this.startdatevalue = true;

      else if (this.incentiveRequest.toDate == "" || this.incentiveRequest.toDate == null) {

        this.toDateValue = true;
        this.todate = "To date is required"
      }
      else if ((this.incentiveRequest.fromDate != null) && (this.incentiveRequest.toDate == null)) {

        this.toDateValue = true;
        this.todate = "To date is required"
      }
      else {

        if (this.endDate.status == 'VALID') {
          this.spinnerService.show();
          this.toDateValue = false


          this.service.getwalletIncentive(this.incentiveRequest).subscribe(incentive => {
            this.incentiveResponse = incentive;
            this.incentiveResponse.data.forEach(amt => {
              var amo = amt.incentive
              var numAmo: number = +amo;
              let formatAmo = formatNumber(numAmo, 'en-US',
                '1.2');
              var wholeAmo = formatAmo.replace(/,/g, "")
              var deciAmo = Number(wholeAmo)
              var conv = deciAmo.toLocaleString('en-IN', {
                minimumFractionDigits: 2, maximumFractionDigits: 2
              })
              amt.incentive = conv
            })



            









            this.spinnerService.hide();
            this.incentiveList = this.incentiveResponse.data
            this.dataSource.data = this.incentiveList


            if ((this.incentiveResponse.status == 'true') && (this.incentiveList.length != 0)) {
              this.dataSource.data = []
              this.filter.reset();
              this.dataSource.filter = " "
              this.dataSource.data = this.incentiveList
              // this.snackBar.open("Data fetched successfully", '',
              //   {
              //     horizontalPosition: 'center',
              //     verticalPosition: 'top',
              //     duration: 3000,
              //     panelClass: 'center',
              //   });

              this.notes = false;
              this.pagination = true
              this.show = true;
              this.table1 = true;

            } else if ((this.incentiveList.length == 0) && (this.incentiveResponse.status == 'true')) {

              this.snackBar.open("Record not found", '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',
                });

              this.notes = true;
              this.pagination = false
              this.show = false
              this.table1 = false;
              this.dataSource.data = [];

            }
            else if (this.incentiveResponse.status == 'false') {
              this.snackBar.open("Failure", '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',
                });
              this.notes = true;
              this.pagination = false;
              this.table1 = false;
              this.show = false;
              this.dataSource.data = [];

            }



          })



        } else {
          this.toDateValue = true;
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

    if (evt.key == arrowRight || evt.key == arrowLeft || evt.key == del || evt.key == "," || evt.key == "." || evt.key == "/" || evt.key == ":" || evt.key == "-") {
      arrow = false;

    } else {
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

