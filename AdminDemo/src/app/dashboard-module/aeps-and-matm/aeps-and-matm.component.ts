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
import { AepsMatmResponseDataList } from 'src/app/aeps-matm-response-data-list';
import { AepsMatmResponseDetails } from 'src/app/aeps-matm-response-details';
import { ApesMatmRequestDetails } from 'src/app/apes-matm-request-details';

import { ServicesService } from 'src/app/services.service';
import * as XLSX from 'xlsx';




interface Type {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-aeps-and-matm',
  templateUrl: './aeps-and-matm.component.html',
  styleUrls: ['./aeps-and-matm.component.scss'],
  providers:[DatePipe]
})
export class AepsAndMATMComponent implements OnInit {
dateconv:any
  statementform!: FormGroup;
  hideRequiredMarker = true;

  types: Type[] = [
    { value: '0', viewValue: 'All' },
    { value: '1', viewValue: 'AePS' },
    { value: '2', viewValue: 'MATM' },
  ];


  typeValue!: boolean;
  fromdatevalue!: boolean;
  todatevalue!: boolean;
  todate = "";

  notes=true;

  typeList1: Record<any, any>[] = this.types;
  typeList2: Record<any, any>[] = this.types;

  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;

  today = new Date();

  aepsMatmRequest: ApesMatmRequestDetails = new ApesMatmRequestDetails();
  aepsMatmResponseDetails: AepsMatmResponseDetails = new AepsMatmResponseDetails();
  aepsMatmDataList: AepsMatmResponseDataList[] = []

  type = new FormControl();

  date = "";
  pageSizes = [2, 4, 6];
  displayedColumns1: string[] = ['date', 'merchantID','referenceId', 'amount', 'transactionType', 'serviceType', 'bank_TransactionId', 'bank_ReferenceId', 'transactionStatus'];


  private sort!: MatSort;
  private sort2!: MatSort;
  show!: boolean;
  typeSelected = "";
  pagination!: boolean;
  disToDate!: boolean;
  filter = new FormControl();
  statusresponse = "SUCCESS"
  statusresponse1 = "AUTH_SUCCESS"
  failresponse1 = "AUTH_DECLINE"
  tsresponse = "PENDING"
  failresponse = "FAILED"

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
  mySecondTableData = new MatTableDataSource<AepsMatmResponseDataList>(this.aepsMatmDataList);

  startDate = new FormControl();
  endDate = new FormControl();

  convFromDate: any;

  convToDate: any;

  table1=false;
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
  ngAfterContentChecked() {
    
    this.cdref.detectChanges();
 }
  ngOnInit() {
    this.typeValue = false;
    this.fromdatevalue = false;
    this.todatevalue = false;
    this.disToDate = true;
  }

  exportExcel() {
    const workSheet = XLSX.utils.json_to_sheet(this.mySecondTableData.data.map((item) => {return {"Date & Time": item.date,"Merchant Code": item.merchantID,"Reference ID":item.referenceId,"Amount (₹)":item.amount,"Transaction Type":item.transactionType,"Service Type":item.serviceType,"Bank Transaction ID":item.bank_TransactionId,"Bank Reference ID":item.bank_ReferenceId,"Transaction Status": item.transactionStatus   };       })     );
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
    XLSX.writeFile(workBook, 'AePS and MATM.xlsx');
}
  getStatementList() {

    this.convFromDate = this.datePipe.transform(this.startDate.value, 'dd/MM/yyyy');
    this.convToDate = this.datePipe.transform(this.endDate.value, 'dd/MM/yyyy');
    this.aepsMatmRequest.fromDate = this.convFromDate;
    this.aepsMatmRequest.toDate = this.convToDate;
    this.aepsMatmRequest.requestType = this.typeSelected

    if ((this.aepsMatmRequest.requestType == "" || this.aepsMatmRequest.requestType == null) && (this.aepsMatmRequest.fromDate == "" || this.aepsMatmRequest.fromDate == null) && (this.aepsMatmRequest.toDate == "" || this.aepsMatmRequest.toDate == null)) {
      this.typeValue = true;
      this.fromdatevalue = true;
      this.todatevalue = true;
      this.todate = "To Date is required"

    }
    else {
      if (this.aepsMatmRequest.requestType == "" || this.aepsMatmRequest.requestType == null) {
        this.typeValue = true;
        //this.fromdatevalue = true;
        this.todatevalue = true
        this.todate = "To Date is required"

      }
      else if (this.aepsMatmRequest.fromDate == "" || this.aepsMatmRequest.fromDate == null) {
        this.typeValue = false;
        this.fromdatevalue = true;
        this.todatevalue = true
        this.todate = "To Date is required"

      }
      else if (this.aepsMatmRequest.toDate == "" || this.aepsMatmRequest.toDate == null) {
        this.typeValue = false;
        this.fromdatevalue = false;
        this.todatevalue = true
        this.todate = "To Date is required"

      }
      else {
        if (this.endDate.status == "VALID") {
          if (this.aepsMatmRequest.requestType != null && this.aepsMatmRequest.fromDate != null && this.aepsMatmRequest.toDate != null) {
            this.typeValue = false;
            this.fromdatevalue = false;
            this.todatevalue = false;
            this.spinnerService.show();

            

            this.service.getaepsMatmReport(this.aepsMatmRequest).subscribe(data => {

              this.aepsMatmResponseDetails = data;



              this.aepsMatmResponseDetails = data;

             
              this.aepsMatmResponseDetails.data.forEach(stat => {
                var response = stat.transactionStatus
                // var numdate: number = +date;
                
                if(response=="SUCCESS"){
                  var statusConv=response.replace("SUCCESS","Success")
                  stat.transactionStatus = statusConv;
  
                }else if(response=="PENDING"){
                  var statusConv=response.replace("PENDING","Pending")
                  stat.transactionStatus = statusConv;
                }
                else if(response=="AUTH_SUCCESS"){
                  var statusConv=response.replace("AUTH_SUCCESS","Success")
                  stat.transactionStatus = statusConv;
                }
                else if(response=="AUTH_DECLINE"){
                  var statusConv=response.replace("AUTH_DECLINE","Failure")
                  stat.transactionStatus = statusConv;
                }
                else{
                  var statusConv=response.replace("FAILED","Failure")
                  stat.transactionStatus = statusConv;
                }
  
  
              })
  
  
   var datePipe = new DatePipe("en-US");
  
              this.aepsMatmResponseDetails.data.forEach(dte => {
                var dat = dte.date
                // var numdate: number = +date;
               
                // this.dateconv = datePipe.transform(dat, 'MM/dd/yyyy hh:mm:ss a');
                let myDate = dat.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
                this.dateconv = this.datePipe.transform(myDate, 'dd/MM/yyyy hh:mm:ss a', 'es-ES');
                dte.date = this.dateconv;
                
  
  
              })
              this.aepsMatmResponseDetails.data.forEach(amt => {
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




              this.aepsMatmDataList = this.aepsMatmResponseDetails.data
              this.spinnerService.hide();
              if (this.aepsMatmDataList.length == 0) {
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
              else if (this.aepsMatmResponseDetails.responseCode == 0) {
                this.show = false;
                this.pagination = false;
                this.table1=false;
                this.notes=true;

                this.snackBar.open("Failure", '',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 3000,
                    panelClass: 'center',

                  });

              }
              else {
                this.mySecondTableData.data = [];
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

              this.mySecondTableData.data = this.aepsMatmDataList;
            });
          }
        }
        else {
          this.show = false
          this.todatevalue = true;
          this.table1=false;
          this.todate = "To Date is invalid"
          this.aepsMatmDataList = [];
          this.mySecondTableData.data = []
        }
      }
    }

  }

  startToday=new Date();

  selectFromDate() {
    if (this.startDate.dirty && (this.aepsMatmRequest.fromDate != null || this.aepsMatmRequest.fromDate != "")) {
      this.disToDate = false

      this.notes=true;
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

    this.convToDate = enddate;
    this.todatevalue = false;
    this.table1=false;
    this.show=false
  }

  orgValueChange() {
    // this.todatevalue = false
  }

  serviceType = "AEPS";
  renameType = "AePS";
  SelectType(type: string) {
    this.typeValue=false;
    
    this.notes=true;
    this.typeSelected = type;
    this.show = false;
    this.table1 = false;
    this.mySecondTableData.data = [];
    // if (type == this.renameType) {
    //   this.typeSelected = this.serviceType
    // }
    // else if(type != this.renameType){

    //   this.typeValue = false;
    //   this.typeSelected = type;
    //   this.show = false;
    //   this.table1 = false;
    //   this.mySecondTableData.data = [];
    // }
  }

  clickEndDate() {

    this.notes=true;
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


  letterOnly(event: any) {
    var charCode = event.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)

      return true;
    else
      return false;
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

   
    if (evt.key == arrowRight || evt.key == arrowLeft || evt.key == del ||evt.key=='/' || evt.key==':' || evt.key==',' || evt.key=='.') {
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

    )&& (numberBoolean)|| this.willCreateWhitespaceSequence(evt)) ? false : true;
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

