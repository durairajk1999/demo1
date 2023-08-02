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
import { BbpsRequest } from 'src/app/bbps-request';
import { BbpsResponseDataList } from 'src/app/bbps-response-data-list';
import { BbpsResponseDetails } from 'src/app/bbps-response-details';
import { ServicesService } from 'src/app/services.service';
import * as XLSX from 'xlsx';



@Component({
  selector: 'app-bbps',
  templateUrl: './bbps.component.html',
  styleUrls: ['./bbps.component.scss'],
  providers:[DatePipe]
})
export class BBPSComponent implements OnInit {
  dateconv:any
  statementform!: FormGroup;
  hideRequiredMarker = true;
  table = false;

  table1 = false;

  table2 = false;

  notes=true;

  statusresponse="true"
  tsresponse="pending"
  failresponse="false"

  fromdatevalue!: boolean;
  todatevalue!: boolean;
  todate = ""


  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;

  selectedCustomerID = "";
  selectedAccountNumberValue = "";

  transactonstartdate = ""
  selectedtransactionendDate = "";
  today = new Date();

  bbpsRequest: BbpsRequest = new BbpsRequest();
  bbpsResponseDetails: BbpsResponseDetails = new BbpsResponseDetails();
  bbpsDataList: BbpsResponseDataList[] = []

  date = "";
  pageSizes = [2, 4, 6];
  displayedColumns1: string[] = ['date', 'merchantID' , 'bank_TransactionId', 'referenceId','transactionStatus', 'amount' ];


  private sort!: MatSort;
  private sort2!: MatSort;
  show!: boolean;
  pagination!: boolean;
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
  mySecondTableData = new MatTableDataSource<BbpsResponseDataList>(this.bbpsDataList);

  startDate = new FormControl();
  endDate = new FormControl();

  convFromDate: any;

  convToDate: any;

  statusMessage!: string;
  constructor(private _liveAnnouncer: LiveAnnouncer,private cdref: ChangeDetectorRef, private dateAdapter: DateAdapter<Date>, private service: ServicesService, private datePipe: DatePipe, private spinnerService: NgxSpinnerService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.dateAdapter.setLocale('en-GB');

    this.today.setDate(this.today.getDate());
  }
  // @ViewChild('firstTableSort')
  // public firstTableSort!: MatSort;

  // @ViewChild('secondTableSort')
  // public secondTableSort!: MatSort;

  @ViewChild('paginator1', { static: false }) set paginatorPageSize1(pager: MatPaginator) {
    if (pager)
 {
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
    this.disToDate=true;
  }

  ngAfterContentChecked() {
    
    this.cdref.detectChanges();
 }
  exportExcel() {
    const workSheet = XLSX.utils.json_to_sheet(this.mySecondTableData.data.map((item) => {return {"Date & Time": item.date,"Merchant Code": item.merchantID,"Transaction ID":item.bank_TransactionId,"Reference ID":item.referenceId,"Amount (₹)":item.amount,"Transaction Status": item.transactionStatus   };       })     );
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
    XLSX.writeFile(workBook, 'BBPS.xlsx');
}
  getStatementList() {
    this.convFromDate = this.datePipe.transform(this.startDate.value, 'dd/MM/yyyy');
    this.convToDate = this.datePipe.transform(this.endDate.value, 'dd/MM/yyyy');
    this.bbpsRequest.fromDate = this.convFromDate;
    this.bbpsRequest.toDate = this.convToDate;
    if ((this.bbpsRequest.fromDate == null || this.bbpsRequest.fromDate == "") && (this.bbpsRequest.toDate == null || this.bbpsRequest.toDate == "")) {
      this.fromdatevalue = true
      this.todatevalue = true
      this.todate = "To date is required"

    }
    else {
      if (this.bbpsRequest.fromDate == null || this.bbpsRequest.fromDate == "") {
        this.fromdatevalue = true
      }
      else if (this.bbpsRequest.toDate == null || this.bbpsRequest.toDate == "") {
        this.todatevalue = true
        this.todate = "To date is required"
      }
      else {
        if (this.endDate.status == "VALID") {
          if (this.bbpsRequest.fromDate != null && this.bbpsRequest) {
            this.fromdatevalue = false;
            this.todatevalue = false;

            this.spinnerService.show();
            this.service.getBbpsReport(this.bbpsRequest).subscribe(data => {





              this.bbpsResponseDetails = data;




              this.bbpsResponseDetails = data;


              this.bbpsResponseDetails.data.forEach(stat => {
                var response = stat.transactionStatus
                // var numdate: number = +date;
                if(response=="true"){
                  var statusConv=response.replace("true","Success")
                  stat.transactionStatus = statusConv;
  
                }else if(response=="Pending"){
                  var statusConv=response.replace("Pending","Pending")
                  stat.transactionStatus = statusConv;
                }
                
                else{
                  var statusConv=response.replace("false","Failure")
                  stat.transactionStatus = statusConv;
                }
  
  
              })
  
  
  
   var datePipe = new DatePipe("en-US");
  
              this.bbpsResponseDetails.data.forEach(dte => {
                var dat = dte.date
                // var numdate: number = +date;
                // this.dateconv = datePipe.transform(dat, 'MM/dd/yyyy hh:mm:ss a');
                let myDate = dat.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
                this.dateconv = this.datePipe.transform(myDate, 'dd/MM/yyyy hh:mm:ss a', 'es-ES');
                dte.date = this.dateconv;
  
  
              })


              this.bbpsResponseDetails.data.forEach(amt => {
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
              this.bbpsDataList = this.bbpsResponseDetails.data;
              if (this.bbpsDataList.length == 0) {
                this.show = false;
                this.pagination = false;

                this.table1=false;

                this.notes=true;

                this.snackBar.open("Record not found", '',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 3000,
                    panelClass: 'center',
                  });

              }
              else if (this.bbpsResponseDetails.responseCode == 0) {
                this.show = false;
                this.pagination = false;
                this.table1=false;

                this.notes=true;

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
                this.filter.reset();
                this.mySecondTableData.filter = " "

                this.show = true;
                this.pagination = true;
                this.table1=true;

                this.notes=false;

                // this.snackBar.open("Data fetched successfully", '',
                //   {
                //     horizontalPosition: 'center',
                //     verticalPosition: 'top',
                //     duration: 3000,
                //     panelClass: 'center',
                //   });
              }

              this.mySecondTableData.data = this.bbpsDataList;
              this.spinnerService.hide();
            }
            );
          }
        }
        else {
          this.show = false
          this.todatevalue = true;
          this.table1=false;
          this.todate = "To date is invalid"
          this.bbpsDataList = [];
          this.mySecondTableData.data = []
        }
      }
    }
  }

  startToday=new Date();

  selectFromDate() {
    this.notes=true;
    if (this.startDate.dirty && (this.bbpsRequest.fromDate != null || this.bbpsRequest.fromDate != "")) {
      this.disToDate = false

      this.show=false;
      this.table1=false;
      this.mySecondTableData.data=[];
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
    // if (this.endDate.status == "INVALID" && this.convFromDate!=null) {
    //   this.todatevalue = false;
    // }
   
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
    this.notes=true;
    this.show=false;
    this.mySecondTableData.data=[];

    this.convToDate = enddate;



    this.table1=false;
    this.todatevalue = false;
  }



  clickEndDate(){
    if(!this.startDate.dirty){
      this.snackBar.open('Please select From date', '',
      {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'center',
      });
    }
  }

  parseDate(date :any) {
    var parseDate = date.split('-').join('/');
    
    return  parseDate
  }


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


