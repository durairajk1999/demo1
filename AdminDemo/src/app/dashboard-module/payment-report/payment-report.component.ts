
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { DatePipe, formatNumber } from '@angular/common';

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Ftstatement } from 'src/app/ftstatement';
import { ServicesService } from 'src/app/services.service';
import { StatementResponse } from 'src/app/statement-response';
import { StatementResponseContent } from 'src/app/statement-response-content';

import { StatementList } from 'src/app/statement-list';
import { ResBody } from 'src/app/res-body';
import { ParentMenus } from 'src/app/parent-menus';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

import { DateAdapter } from '@angular/material/core';
import { ResponseContentParentMenus } from 'src/app/response-content-parent-menus';

import { paymentReport } from './paymentReport';
import { paymentReportResponse } from './paymentreportResponse';
import * as XLSX from 'xlsx';
import { ReportPopupComponent } from '../report-popup/report-popup.component';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';
import { EncryptionDTO } from 'src/app/encryption-dto';

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.scss'],
  providers: [DatePipe]
})
export class PaymentReportComponent implements OnInit {


  statementform!: FormGroup;

  dateconv!: any;
  hideRequiredMarker = true;
  table = false;

  filter = new FormControl();


  table1 = false;

  encryptandDecryptkey!:string;
  startToday = new Date();

  table2 = false;

  disToDate!: boolean;

  transactionenddate = "";

  notes = true;

  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  paymentResponse: paymentReportResponse = new paymentReportResponse();

  encryptDTO :EncryptionDTO = new EncryptionDTO();



  accountnumbervalue!: boolean;
  transactionstartdatevalue!: boolean;
  transactionenddatavalue!: boolean;

  ftstatement: Ftstatement = new Ftstatement();
  parentMenu1: ResponseContentParentMenus[] = [];


  parentMenu: ParentMenus = new ParentMenus();

  accountnumberlist1: Record<any, any>[] = this.parentMenu.responseContent;
  accountnumberlist2: Record<any, any>[] = this.parentMenu.responseContent;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;

  selectedCustomerID = "";
  selectedAccountNumberValue = "";

  transactonstartdate = ""
  selectedtransactionendDate = "";
  today = new Date();

  statementResponse: StatementResponse = new StatementResponse();

  statement: StatementResponseContent[] = [];

  statementList!: StatementList[];


  resBody: ResBody = new ResBody();



  paymentReportList: paymentReport[] = [];


  accountNum = new FormControl();

  date = "";
  pageSizes = [2, 4, 6];

  displayedColumns: string[] = ['createDate', 'shortName', 'accountNumber','transactionStatus', 'amount','actions'];

  // displayedColumns: string[] = ['createDate', 'beneficiaryName', 'accountNumber','ifsc','referenceNumber','amount','remarks','bankReferenceNumber','transferType','transactionStatus','debitAccount','actions'];
  displayedColumns1: string[] = ['CustomerId', 'CodeAccountNo', 'CustomerName', 'TxnStartDate', 'TxnEndDate', 'OpeningBalance', 'ClosingBalance'];




  private sort!: MatSort;
  private sort2!: MatSort;


  @ViewChild('firstTableSort') set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }


  setDataSourceAttributes() {
    this.myFirstTableData.sort = this.sort;

  }
  myFirstTableData = new MatTableDataSource<paymentReport>(this.paymentReportList);



  startDate = new FormControl();
  endDate = new FormControl();

  txnStartDate!: any;

  txnEndDate!: any;

  statusMessage!: string;
  constructor(private _liveAnnouncer: LiveAnnouncer, private cdref: ChangeDetectorRef, private dateAdapter: DateAdapter<Date>, private service: ServicesService, private datePipe: DatePipe, private spinnerService: NgxSpinnerService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.dateAdapter.setLocale('en-GB');

    this.today.setDate(this.today.getDate());


  }

  @ViewChild('paginator', { static: false }) set paginatorPageSize(pager: MatPaginator) {
    if (pager) {
      this.myFirstTableData.paginator = pager;
      this.myFirstTableData.paginator._intl = new MatPaginatorIntl()
      this.myFirstTableData.paginator._intl.itemsPerPageLabel = "";
      this.myFirstTableData.paginator.selectConfig.disableOptionCentering = true;
    }
  }

  ngAfterViewInit() {

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.myFirstTableData.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.disToDate = true;
    this.accountnumbervalue = false;
    this.transactionstartdatevalue = false;
    this.transactionenddatavalue = false;



    
    this.service.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;
      const keyValue1 = keys.split("//");
      const firstDecrypt = this.encryptAndDecrypt.decryptfinal(keyValue1[1].trim(), keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      const finalkeyValue1 = finalkeyValue;

      this.encryptandDecryptkey = finalkeyValue1[0].trim();

      if (this.encryptandDecryptkey != "" || this.encryptandDecryptkey != null) {
        this.getValue();
      }
    });

    
    

   
    
  }


  ngAfterContentChecked() {
    
    this.cdref.detectChanges();
 }


  getStatementList() {

    this.filter.reset();
    this.myFirstTableData.filter = " "


    if ((this.selectedAccountNumberValue == null || this.selectedAccountNumberValue == "") && (this.ftstatement.transactionStartDate == null || this.ftstatement.transactionStartDate == "") && (this.ftstatement.transactionEndDate == null || this.ftstatement.transactionEndDate == "")) {
      this.accountnumbervalue = true;
      this.transactionstartdatevalue = true;
      this.transactionenddatavalue = true;
      this.transactionenddate = "To date is required"
    }
    else {
      if (this.selectedAccountNumberValue == null || this.selectedAccountNumberValue == "") {
        this.accountnumbervalue = true;


        if (this.ftstatement.transactionStartDate == null || this.ftstatement.transactionStartDate == "") {

          this.transactionstartdatevalue = true;
        }

        if (this.ftstatement.transactionEndDate == null || this.ftstatement.transactionEndDate == "") {
          this.transactionenddatavalue = true;
          this.transactionenddate = "To date is required"

        }



      }


      else if (this.ftstatement.transactionStartDate == null || this.ftstatement.transactionStartDate == "") {
        this.transactionstartdatevalue = true;



        if (this.selectedAccountNumberValue == null || this.selectedAccountNumberValue == "") {
          this.accountnumbervalue = true;
        }

        if (this.ftstatement.transactionEndDate == null || this.ftstatement.transactionEndDate == "") {
          this.transactionenddatavalue = true;
          this.transactionenddate = "To date is required"
        }



      }
      else if (this.ftstatement.transactionEndDate == null || this.ftstatement.transactionEndDate == "") {
        this.transactionenddatavalue = true;
        this.transactionenddate = "To date is required"

        if (this.selectedAccountNumberValue == null || this.selectedAccountNumberValue == "") {
          this.accountnumbervalue = true;
        }

        if (this.ftstatement.transactionStartDate == null || this.ftstatement.transactionStartDate == "") {

          this.transactionstartdatevalue = true;
        }

      }



      else {


        if (this.endDate.status == "VALID") {



          this.txnStartDate = this.datePipe.transform(this.startDate.value, 'yyyy-MM-dd');
          this.txnEndDate = this.datePipe.transform(this.endDate.value, 'yyyy-MM-dd');

          this.ftstatement.accountNumber = this.selectedAccountNumberValue;
          this.ftstatement.transactionStartDate = this.txnStartDate;
          this.ftstatement.transactionEndDate = this.txnEndDate;


          this.spinnerService.show();



          //this.myFirstTableData.data = [];

          ////("report request")
          //(this.ftstatement);

          const encryptData = this.encryptAndDecrypt.encryptfinal(this.ftstatement,this.encryptandDecryptkey);

          this.encryptDTO.data=encryptData;

          this.service.getPaymentReport(this.encryptDTO).subscribe(data => {


            const decryptData = this.encryptAndDecrypt.decryptfinal(data.data,this.encryptandDecryptkey);


            
          
            this.paymentResponse = JSON.parse(decryptData);




            this.spinnerService.hide();



            if (this.paymentResponse.statusCode == 200) {


              this.myFirstTableData.data = [];

              // this.snackBar.open("Data fetched successfully", '',
              //   {
              //     horizontalPosition: 'center',
              //     verticalPosition: 'top',
              //     duration: 3000,
              //     panelClass: 'center',
              //   });
              this.table = true;
              this.table1 = true;
              this.table2 = true;
              this.notes = false;

              var datePipe = new DatePipe("en-US");

              this.paymentResponse.responseContent.forEach(dte => {
                var dat = dte.createDate

                let myDate = dat.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
                this.dateconv = this.datePipe.transform(myDate, 'dd/MM/yyyy hh:mm:ss a', 'es-ES');
                dte.createDate = this.dateconv;


              })

              this.paymentResponse.responseContent.forEach(amt => {
                var amount = amt.amount

                var numDepo: number = +amount;


                let formatDepo = formatNumber(numDepo, 'en-US',
                  '1.2');

                var wholeDep = formatDepo.replace(/,/g, "")


                var deciDep = Number(wholeDep)


                var convDep = deciDep.toLocaleString('en-IN', {
                  minimumFractionDigits: 2, maximumFractionDigits: 2
                })

                amt.amount = convDep


              })

              this.myFirstTableData.data = this.paymentResponse.responseContent;


            }

            else {



              if (this.paymentResponse.statusCode == 409) {

                this.snackBar.open('Record not found', '',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 3000,
                    panelClass: 'center',
                  });

                this.table = false;

                this.notes = true;


                this.table1 = false;

                this.table2 = false;

                this.myFirstTableData.data = [];

              }
              else {


                this.snackBar.open("Failed", '',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 3000,
                    panelClass: 'center',
                  });

                this.notes = true;
                this.table = false;
                // this.mySecondTableData.data = [];

                this.table1 = false;

                this.table2 = false;

                this.myFirstTableData.data = [];

              }






            }



          });

        }

        else {

          this.transactionenddatavalue = true;
          this.transactionenddate = "To date invalid"
        }





      }
    }
  }


  transactionstartdateselect(transdate: string) {

    this.notes = true;
    this.transactonstartdate = transdate;

    this.table = false;
    this.table1 = false;
    this.table2 = false;
    //this.mySecondTableData.data = [];
    this.myFirstTableData.data = [];
    this.transactionstartdatevalue = false;

  }

  transactionenddateselect(enddate: string) {

    this.notes = true;

    this.selectedtransactionendDate = enddate;

    this.table = false;
    this.table1 = false;
    this.table2 = false;



    this.myFirstTableData.data = [];




    this.transactionenddatavalue = false;
  }



  accNumberSelected(customerid: string) {


    this.notes = true;

    this.table = false;


    this.table1 = false;

    this.table2 = false;


    this.myFirstTableData.data = [];



    this.accountnumbervalue = false;


    this.selectedCustomerID = customerid;


    for (let i = 0; i < this.parentMenu.responseContent.length; i++) {

      if (this.parentMenu.responseContent[i].beneficiaryAccountNumber == this.selectedCustomerID) {


        this.selectedAccountNumberValue = this.parentMenu.responseContent[i].beneficiaryAccountNumber;

      }

      else {

      }


    }





  }






  search() {

  }



  onlyNumberKey(event: any) {

    event.target.maxLength = 30;

    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  orgValueChange() {

    this.notes = true;

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


  monthDiff(dateFrom: any, dateTo: any) {
    if (dateFrom != undefined) {
      return dateTo.getMonth() - dateFrom.getMonth() +
        (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
    } else {
      return null;
    }
  }


  selectedAccountNumber(keyValue :string) {

    this.accountnumberlist1 = [];
    this.accountnumberlist2 = [];

    this.service.getAccountDetails().subscribe(accnumber => {



      const encryptData = this.encryptAndDecrypt.decryptfinal(accnumber.data,keyValue)

      //(encryptData)
      this.parentMenu=JSON.parse(encryptData);


      //(accnumber)
      if (this.parentMenu.statusCode == 200) {

       // this.parentMenu = accnumber;

        for (let i = 0; i < this.parentMenu.responseContent.length; i++) {

          this.parentMenu.responseContent[i].shortName = this.parentMenu.responseContent[i].shortName + " - " + this.parentMenu.responseContent[i].beneficiaryAccountNumber;
        }

        this.accountnumberlist1 = this.parentMenu.responseContent;
        this.accountnumberlist2 = this.parentMenu.responseContent;

      }

      else {

        this.accountnumberlist1 = [];
        this.accountnumberlist2 = [];
      }






    })

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


  //   exportExcel() {
  //     const workSheet = XLSX.utils.json_to_sheet(this.myFirstTableData.data.map((item) => {return {"Date & Time": item.createDate,"Beneficiary Name":item.beneficiaryName," Account No": item.accountNumber,"Bank":item.bank ," Branch":item.branch," IFSC":item.ifsc," Txn.No": item.referenceNumber ," Amount (₹)":item.amount,"Remarks":item.remarks };       })     );
  //     const workBook: XLSX.WorkBook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
  //     XLSX.writeFile(workBook, 'Payment report.xlsx');
  // }

  // exportExcel() {
  //   const workSheet = XLSX.utils.json_to_sheet(this.myFirstTableData.data.map((item) => {return {"Txn Date & Time": item.createDate,"Beneficiary Name":item.beneficiaryName," Account No": item.accountNumber,"System Ref No":item.referenceNumber," Amount (₹)":item.amount,"Transaction Status":item.transactionStatus};       })     );
  //   const workBook: XLSX.WorkBook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
  //   XLSX.writeFile(workBook, 'Payment Report.xlsx');
  // }

  exportExcel() {
    const workSheet = XLSX.utils.json_to_sheet(this.myFirstTableData.data.map((item) => { return { "Txn Date & Time": item.createDate, "Beneficiary Name": item.beneficiaryName, " Beneficiary Account No.": item.accountNumber, "System Reference Number": item.referenceNumber, " Amount (₹)": item.amount, "Transaction Status": item.transactionStatus, "IFSC": item.ifsc, "Bank Ref.No.": item.bankReferenceNumber, "Debit A/c No": item.debitAccount, "Transfer Mode": item.transferType, "Remarks": item.remarks }; }));
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
    XLSX.writeFile(workBook, 'Payment Report.xlsx');
  }


  startView(ifsc: string, bankReferenceNumber: string, debitAccount: string, transferType: string, remarks: string,sysRefno:any, benename:string) {
    const dialogRef = this.dialog.open(ReportPopupComponent, {

      width: '355px',
      autoFocus: false,

      data: {
        ifsc: ifsc, bankReferenceNumber: bankReferenceNumber, debitAccount: debitAccount, transferType: transferType, remarks: remarks, sysRefno:sysRefno,benename:benename
      }
    });
  }

  getValue()
  {
    this.selectedAccountNumber( this.encryptandDecryptkey);
  }

}


