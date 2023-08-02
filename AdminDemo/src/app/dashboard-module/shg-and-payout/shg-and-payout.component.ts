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
import { ServicesService } from 'src/app/services.service';
import { ShgPayoutRequestDetail } from 'src/app/shg-payout-request-detail';
import { ShgPayoutResponseDataList } from 'src/app/shg-payout-response-data-list';
import { ShgPayoutResponseDetails } from 'src/app/shg-payout-response-details';
import * as XLSX from 'xlsx';


interface Type {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-shg-and-payout',
  templateUrl: './shg-and-payout.component.html',
  styleUrls: ['./shg-and-payout.component.scss'],
  providers: [DatePipe]
})
export class ShgAndPayoutComponent implements OnInit {
  dateconv!: any


  types: Type[] = [
    { value: '0', viewValue: 'All' },
    { value: '1', viewValue: 'SHG' },
    { value: '2', viewValue: 'Payout' },
  ];



  statementform!: FormGroup;
  hideRequiredMarker = true;


  table1 = false;

  notes!: boolean;

  typeValue!: boolean;
  fromdatevalue!: boolean;
  todatevalue!: boolean;



  typeList1: Record<any, any>[] = this.types;

  typeList2: Record<any, any>[] = this.types;

  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;

  selectedCustomerID = "";
  selectedAccountNumberValue = "";

  today = new Date();



  shgPayoutRequest: ShgPayoutRequestDetail = new ShgPayoutRequestDetail();

  shgPayoutResponseDetails: ShgPayoutResponseDetails = new ShgPayoutResponseDetails();

  shgPayoutDataList: ShgPayoutResponseDataList[] = []

  type = new FormControl();
  filterValue = new FormControl();
  date = "";
  pageSizes = [2, 4, 6];
  displayedColumns1: string[] = ['date', 'name', 'merchantID', 'serviceType', 'referenceId', 'amount', 'transactionStatus'];




  private sort!: MatSort;
  private sort2!: MatSort;
  show!: boolean;
  typeSelect = "";
  pagination!: boolean;
  disToDate!: boolean;


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
  mySecondTableData = new MatTableDataSource<ShgPayoutResponseDataList>(this.shgPayoutDataList);
  statusresponse = "true"
  tsresponse = "pending"
  failresponse = "false"

  startDate = new FormControl();
  endDate = new FormControl();
  todate = ""
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
    this.typeValue = false;
    this.fromdatevalue = false;
    this.todatevalue = false;
    this.disToDate = true
    this.notes = true;
  }

  exportExcel() {
    const workSheet = XLSX.utils.json_to_sheet(this.mySecondTableData.data.map((item) => { return { "Date & Time": item.date, "Name": item.name, "Merchant Code": item.merchantID, "Service Type": item.serviceType, "Reference ID": item.referenceId, "Amount (₹)": item.amount, "Transaction Status": item.transactionStatus }; }));
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
    XLSX.writeFile(workBook, 'SHG and Payout.xlsx');
  }
  getStatementList() {

    this.convFromDate = this.datePipe.transform(this.startDate.value, 'dd/MM/yyyy');
    this.convToDate = this.datePipe.transform(this.endDate.value, 'dd/MM/yyyy');
    this.shgPayoutRequest.fromDate = this.convFromDate;
    this.shgPayoutRequest.toDate = this.convToDate;
    this.shgPayoutRequest.requestType = this.typeSelect
    if ((this.shgPayoutRequest.requestType == "" || this.shgPayoutRequest.requestType == null) && (this.shgPayoutRequest.fromDate == "" || this.shgPayoutRequest.fromDate == null) && (this.shgPayoutRequest.toDate == "" || this.shgPayoutRequest.toDate == null)) {
      this.typeValue = true;
      this.fromdatevalue = true;
      this.todatevalue = true;
      this.todate = "To date is required"

    }
    else {
      if (this.shgPayoutRequest.requestType == "" || this.shgPayoutRequest.requestType == null) {
        this.typeValue = true;
        //this.fromdatevalue = true;
        this.todatevalue = true;

        this.todate = "To date is required"

      }
      else if (this.shgPayoutRequest.fromDate == "" || this.shgPayoutRequest.fromDate == null) {
        this.typeValue = false;
        this.fromdatevalue = true;
        this.todatevalue = true;
        this.todate = "To date is required"

      }
      else if (this.shgPayoutRequest.toDate == "" || this.shgPayoutRequest.toDate == null) {
        this.typeValue = false;
        this.fromdatevalue = false;
        this.todatevalue = true;
        this.todate = "To date is required"

      }
      else {
        if (this.endDate.status == "VALID") {
          if (this.shgPayoutRequest.requestType != null && this.shgPayoutRequest.fromDate != null && this.shgPayoutRequest.toDate != null) {
            this.fromdatevalue = false;
            this.todatevalue = false;
            this.spinnerService.show();
            this.service.getSHGPayoutReport(this.shgPayoutRequest).subscribe(datagg => {
              this.shgPayoutResponseDetails = datagg;



              this.shgPayoutResponseDetails.data.forEach(stat => {
                var response = stat.transactionStatus
                
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

              this.shgPayoutResponseDetails.data.forEach(dte => {
                var dat = dte.date
                // var numdate: number = +date;
                
                // this.dateconv = datePipe.transform(dat, 'MM/dd/yyyy hh:mm:ss a');
                let myDate = dat.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
                this.dateconv = this.datePipe.transform(myDate, 'dd/MM/yyyy hh:mm:ss a', 'es-ES');
                dte.date = this.dateconv;


              })



              this.shgPayoutResponseDetails.data.forEach(amt => {
                var amo = amt.amount
                var y: number = +amo;
                let formatAmo = formatNumber(y, 'en-US',
                  '1.2');
                var wholeAmo = formatAmo.replace(/,/g, "")
                var deciAmo = Number(wholeAmo)
                var conv = deciAmo.toLocaleString('en-IN', {
                  minimumFractionDigits: 2, maximumFractionDigits: 2
                })
                amt.amount = conv
              })






              this.shgPayoutDataList = this.shgPayoutResponseDetails.data
              this.spinnerService.hide();
              if (this.shgPayoutDataList.length == 0) {
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
              else if (this.shgPayoutResponseDetails.responseCode == 0) {
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
                this.mySecondTableData.data = [];

                this.filterValue.reset();

                this.mySecondTableData.filter = " "

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


              this.mySecondTableData.data = this.shgPayoutDataList;
            });
          }
        }
        else {
          this.show = false
          this.todatevalue = true;
          this.table1 = false;
          this.todate = "To date is invalid"
          this.shgPayoutDataList = [];
          this.mySecondTableData.data = []
        }
      }
    }

  }

  startToday = new Date();


  selectFromDate() {
    if (this.startDate.dirty && (this.shgPayoutRequest.fromDate != null || this.shgPayoutRequest.fromDate != "")) {
      this.disToDate = false

      this.mySecondTableData.data = [];
      this.show = false;
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
  selectToDate(toDate: string) {

    this.convToDate = toDate;
    this.todatevalue = false;

    this.mySecondTableData.data = [];
    this.show = false;
    this.table1 = false;
  }

  selectRequestType(type: string) {
    this.typeValue = false;
    this.typeSelect = type;
    this.notes=true;

    this.mySecondTableData.data = [];
    this.show = false;
    this.table1 = false;

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

    if (evt.key == arrowRight || evt.key == arrowLeft || evt.key == del || evt.key == '/' || evt.key == ':' || evt.key == ',' || evt.key == '.') {
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
