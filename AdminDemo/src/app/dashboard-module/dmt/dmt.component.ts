import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe, formatNumber } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { DmtRequest } from 'src/app/dmt-request';
import { DmtResponseDataList } from 'src/app/dmt-response-data-list';
import { DmtResponseDetails } from 'src/app/dmt-response-details';

import { ServicesService } from 'src/app/services.service';
import * as XLSX from 'xlsx';
export interface dmt {
  Date: string;
  ReferenceID: string
  Amount: string
  CCF: string
  TransactionStatus: string
}
const ELEMENT_DATA: dmt[] = [
  { Date: '12-02-2023', ReferenceID: '9877589', Amount: '766.00', CCF: '50.00', TransactionStatus: 'Success' },
]

// displayedColumns1: string[] = ['Date','ReferenceID', 'Amount','CCF','TransactionStatus'];
/// durai ////


@Component({
  selector: 'app-dmt',
  templateUrl: './dmt.component.html',
  styleUrls: ['./dmt.component.scss'],
  providers: [DatePipe]
})
export class DMTComponent implements OnInit {
  dateconv: any

  statementform!: FormGroup;
  hideRequiredMarker = true;
  table = false;

  table1 = false;

  table2 = false;


  notes = true;

  statusresponse = "true";
  tsresponse = "pending";
  failresponse = "false";

  accountnumbervalue!: boolean;
  fromdatevalue!: boolean;
  todatevalue!: boolean;

  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;

  today = new Date();

  dmtRequest: DmtRequest = new DmtRequest();

  dmtResponseTableDetails: DmtResponseDetails = new DmtResponseDetails()
  dmtDataList: DmtResponseDataList[] = [];
  todate = ""

  pageSizes = [2, 4, 6];
  displayedColumns: string[] = ['date', 'merchantID', 'referenceId', 'amount', 'ccf', 'transactionStatus'];

  private sort!: MatSort;
  private sort2!: MatSort;
  show!: boolean;
  pagination!: boolean
  disToDate!: boolean;

  filter = new FormControl();
  @ViewChild('firstTableSort') set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild('secondTableSort') set matSort2(ms: MatSort) {
    this.sort2 = ms;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.mySecondTableData.sort = this.sort2;
  }
  // mySecondTableData = new MatTableDataSource<ResBody>(this.resBodyList);
  mySecondTableData = new MatTableDataSource<DmtResponseDataList>(this.dmtDataList);

  startDate = new FormControl();
  endDate = new FormControl();

  convFromDate: any;

  convToDate: any;

  statusMessage!: string;
  constructor(private _liveAnnouncer: LiveAnnouncer, private cdref: ChangeDetectorRef, private dateAdapter: DateAdapter<Date>, private service: ServicesService, private datePipe: DatePipe, private spinnerService: NgxSpinnerService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.dateAdapter.setLocale('en-GB');

    this.today.setDate(this.today.getDate());

  }
  // @ViewChild('firstTableSort')
  // public firstTableSort!: MatSort;

  // @ViewChild('secondTableSort')
  // public secondTableSort!: MatSort;

  @ViewChild('paginator1', { static: false }) set paginatorPageSize1(pager: MatPaginator) {
    if (pager) {
      this.mySecondTableData.paginator = pager;
      this.mySecondTableData.paginator._intl = new MatPaginatorIntl()
      this.mySecondTableData.paginator._intl.itemsPerPageLabel = "";
      this.mySecondTableData.paginator.selectConfig.disableOptionCentering = true;
    }
  }
  ngAfterViewInit() {
    // this.myFirstTableData.sort = this.firstTableSort;
    // this.mySecondTableData.sort = this.secondTableSort;
  }
  // applyFilter(event: Event) {
  //   const filterValue = (event.target as HTMLInputElement).value;
  //   this.myFirstTableData.filter = filterValue.trim().toLowerCase();
  // }
  // announceSortChange(sortState: Sort) {

  //   if (sortState.direction) {
  //     this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
  //   } else {
  //     this._liveAnnouncer.announce('Sorting cleared');
  //   }
  // }
  ngOnInit() {
    this.fromdatevalue = false;
    this.todatevalue = false;
    this.disToDate = true;
  }

  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }
  exportExcel() {
    const workSheet = XLSX.utils.json_to_sheet(this.mySecondTableData.data.map((item) => { return { "Date & Time": item.date, "Merchant Code": item.merchantID, "Reference ID": item.referenceId, "Amount (₹)": item.amount, "Customer Convenience Fee (₹)": item.ccf, "Transaction Status": item.transactionStatus }; }));
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
    XLSX.writeFile(workBook, 'Dmt.xlsx');
  }
  getStatementList() {
    this.convFromDate = this.datePipe.transform(this.startDate.value, 'dd/MM/yyyy');
    this.convToDate = this.datePipe.transform(this.endDate.value, 'dd/MM/yyyy');
    this.dmtRequest.fromDate = this.convFromDate;
    this.dmtRequest.toDate = this.convToDate;
    if ((this.dmtRequest.fromDate == null || this.dmtRequest.fromDate == "") && (this.dmtRequest.toDate == null || this.dmtRequest.toDate == "")) {
      this.fromdatevalue = true
      this.todatevalue = true
      this.todate = "To date is required"

    }
    else {
      if (this.dmtRequest.fromDate == null || this.dmtRequest.fromDate == "") {
        this.fromdatevalue = true
      }
      else if (this.dmtRequest.toDate == null || this.dmtRequest.toDate == "") {
        this.todatevalue = true
        this.todate = "To date is required"
      }
      else {
        if (this.endDate.status == "VALID") {
          if (this.dmtRequest.fromDate != null && this.dmtRequest) {
            this.fromdatevalue = false;
            this.todatevalue = false;
            this.spinnerService.show();
            this.service.getDmtReport(this.dmtRequest).subscribe(data => {
              this.dmtResponseTableDetails = data;


              this.dmtResponseTableDetails = data;


              this.dmtResponseTableDetails.data.forEach(stat => {
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

              this.dmtResponseTableDetails.data.forEach(dte => {
                var dat = dte.date
                // var numdate: number = +date;
                // this.dateconv = datePipe.transform(dat, 'MM/dd/yyyy hh:mm:ss a');
                let myDate = dat.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
                this.dateconv = this.datePipe.transform(myDate, 'dd/MM/yyyy hh:mm:ss a', 'es-ES');
                dte.date = this.dateconv;


              })



              this.dmtResponseTableDetails.data.forEach(amt => {
                var amo = amt.amount;
                var ccf = amt.ccf;
                var x: number = +ccf;
                var y: number = +amo;

                let ccfcurr = formatNumber(x, 'en-US', '1.2');
                let curr = formatNumber(y, 'en-US', '1.2');
                var wholeAmo = curr.replace(/,/g, "")
                var wholeCcf = ccfcurr.replace(/,/g, "")
                var deciAmo = Number(wholeAmo)
                var deciCcf = Number(wholeCcf)
                var convAmt = deciAmo.toLocaleString('en-IN', {
                  minimumFractionDigits: 2, maximumFractionDigits: 2
                })
                var convCcf = deciCcf.toLocaleString('en-IN', {
                  minimumFractionDigits: 2, maximumFractionDigits: 2
                })
                amt.amount = convAmt
                amt.ccf = convCcf;
              })

              this.spinnerService.hide();

              this.dmtDataList = this.dmtResponseTableDetails.data;
              if (this.dmtDataList.length == 0) {
                this.show = false;
                this.pagination = false;
                this.table1 = false;
                this.notes = true;

                this.snackBar.open("Record not found", '',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 3000,
                    panelClass: 'center',


                  });

              }
              else if (this.dmtResponseTableDetails.responseCode == 0) {
                this.show = false;
                this.pagination = false;
                this.table1 = false;
                this.notes = true;

                this.snackBar.open("failure", '',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 3000,
                    panelClass: 'center',


                  });

              }
              else {


                this.mySecondTableData.data = []
                this.mySecondTableData.filter = " "
                this.filter.reset();

                this.show = true;
                this.pagination = true;
                this.table1 = true;

                this.notes = false;

                // this.snackBar.open("Data fetched successfully", '',
                //   {
                //     horizontalPosition: 'center',
                //     verticalPosition: 'top',
                //     duration: 3000,
                //     panelClass: 'center',
                //   });

              }

              this.mySecondTableData.data = this.dmtDataList;
            });
          }
        }
        else {
          this.show = false
          this.todatevalue = true;
          this.todate = "To date is invalid"
          this.dmtDataList = [];
          this.mySecondTableData.data = []
        }
      }
    }
  }
  startToday = new Date();

  selectFromDate() {

    this.notes = true;
    if (this.startDate.dirty && (this.dmtRequest.fromDate != null || this.dmtRequest.fromDate != "")) {
      this.disToDate = false

      this.show = false;
      this.pagination = false;
      this.table1 = false;
      this.mySecondTableData.data = [];
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
    this.fromdatevalue = false;

  }

  monthDiff(dateFrom: any, dateTo: any) {
    if (dateFrom != undefined) {
      return dateTo.getMonth() - dateFrom.getMonth() +
        (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
    } else {
      return null;
    }
  }


  selectToDate(enddate: string) {

    this.notes = true;

    this.show = false;
    this.table1 = false
    this.pagination = false;
    this.mySecondTableData.data = [];

    this.convToDate = enddate;
    this.todatevalue = false;
  }

  orgValueChange() {
    //   this.todatevalue = false
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

  // parseDate(date: any) {
  //   var parseDate = date.split('-').join('/');

  //   return parseDate
  // }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.mySecondTableData.filter = filterValue.trim().toLowerCase();
  }


  handleInput(event: any) {
    if (event.target.selectionStart === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }


  isAlfa(evt: any) {

    evt = (evt || window.event);
    var charCode = (evt.which || evt.keyCode);
    var del = 'Delete'

    var arrowLeft = 'ArrowLeft'
    var arrowRight = 'ArrowRight'
    var arrow: any

    if (evt.key == arrowRight || evt.key == arrowLeft || evt.key == del || evt.key == "," || evt.key == "." || evt.key == "/" || evt.key == ":") {
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
