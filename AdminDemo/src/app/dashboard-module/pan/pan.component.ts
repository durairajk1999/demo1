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
  selector: 'app-pan',
  templateUrl: './pan.component.html',
  styleUrls: ['./pan.component.scss'],
  providers: [DatePipe]
})
export class PanComponent implements OnInit {
  dateconv: any
  today = new Date();
  startDate = new FormControl();
  endDate = new FormControl();
  hideRequiredMarker = "true"

  pagination = false
  show = false;
  table1 = false;

  notes=true;

  startdatevalue!: boolean
  todateValue!: boolean

  disToDate!: any

  todate = ""

  panRequest: Wallettopuprequest = new Wallettopuprequest();
  panResponse: Wallettopupresponse = new Wallettopupresponse();
  panList: Wallettopupdata[] = [];





  private sort!: MatSort;


  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }



  dataSource = new MatTableDataSource<Wallettopupdata>(this.panList);

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


  displayedColumns: string[] = ['date', 'merchantID', 'transactionType', 'referenceId','transactionStatus' ,'amount'];

  constructor(private service: ServicesService, private cdref: ChangeDetectorRef, private dateAdapter: DateAdapter<Date>, private spinnerService: NgxSpinnerService, private datepipe: DatePipe, private snackBar: MatSnackBar) {

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
  filter = new FormControl();

  orgValueChange() {
    this.endDateValue = false


  }

  parseDate(date: any) {

    var parseDate = date.split('-').join('/');

    return parseDate

  }

  startToday = new Date();


  txndate() {


    this.notes=true;
    if (this.startDate.dirty && (this.panRequest.fromDate != null || this.panRequest.fromDate != "")) {
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
    this.convToDate = transdate;

    this.notes=true;
    this.dataSource.data = [];
    this.show = false;
    this.pagination = false;


    this.todateValue = false;
    this.table1 = false;

  }

  exportExcel() {
    const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data.map((item) => { return { "Date & Time": item.date, "Merchant Code": item.merchantID, "Transaction Type": item.transactionType, "Reference ID": item.referenceId, "Amount (₹)": item.amount, "Transaction Status": item.transactionStatus }; }));
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
    XLSX.writeFile(workBook, 'Pan.xlsx');
  }

  getPan() {

    this.convFromDate = this.datepipe.transform(this.startDate.value, 'dd/MM/yyyy');
    this.convToDate = this.datepipe.transform(this.endDate.value, 'dd/MM/yyyy');
    this.panRequest.fromDate = this.convFromDate;
    this.panRequest.toDate = this.convToDate;

    if ((this.panRequest.fromDate == "" || this.panRequest.fromDate == null) &&
      (this.panRequest.toDate == "" || this.panRequest.toDate == null)) {

      this.startdatevalue = true;
      this.todateValue = true;
      this.todate = "To date is required"

    } else

      if (this.panRequest.fromDate == "" || this.panRequest.fromDate == null)

        this.startdatevalue = true;

      else if (this.panRequest.toDate == "" || this.panRequest.toDate == null) {

        this.todateValue = true;
        this.todate = "To date is required"
      }
      else {

        if (this.endDate.status == 'VALID') {
          this.spinnerService.show();
          this.todateValue = false;

          this.service.getPan(this.panRequest).subscribe(pan => {

            // this.topupResponse = topup;
            this.spinnerService.hide();
            this.panResponse = pan;

            this.panResponse.data.forEach(stat => {
              var response = stat.transactionStatus
              // var numdate: number = +date;
             
              if (response == "true") {
                var statusConv = response.replace("true", "Success")
                stat.transactionStatus = statusConv;

              } else if (response == "Pending") {
                var statusConv = response.replace("Pending", "Pending")
                stat.transactionStatus = statusConv;
              }
              else if (response == "Exception at ESP Msg parsing") {
                var statusConv = response.replace("Exception at ESP Msg parsing", "Exception at ESP Msg parsing")
                stat.transactionStatus = statusConv;
              }

              else {
                var statusConv = response.replace("false", "Failure")
                stat.transactionStatus = statusConv;
              }


            })
            var datePipe = new DatePipe("en-US");

            this.panResponse.data.forEach(dte => {
              var dat = dte.date
              // var numdate: number = +date;
              
              // this.dateconv = datePipe.transform(dat, 'MM/dd/yyyy hh:mm:ss');
              let myDate = dat.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
              this.dateconv = this.datepipe.transform(myDate, 'dd/MM/yyyy hh:mm:ss a', 'es-ES');
              dte.date = this.dateconv;
             


            })

            this.panResponse.data.forEach(amt => {
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

            this.panList = this.panResponse.data

            this.dataSource.data = this.panList

            if ((this.panResponse.status == 'true') && (this.panList.length != 0)) {
              this.dataSource.data = [];
              this.filter.reset();
              this.dataSource.filter = " "
              this.dataSource.data = this.panList
              // this.snackBar.open("Data fetched successfully", '',
              //   {
              //     horizontalPosition: 'center',
              //     verticalPosition: 'top',
              //     duration: 3000,
              //     panelClass: 'center',
              //   });

              this.pagination = true
              this.show = true;
              this.table1 = true; 
              this.notes=false;
              

            } else if ((this.panList.length == 0) && (this.panResponse.status == 'true')) {

              this.snackBar.open("Record not found", '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',
                });


              this.pagination = false
              this.show = false;
              this.table1 = false;
              this.notes=true;

            }
            else if (this.panResponse.status == 'false') {
              this.snackBar.open("Failure", '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',
                });
              this.pagination = false
              this.show = false
              this.table1 = false;
              this.notes=true;

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