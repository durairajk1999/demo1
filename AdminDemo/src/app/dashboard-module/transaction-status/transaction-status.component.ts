
import { Component, Input, OnInit, AfterContentInit, AfterViewChecked, AfterContentChecked, Inject, LOCALE_ID, ChangeDetectorRef } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormRecord, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Transactionstatus } from 'src/app/transactionstatus';
import { ServicesService } from 'src/app/services.service';
import { TransactionResponse } from 'src/app/transaction-response';
import { DatePipe, Time } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { formatNumber } from '@angular/common';


import { StatedetailsResult } from 'src/app/statedetails-result';
import { State } from 'src/app/state-details';
import { ServiceTypeResponse } from 'src/app/service-type-response';
import { NgxSpinnerService } from 'ngx-spinner';
import { TransactionRequest } from 'src/app/transaction-request';
import { DateAdapter } from '@angular/material/core';
import * as XLSX from 'xlsx';
import { NgxMatTimepickerComponent } from 'ngx-mat-timepicker';
@Component({
  selector: 'app-transaction-status',
  templateUrl: './transaction-status.component.html',
  styleUrls: ['./transaction-status.component.scss'],
  providers: [DatePipe]
})
export class TransactionStatusComponent implements OnInit {
  // public maximum: number = 10000;
  // public minimum: number = 100;
  dateconv!: any
  rate!: any
  mer = new FormControl();
  minRate = new FormControl("", [Validators.max(100), Validators.min(10)])
  // maxRate = new FormControl("", [Validators.max(10000), Validators.min(1000)])


  minValue: any
  tranMaxValue = new FormControl();
  pagination = false;

  maxvalue!: boolean;

  notes!:boolean;
  monthPeriod!:boolean;

  statusFailedResponse = "false";


  table = false;
  code!: string;
  oldMerchantCode!: string;
  merchant = false;
  newMerchant = false;
  minAmount = false;
  maxAmount = false;
  serviceType = false;
  strTime = false;
  enTime = false;
  reference = false;
  oldMerchant = false;
  merchantCodeValueForm1 = new FormControl();
  statusSuccessResponse = "true";


  merchantCodeValueForm2 = new FormControl();


  @ViewChild('disabled') picker1!: NgxMatTimepickerComponent;

  @ViewChild('picker3') picker2!: NgxMatTimepickerComponent;

  responseStartDate = "";
  transactionenddate = "";
  responseEndDate = "";
  merchantId!: string;
  newDate!: string;
  enDate!: string;
  responseDate1!: string;
  responseDate2!: string;
  formGroup!: FormGroup;
  transactionResponse: TransactionResponse[] = [];

  transactionres: TransactionResponse = new TransactionResponse();

  date = "";
  pageSizes = [2, 4, 6];
  displayedColumns: string[] = [ 'Timestamp', 'ReferenceId', 'ServiceType','Amount', 'Status'];
  dataSource = new MatTableDataSource<TransactionResponse>(this.transactionResponse);
  startDate = new FormControl();
  endDate = new FormControl();

  constructor(private dateAdapter: DateAdapter<Date>,private cdref: ChangeDetectorRef, private _liveAnnouncer: LiveAnnouncer, private service: ServicesService, private datePipe: DatePipe, private snackBar: MatSnackBar, private spinnerService: NgxSpinnerService) {
    this.dateAdapter.setLocale('en-GB');
  }


  ngOnInit(): void {

    this.notes=true;
    this.onChange();
    this.disToDate = true
    this.disFromTime = true
    this.disToTime = true;
    this.monthPeriod=true;


  }
  name = new FormControl("", Validators.required);
  filter = new FormControl();
  transactionstatusform!: FormGroup;
  hideRequiredMarker = "true";
  transaction: Transactionstatus = new Transactionstatus();
  transRequest: TransactionRequest = new TransactionRequest();
  serviceTypeResponse: ServiceTypeResponse = new ServiceTypeResponse();


  servicetype1: Record<any, any>[] = this.serviceTypeResponse.result;
  servicetype2: Record<any, any>[] = this.serviceTypeResponse.result;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;


  startTime = new FormControl();
  endTime = new FormControl();
  convFromDate: any;
  convToDate: any;
  private sort!: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.dataSource.sort = this.sort;
  }
  @ViewChild('paginator', { static: false }) set paginatorPageSize(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = "";
      this.dataSource.paginator.selectConfig.disableOptionCentering = true;
    }
  }
  ngAfterViewInit() {

  }

  ngAfterContentChecked() {
    
    this.cdref.detectChanges();
 }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    if (filterValue == 's') {
      this.dataSource.filter = filterValue.replace(/s/g, 'true').trim().toLowerCase();

    }
    else if (filterValue == 'su') {
      this.dataSource.filter = filterValue.replace(/su/g, 'true').trim().toLowerCase();
    }
    else if (filterValue == 'suc') {
      this.dataSource.filter = filterValue.replace(/suc/g, 'true').trim().toLowerCase();
    }
    else if (filterValue == 'succ') {
      this.dataSource.filter = filterValue.replace(/succ/g, 'true').trim().toLowerCase();

    }
    else if (filterValue == 'succe') {
      this.dataSource.filter = filterValue.replace(/succe/g, 'true').trim().toLowerCase();

    }
    else if (filterValue == 'succes') {
      this.dataSource.filter = filterValue.replace(/succes/g, 'true').trim().toLowerCase();

    }
    else if (filterValue == 'success') {
      this.dataSource.filter = filterValue.replace(/success/g, 'true').trim().toLowerCase();

    }
    else if (filterValue == 'f') {

      this.dataSource.filter = filterValue.replace(/f/g, 'false').trim().toLowerCase();

    }
    else if (filterValue == 'fa') {
      this.dataSource.filter = filterValue.replace(/fa/g, 'false').trim().toLowerCase();

    }
    else if (filterValue == 'fai') {

      this.dataSource.filter = filterValue.replace(/fai/g, 'false').trim().toLowerCase();

    }
    else if (filterValue == 'fail') {

      this.dataSource.filter = filterValue.replace(/fail/g, 'false').trim().toLowerCase();

    }
    else if (filterValue == 'failu') {

      this.dataSource.filter = filterValue.replace(/failu/g, 'false').trim().toLowerCase();

    }
    else if (filterValue == 'failur') {

      this.dataSource.filter = filterValue.replace(/failur/g, 'false').trim().toLowerCase();

    }
    else if (filterValue == 'failure') {

      this.dataSource.filter = filterValue.replace(/failure/g, 'false').trim().toLowerCase();

    }
    else {

      this.dataSource.filter = filterValue.trim().toLowerCase();

    }
  }



  exportExcel() {
    const workSheet = XLSX.utils.json_to_sheet( this.dataSource.data.map((item) => {return {"Reference Id": item.referenceid,"Service Type": item.type,"Success Status":item.status === "true"? "Success":" ", "Failure Status": item.status === "false" ? "Failure" : " ","Pending Status":item.status === "Pending"?"Pending": " "," Amount (₹)":item.amount, "Date & Time" : item.date      };       })     );
       const workBook: XLSX.WorkBook = XLSX.utils.book_new();
       XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
       XLSX.writeFile(workBook, 'Transaction Status.xlsx');
    
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
  

  onChange() {

    this.pagination = false;
    this.table = false;
    this.dataSource.data = [];

    this.serviceType = false;
    this.transRequest.referenceId = "";
    this.transRequest.merchantId = "";
    this.service.getServiceType().subscribe(data => {
      this.serviceTypeResponse = data;

      
      this.serviceTypeResponse.result.splice(this.serviceTypeResponse.result.length-1,1);
      this.serviceTypeResponse.result.splice(this.serviceTypeResponse.result.length-1,1);

      
      this.servicetype1 = this.serviceTypeResponse.result;
      this.servicetype2 = this.serviceTypeResponse.result;

    })
  }
  refChange() {
    this.monthPeriod=false;
    this.tranMaxValue.setErrors(null)

  }
  newChange() {
    this.merchant = false;
    this.minAmount = false;
    this.maxAmount = false;
    this.serviceType = false;

    this.transaction.merchantId = "";
    this.transaction.minAmount = "";
    this.transaction.maxAmount = "";
    this.transaction.type = "";
    this.newDate = "";
    this.enDate = "";
    this.disToDate = true;
    this.disFromTime = true;
    this.disToTime = true;
    if (this.startDate.dirty) {
      this.startDate.reset();
      this.endDate.reset();
      this.startTime.reset();
      this.endTime.reset();
    }
    this.transaction.fromtime = "";
    this.transaction.totime = "";
  }




  convNumber!: number
  getMerchant() {
    this.convFromDate = this.datePipe.transform(this.startDate.value, 'dd/MM/yyyy');
    this.convToDate = this.datePipe.transform(this.endDate.value, 'dd/MM/yyyy');
    this.responseDate1 = this.convFromDate;
    this.responseDate2 = this.convToDate;
    if ((this.transaction.merchantId == "" || this.transaction.merchantId == null)
      && (this.transaction.type == "" || this.transaction.type == null)) {
      this.merchant = true;
      this.minAmount = true;
      this.maxAmount = true;
      this.serviceType = true;

      this.strTime = true;
      this.enTime = true;
      window.scrollTo(0,0);
    }


    else if((this.transaction.merchantId != "" || this.transaction.merchantId != null)
    && (this.transaction.type == "" || this.transaction.type == null)){
      this.merchant = false;
      this.serviceType = true;
      
      window.scrollTo(0,0);


    }else if((this.transaction.merchantId == "" || this.transaction.merchantId == null)
    && (this.transaction.type != "" || this.transaction.type != null)){

      this.merchant = true;
      this.serviceType = false;
    
      window.scrollTo(0,0);

    }







    else if (this.transaction.merchantId == "" || this.transaction.merchantId == null) {
      this.merchant = true;

      // if (this.transaction.minAmount == "" || this.transaction.minAmount == null) {
      //   this.minAmount = true;
      // }

      // if (this.transaction.maxAmount == "" || this.transaction.maxAmount == null) {
      //   this.maxAmount = true;
      // }

      if (this.transaction.type == "" || this.transaction.type == null) {

        this.serviceType = true;
      }




    }

    // else if (this.transaction.minAmount == "" || this.transaction.minAmount == null) {
    //   this.minAmount = true;


    //   if (this.transaction.merchantId == "" || this.transaction.merchantId == null) {
    //     this.merchant = true;
    //   }

    //   if (this.transaction.maxAmount == "" || this.transaction.maxAmount == null) {
    //     this.maxAmount = true;
    //   }

    //   if (this.transaction.type == "" || this.transaction.type == null) {

    //     this.serviceType = true;
    //   }

    //   if (this.responseDate1 == "" || this.responseDate1 == null) {
    //     this.transactionsdate = true;

    //   }
    //   if (this.responseDate2 == "" || this.responseDate2 == null) {

    //     this.transactiondate = true;
    //     this.transactionenddate = "Trandsaction end date is required";
    //   }
    // }
    // else if (this.transaction.maxAmount == "" || this.transaction.maxAmount == null) {
    //   this.maxAmount = true;


    //   if (this.transaction.merchantId == "" || this.transaction.merchantId == null) {
    //     this.merchant = true;
    //   }

    //   if (this.transaction.minAmount == "" || this.transaction.minAmount == null) {

    //     this.minAmount = true;
    //   }

    //   if (this.transaction.type == "" || this.transaction.type == null) {

    //     this.serviceType = true;
    //   }

    //   if (this.responseDate1 == "" || this.responseDate1 == null) {
    //     this.transactionsdate = true;

    //   }
    //   if (this.responseDate2 == "" || this.responseDate2 == null) {

    //     this.transactiondate = true;
    //     this.transactionenddate = "Trandsaction end date is required";
    //   }
    // }
    else if (this.transaction.type == "" || this.transaction.type == null) {
      this.serviceType = true;
      if (this.transaction.merchantId == "" || this.transaction.merchantId == null) {
        this.merchant = true;
      }

      // if (this.transaction.maxAmount == "" || this.transaction.maxAmount == null) {
      //   this.maxAmount = true;
      // }

      // if (this.transaction.minAmount == "" || this.transaction.minAmount == null) {
      //   this.minAmount = true;
      // }

    }


    else if (this.transaction.merchantId != null && this.transaction.type != null && this.responseDate1 == null && this.responseDate2 == null) {

      if (this.transaction.merchantId != null && this.transaction.type != null && this.responseDate1 == null && this.responseDate2 == null) {

       
        this.getTransactionBasedMerchantAndService();  // 1
      }

      else {
        
      }

    }


    else if (this.transaction.merchantId != null && this.transaction.type != null && this.responseDate1 != null && this.responseDate2 == null) {
      

      if (this.responseDate2 == null || this.responseDate2 == "") {
        this.toDateEmpty();
      }

      else {
        
      }
    }

    else if (this.transaction.merchantId != null && this.transaction.type != null && this.responseDate1 != null && this.responseDate2 != null) {

      
      this.getTransactionBasedMerchantAndService();  // 2

    }

    else {
      
    }

   // else if (this.transaction.merchantId != null && this.serviceType != null)  // old start
    
    //{
    //   if (this.endDate.status == "VALID") 
    //   {



    //     this.transaction.fromDate = this.responseDate1;
    //     this.transaction.toDate = this.responseDate2;





    //     if (this.merchantCodeValueForm1.valid && this.tranMaxValue.valid) {
    //       this.tranMaxValue.setErrors(null)
    //       this.spinnerService.show();

    //       this.transaction.merchantId;

    //       this.service.getTransaction(this.transaction).subscribe(data => {
    //         this.transactionResponse = data;
    //         this.transactionres = data;



    //         if (this.transactionResponse.length == 1 && this.transactionResponse[0].referenceid === '0') {
    //           this.table = false;
    //           this.pagination = false;

    //           this.notes=true;
    //           this.snackBar.open("Transactions not found", '',
    //             {
    //               horizontalPosition: 'center',
    //               verticalPosition: 'top',
    //               duration: 6000,
    //               panelClass: 'center',
    //             })
    //         }
    //         else if (this.transactionResponse.length > 0) {
    //           this.dataSource.data = [];
    //           this.filter.reset();
    //           this.dataSource.filter = " "

    //           this.notes=false;
    //           // this.snackBar.open('Data fetched successfully', '',
    //           //   {
    //           //     horizontalPosition: 'center',
    //           //     verticalPosition: 'top',
    //           //     duration: 6000,
    //           //     panelClass: 'center',
    //           //   });
    //           this.table = true;
    //           this.pagination = true;

    //           // this.transactionResponse.forEach(stat => {
    //           //   var response = stat.status
    //           //   // var numdate: number = +date;
    //           
    //           //   if(response=="true"){
    //           //     var statusConv=response.replace("true","Success")
    //           //     stat.status = statusConv;

    //           //   }else if(response=="Pending"){
    //           //     var statusConv=response.replace("Pending","Pending")
    //           //     stat.status = statusConv;
    //           //   }

    //           //   else{
    //           //     var statusConv=response.replace("false","Failure")
    //           //     stat.status = statusConv;
    //           //   }
    //           // })
    //           var datePipe = new DatePipe("en-US");

    //           this.transactionResponse.forEach(dte => {
    //             var dat = dte.date
    //             // var numdate: number = +date;
    //            
    //             this.dateconv = datePipe.transform(dat, 'dd/MM/yyyy hh:mm:ss a');
    //             dte.date = this.dateconv;
    //             


    //           })
    //           this.transactionResponse.forEach(amt => {
    //             var amo = amt.amount
    //             var numAmo: number = +amo;
    //             let formatAmo = formatNumber(numAmo, 'en-US',
    //               '1.2');
    //             var wholeAmo = formatAmo.replace(/,/g, "")
    //             var deciAmo = Number(wholeAmo)
    //             var conv = deciAmo.toLocaleString('en-IN', {
    //               minimumFractionDigits: 2, maximumFractionDigits: 2
    //             })
    //             amt.amount = conv
    //           })


    //         } else {
    //           this.snackBar.open("Transactions not found", '',
    //             {
    //               horizontalPosition: 'center',
    //               verticalPosition: 'top',
    //               duration: 6000,
    //               panelClass: 'center',
    //             })
    //           this.table = false;
    //           this.pagination = false;
    //         }


    //         this.dataSource.data = this.transactionResponse;
    //         this.spinnerService.hide();


    //       });

    //     }
    //     else {

    //     }



    //   }
    // }
    //}  // old end 


    

  } 
 

  newMethod() {
    this.merchant = false;
    this.maxAmount = false;
    this.minAmount = false;
    this.serviceType = false
    this.monthPeriod=false;

    this.transaction.merchantId = "";
    this.transaction.minAmount = "";
    this.transaction.maxAmount = "";
    this.transaction.type = "";
    this.newDate = "";
    this.enDate = "";
    this.transaction.fromtime = "";
    this.transaction.totime = "";
    this.disToDate = true;
    this.disFromTime = true;
    this.disToTime = true;
    this.tranMaxValue.setErrors(null)


    

    if (this.startDate.dirty) {
      this.startDate.reset();
      this.endDate.reset();
      this.startTime.reset();
      this.endTime.reset();
    }

    this.pagination = false;
    this.table = false;
    this.dataSource.data = [];

  }

  getMerchantCode() {
    // if(this.transaction.referenceId!= null && this.transaction.merchantId!=null)
    // {
    if (this.transRequest.merchantId == "") {
      this.getMerchant();
      // this.merchant=false;
    } else {

      this.transaction.fromDate = this.responseDate1;
      this.transaction.toDate = this.responseDate2;
      this.oldMerchant = false;

      if (this.merchantCodeValueForm2.valid) {
        this.spinnerService.show();

        this.transRequest.merchantId;

        this.service.getTransactionRequest(this.transRequest).subscribe(data => {
          this.transactionResponse = data;

       

          this.dataSource.data = this.transactionResponse;
          this.spinnerService.hide();
          if (this.transactionResponse[0].message == "Transactions Successfully Fetched!.") {
            this.dataSource.data = []
            this.filter.reset();
            this.dataSource.filter = " "
            this.dataSource.data = this.transactionResponse;
            // this.snackBar.open('Data fetched successfully', '',
            //   {
            //     horizontalPosition: 'center',
            //     verticalPosition: 'top',
            //     duration: 3000,
            //     panelClass: 'center',
            //   });
            this.notes=false;
            this.table = true;
            this.pagination = true;

            // this.transactionResponse.forEach(stat => {
            //   var response = stat.status
            //   // var numdate: number = +date;
            // 
            // if(response=="Pending"){
            //     var statusConv=response.replace("Pending","Pending")
            //     stat.status = statusConv;
            //   }
            //   else if(response=="false"){
            //     var statusConv=response.replace("false","Failure")

            //     stat.status = statusConv;
            //   }
            //   else{
            //     var statusConv=response.replace("true","Success")
            //     stat.status = statusConv;
            //   }
            // })


            var datePipe = new DatePipe("en-US");

            this.transactionResponse.forEach(dte => {
              var dat = dte.date
              // var numdate: number = +date;
              
              this.dateconv = datePipe.transform(dat, 'dd/MM/yyyy hh:mm:ss a');
              dte.date = this.dateconv;
              


            })
            this.transactionResponse.forEach(amt => {
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
          }
          else {
            this.snackBar.open("Transactions not found", '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 6000,
                panelClass: 'center',
              })
              this.notes=true;
            this.table = false;
            this.pagination = false;
          }
        })

      }




    }
  }

  handleZero(event: any) {
    if (event.target.value.length === 0 && event.which === 48) {
      event.preventDefault()
    }
  }

  onBlur(): void {
    this.tranMaxValue.markAsUntouched()
  }

  transactionStatus() {
    if (this.transRequest.merchantId != null) {
      this.getMerchantCode();
    } else {
      this.getMerchant();
    }
  }
  change() {
    this.merchant = false;
    this.newMerchant = false;
    this.reference = false;
    this.oldMerchant = false;
    this.transRequest.referenceId = "";
    this.transRequest.merchantId = "";

    this.pagination = false;
    this.table = false;
    this.dataSource.data = [];
  }


  max(event: number) {

    this.pagination = false;
    this.table = false;
    this.dataSource.data = [];
    this.maxAmount = false;
    this.transRequest.referenceId = "";
    this.transRequest.merchantId = "";
  }
  // tranMinValue = new FormControl();
  min(event: any) {

    this.pagination = false;
    this.table = false;
    this.dataSource.data = [];

    this.transRequest.referenceId = "";
    this.transRequest.merchantId = "";
    if (this.tranMaxValue.dirty) {
      this.tranMaxValue.reset();


    }
    this.minValue = event
    this.tranMaxValue.setValidators([Validators.min(this.minValue)])
    //this.tranMaxValue.updateValueAndValidity()
    this.minAmount = false;
  }



  type() {
    this.serviceType = false;
  }
  disToDate: any
  disFromTime: any
  disToTime: any
  minTime: any

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
  clickFromTime() {
    if (!this.endDate.dirty) {
      this.snackBar.open('Please select To date', '',
        {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'center',
        });
    }
  }

  clickToTime() {
    if (!this.startTime.dirty) {
      this.snackBar.open('Please select From time', '',
        {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'center',
        });
    }
  }


  startToday = new Date();



  txndate() {

    if (this.picker1 != undefined) {
      this.picker1.defaultTime = "12:00"
    }

    this.monthPeriod=true;
    this.pagination = false;
    this.table = false;
    this.dataSource.data = [];
    if (this.startDate.dirty && (this.transaction.fromDate != null || this.transaction.fromDate != "")) {
      this.disToDate = false

    }
    if (this.endDate.dirty || this.startTime.dirty || this.endTime.dirty) {
      this.endDate.reset()
      this.startTime.reset()
      this.endTime.reset()
      this.disFromTime = true
      this.disToTime = true
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
    this.transRequest.merchantId = "";
    this.transRequest.referenceId = "";
  }

  monthDiff(dateFrom: any, dateTo: any) {
    if (dateFrom != undefined) {
      var fromDate = new Date(dateFrom);
      return dateTo.getMonth() - fromDate.getMonth() +
        (12 * (dateTo.getFullYear() - fromDate.getFullYear()))
    } else {
      return null;
    }
  }


  passwordChange() {
    if (this.merchantCodeValueForm2.hasError('pattern')) {
      return 'Enter valid merchant code';
    }
    return this.merchantCodeValueForm2.hasError('minlength') ? 'Should have minimum 9 characters' : '';

  }

  passwordChange1() {
    if (this.merchantCodeValueForm1.hasError('pattern')) {
      return 'Enter valid merchant code';
    }
    return this.merchantCodeValueForm1.hasError('minlength') ? 'Should have minimum 9 characters' : '';

  }

  txnEnddate() {

    if (this.picker1 != undefined) {
      this.picker1.defaultTime = "12:00"
    }
    this.monthPeriod=true;
    this.pagination = false;
    this.table = false;
    this.dataSource.data = [];

    if (this.endDate.dirty && this.startDate.dirty) {
      this.disFromTime = false
    }
    if (this.startTime.dirty || this.endTime.dirty) {
      this.startTime.reset();
      this.endTime.reset();
      this.disToTime = true
    }
  }
  today = new Date()
  timeChange() {

    this.pagination = false;
    this.table = false;
    this.dataSource.data = [];

    var d1 = this.datePipe.transform(this.startDate.value, 'dd/MM/yyyy');
    var d2 = this.datePipe.transform(this.endDate.value, 'dd/MM/yyyy');


    if (d1 === d2) {
      this.minTime = this.transaction.fromtime
    }else {
      this.minTime = undefined;
      if (this.picker2 != undefined) {
        this.picker2.defaultTime = "12:00"
      }
    }
    if (this.startTime.dirty) {
      this.disToTime = false
    }
    if (this.endTime.dirty) {
      this.endTime.reset();
    }

    this.strTime = false;
  }

  getMaxValueError() {
    if (this.tranMaxValue.invalid) {
      return 'Max amount should be greater than min amount'
    }
    return 'Max amount should be greater than min amount'
  }
  timeChanged() {
    this.enTime = false;
  }

  letterOnly(event: any) {
    event.target.maxLength = 30;

    var charCode = event.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)

      return true;
    else
      return false;




  }


  getTransactionBasedMerchantAndService() {

    this.transaction.fromDate = this.responseDate1;
    this.transaction.toDate = this.responseDate2;





    if (this.merchantCodeValueForm1.valid && this.tranMaxValue.valid) {
      this.tranMaxValue.setErrors(null)
      this.spinnerService.show();

      this.transaction.merchantId;

      

      this.service.getTransaction(this.transaction).subscribe(data => {

   

        this.transactionResponse = data;
        this.transactionres = data;



        if (this.transactionResponse.length == 1 && this.transactionResponse[0].referenceid === '0') {
          this.table = false;
          this.pagination = false;
          this.monthPeriod=false;
          this.snackBar.open("Transactions not found", '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 6000,
              panelClass: 'center',
            })
        }
        else if (this.transactionResponse.length > 0) {
          this.dataSource.data = [];
          this.filter.reset();
          this.dataSource.filter = " "
          // this.snackBar.open('Data fetched successfully', '',
          //   {
          //     horizontalPosition: 'center',
          //     verticalPosition: 'top',
          //     duration: 6000,
          //     panelClass: 'center',
          //   });
          this.table = true;
          this.pagination = true;
          this.monthPeriod=false;

          // this.transactionResponse.forEach(stat => {
          //   var response = stat.status
          //   // var numdate: number = +date;
          //   
          //   if(response=="true"){
          //     var statusConv=response.replace("true","Success")
          //     stat.status = statusConv;

          //   }else if(response=="Pending"){
          //     var statusConv=response.replace("Pending","Pending")
          //     stat.status = statusConv;
          //   }

          //   else{
          //     var statusConv=response.replace("false","Failure")
          //     stat.status = statusConv;
          //   }
          // })
          var datePipe = new DatePipe("en-US");

          this.transactionResponse.forEach(dte => {
            var dat = dte.date
            // var numdate: number = +date;
            
            this.dateconv = datePipe.transform(dat, 'dd/MM/yyyy hh:mm:ss a');
            dte.date = this.dateconv;
           


          })
          this.transactionResponse.forEach(amt => {
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


        } else {
          this.snackBar.open("Transactions not found", '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 6000,
              panelClass: 'center',
            })
          this.table = false;
          this.pagination = false;
          this.monthPeriod=false;
        }


        this.dataSource.data = this.transactionResponse;
        this.spinnerService.hide();


      });

    }
    else {

    }


  }

  toDateEmpty() {
    this.snackBar.open('Please select To date', '',
      {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'center',
      });
  }

}
