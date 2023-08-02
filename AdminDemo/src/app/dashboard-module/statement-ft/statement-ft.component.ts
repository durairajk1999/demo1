
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

import * as XLSX from 'xlsx';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';
import { EncryptionDTO } from 'src/app/encryption-dto';






@Component({
  selector: 'app-statement-ft',
  templateUrl: './statement-ft.component.html',
  styleUrls: ['./statement-ft.component.scss'],
  providers: [DatePipe]
})
export class StatementFtComponent implements AfterViewInit, OnInit {
  dateconv: any
  statementform!: FormGroup;
  hideRequiredMarker = true;
  table = false;

  table1 = false;

  table2 = false;

  disToDate!: boolean;

  transactionenddate = "";
  encryptandDecryptkey!: string;

  groupNameSearch = new FormControl();

  //encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  notes = true;
  range = new Date();
  expDate = new Date(this.range.setMonth(this.range.getMonth() - 3));

  accountnumbervalue!: boolean;
  transactionstartdatevalue!: boolean;
  transactionenddatavalue!: boolean;

  ftstatement: Ftstatement = new Ftstatement();

  parentMenu: ParentMenus = new ParentMenus();

  encryptDTO: EncryptionDTO = new EncryptionDTO();

  parentMenu2: ParentMenus[] = [];

  accountnumberlist1: Record<any, any>[] = this.parentMenu2;
  accountnumberlist2: Record<any, any>[] = this.parentMenu2;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;

  selectedCustomerID = "";
  selectedAccountNumberValue = "";

  transactonstartdate = ""
  selectedtransactionendDate = "";
  today = new Date();

  statementResponse: StatementResponse = new StatementResponse();

  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  statement: StatementResponseContent[] = [];

  statementList!: StatementList[];


  resBody: ResBody = new ResBody();

  resBodyList: ResBody[] = [];

  accountNum = new FormControl();

  date = "";
  pageSizes = [2, 4, 6];
  displayedColumns: string[] = ['Txndate', 'Txndesc', 'Amtwithdrawal', 'Amtdeposite', 'Balance'];
  displayedColumns1: string[] = ['CustomerId', 'CodeAccountNo', 'CustomerName', 'TxnStartDate', 'TxnEndDate', 'OpeningBalance', 'ClosingBalance'];




  private sort!: MatSort;
  private sort2!: MatSort;


  @ViewChild('firstTableSort') set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild('secondTableSort') set matSort2(ms: MatSort) {
    this.sort2 = ms;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.myFirstTableData.sort = this.sort;
    this.mySecondTableData.sort = this.sort2;
  }
  myFirstTableData = new MatTableDataSource<StatementList>(this.statementList);
  mySecondTableData = new MatTableDataSource<ResBody>(this.resBodyList);
  startDate = new FormControl();
  endDate = new FormControl();

  txnStartDate!: any;

  txnEndDate!: any;

  ftencryptKey!: string;
  statusMessage!: string;
  constructor(private _liveAnnouncer: LiveAnnouncer, private dateAdapter: DateAdapter<Date>, private cdref: ChangeDetectorRef, private service: ServicesService, private datePipe: DatePipe, private spinnerService: NgxSpinnerService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.dateAdapter.setLocale('en-GB');

    this.today.setDate(this.today.getDate());


  }
  // @ViewChild('firstTableSort')
  // public firstTableSort!: MatSort;

  // @ViewChild('secondTableSort')
  // public secondTableSort!: MatSort;
  @ViewChild('paginator', { static: false }) set paginatorPageSize(pager: MatPaginator) {
    if (pager) {
      this.myFirstTableData.paginator = pager;
      this.myFirstTableData.paginator._intl = new MatPaginatorIntl()
      this.myFirstTableData.paginator._intl.itemsPerPageLabel = "";
      this.myFirstTableData.paginator.selectConfig.disableOptionCentering = true;
    }
  }
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.myFirstTableData.filter = filterValue.trim().toLowerCase();
  }
  // announceSortChange(sortState: Sort) {

  //   if (sortState.direction) {
  //     this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
  //   } else {
  //     this._liveAnnouncer.announce('Sorting cleared');
  //   }
  // }
  ngOnInit() {





    this.service.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;
      const keyValue1 = keys.split("//");

     
      const firstDecrypt = this.encryptAndDecrypt.decryptfinal(keyValue1[1].trim(), keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      const finalkeyValue1 = finalkeyValue;

      this.ftencryptKey = finalkeyValue1[1].trim();

      this.encryptandDecryptkey=finalkeyValue1[0].trim();



      if (this.ftencryptKey != "" || this.ftencryptKey != null) {
        this.getValue();
      }
    });


    

   
    this.disToDate = true;
    this.accountnumbervalue = false;
    this.transactionstartdatevalue = false;
    this.transactionenddatavalue = false;

  }


  
  exportExcel() {
    const workSheet = XLSX.utils.json_to_sheet(this.myFirstTableData.data.map((item) => { return { "Txn Date & Time": item.txn_date, "Transaction Description": item.txn_desc, "Withdrawal (₹)": item.amt_withdrawal, "Deposit (₹)": item.amt_deposit, "Balance (₹)": item.balance }; }));
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
    XLSX.writeFile(workBook, 'Fund Transfer - Statement.xlsx');
  }
  getStatementList() {




    if ((this.selectedAccountNumberValue == null || this.selectedAccountNumberValue == "") && (this.ftstatement.transactionStartDate == null || this.ftstatement.transactionStartDate == "") && (this.ftstatement.transactionEndDate == null || this.ftstatement.transactionEndDate == "")) {
      this.accountnumbervalue = true;
      this.transactionstartdatevalue = true;
      this.transactionenddatavalue = true;
      this.transactionenddate = "Transaction end date is required"
    }
    else {
      if (this.selectedAccountNumberValue == null || this.selectedAccountNumberValue == "") {
        this.accountnumbervalue = true;


        if (this.ftstatement.transactionStartDate == null || this.ftstatement.transactionStartDate == "") {

          this.transactionstartdatevalue = true;
        }

        if (this.ftstatement.transactionEndDate == null || this.ftstatement.transactionEndDate == "") {
          this.transactionenddatavalue = true;
          this.transactionenddate = "Transaction end date is required"

        }



      }


      else if (this.ftstatement.transactionStartDate == null || this.ftstatement.transactionStartDate == "") {
        this.transactionstartdatevalue = true;



        if (this.selectedAccountNumberValue == null || this.selectedAccountNumberValue == "") {
          this.accountnumbervalue = true;
        }

        if (this.ftstatement.transactionEndDate == null || this.ftstatement.transactionEndDate == "") {
          this.transactionenddatavalue = true;
          this.transactionenddate = "Transaction end date is required"
        }



      }
      else if (this.ftstatement.transactionEndDate == null || this.ftstatement.transactionEndDate == "") {
        this.transactionenddatavalue = true;
        this.transactionenddate = "Transaction end date is required"

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
          this.ftstatement.customerId = this.selectedCustomerID;
          this.ftstatement.accountNumber = this.selectedAccountNumberValue;
          this.ftstatement.transactionStartDate = this.txnStartDate;
          this.ftstatement.transactionEndDate = this.txnEndDate;
          this.spinnerService.show();


          //this.mySecondTableData.data = [];

          this.resBodyList = [];


          const encryptdata = this.encryptAndDecrypt.encryptfinal(this.ftstatement, this.ftencryptKey);
          this.encryptDTO.data = encryptdata;
          this.service.getStatement(this.encryptDTO).subscribe(data => {
            const decryptData = this.encryptAndDecrypt.decryptfinal(data.data, this.ftencryptKey);

            


            var response = JSON.parse(decryptData);

            this.statementResponse = response
            this.spinnerService.hide();

            const errorReason = this.statementResponse.responseContent.AdhocStatementRes.ResBody.error_msg;

            if (errorReason == "Success") {


              // this.snackBar.open("Data fetched successfully", '',
              //   {
              //     horizontalPosition: 'center',
              //     verticalPosition: 'top',
              //     duration: 3000,
              //     panelClass: 'center',
              //   });

              this.statementList = this.statementResponse.responseContent.AdhocStatementRes.ResBody.statement;
              this.resBodyList.push(this.statementResponse.responseContent.AdhocStatementRes.ResBody);

              var datePipe = new DatePipe("en-US");

              this.statementList.forEach(dte => {
                var dat = dte.txn_date
                // var numdate: number = +date;
                // this.dateconv = datePipe.transform(dat, 'MM/dd/yyyy hh:mm:ss a');
                // let myDate = dat.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
                this.dateconv = this.datePipe.transform(dat, 'dd/MM/yyyy hh:mm:ss a', 'es-ES');
                dte.txn_date = this.dateconv;

                dte.txn_date = this.dateconv;


              })


              this.statementList.forEach(amt => {
                var depo = amt.amt_deposit
                var withdraw = amt.amt_withdrawal
                var balance = amt.balance
                var numDepo: number = +depo;
                var numWith: number = +withdraw
                var numBalan: number = +balance

                let formatDepo = formatNumber(numDepo, 'en-US',
                  '1.2');
                let formatWith = formatNumber(numWith, 'en-US',
                  '1.2');
                let formatBalan = formatNumber(numBalan, 'en-US',
                  '1.2');
                var wholeDep = formatDepo.replace(/,/g, "")
                var wholeWith = formatWith.replace(/,/g, "")
                var wholeBalan = formatBalan.replace(/,/g, "")

                var deciDep = Number(wholeDep)
                var deciWith = Number(wholeWith)
                var deciBal = Number(wholeBalan)

                var convDep = deciDep.toLocaleString('en-IN', {
                  minimumFractionDigits: 2, maximumFractionDigits: 2
                })
                var convWith = deciWith.toLocaleString('en-IN', {
                  minimumFractionDigits: 2, maximumFractionDigits: 2
                })
                var convBal = deciBal.toLocaleString('en-IN', {
                  minimumFractionDigits: 2, maximumFractionDigits: 2
                })
                amt.amt_deposit = convDep
                amt.amt_withdrawal = convWith
                amt.balance = convBal

              })



              this.resBodyList.forEach(amt => {
                var open = amt.opening_balance
                var close = amt.closing_balance
                var numOpen: number = +open;
                var numClo: number = +close

                let formatOpen = formatNumber(numOpen, 'en-US',
                  '1.2');
                let formatClo = formatNumber(numClo, 'en-US',
                  '1.2');
                var wholeOpen = formatOpen.replace(/,/g, "")
                var wholeClo = formatClo.replace(/,/g, "")

                var deciOpen = Number(wholeOpen)
                var deciClo = Number(wholeClo)

                var convOpen = deciOpen.toLocaleString('en-IN', {
                  minimumFractionDigits: 2, maximumFractionDigits: 2
                })
                var convClo = deciClo.toLocaleString('en-IN', {
                  minimumFractionDigits: 2, maximumFractionDigits: 2
                })
                amt.opening_balance = convOpen
                amt.closing_balance = convClo
              })

              this.groupNameSearch.reset();
              this.myFirstTableData.filter = "";
              this.myFirstTableData.data = [];
              this.mySecondTableData.data = [];
              this.table = true;
              this.table1 = true;
              this.table2 = true;
              this.notes = false;
              this.mySecondTableData.data = this.resBodyList;
              this.myFirstTableData.data = this.statementList;


            }

            else {

              const errorvalue = this.statementResponse.responseContent.AdhocStatementRes.ResBody.error_msg;

              if (errorvalue == "Statement duration can not be greater than three months") {

                this.snackBar.open('Statement duration cannot be greater than three months', '',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 3000,
                    panelClass: 'center',
                  });

                this.table = false;
                this.mySecondTableData.data = [];

                this.table1 = false;

                this.table2 = false;

                this.myFirstTableData.data = [];

              }
              else {


                this.snackBar.open(this.statementResponse.responseContent.AdhocStatementRes.ResBody.error_msg, '',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 3000,
                    panelClass: 'center',
                  });

                this.table = false;
                this.mySecondTableData.data = [];

                this.table1 = false;

                this.table2 = false;

                this.myFirstTableData.data = [];

              }






            }


            // if(this.statementResponse.statusCode == 200)
            // {
            //   this.snackBar.open("Data fetched successfully",'' ,
            //   {
            //   horizontalPosition:'center',
            //   verticalPosition:'top',
            //   duration: 3000,
            //   panelClass: 'center',
            //   });
            // this.statementList=this.statementResponse.responseContent.adhocStatementRes.resBody.statement;
            // this.resBodyList.push(this.statementResponse.responseContent.adhocStatementRes.resBody);
            // this.myFirstTableData.data = this.statementList;
            // this.mySecondTableData.data = this.resBodyList;
            // } 
          });

        }

        else {

          this.transactionenddatavalue = true;
          this.transactionenddate = "Transaction end date invalid"
        }



        //  else if(this.statementResponse.statusCode == 409) 
        //    {

        //      this.statusMessage = this.statementResponse.responseContent.adhocStatementRes.resBody.error_reason;

        //      this.snackBar.open(this.statusMessage,'' ,
        //      {
        //      horizontalPosition:'center',
        //      verticalPosition:'top',
        //      duration: 3000,
        //      panelClass: 'center',


        //      });


        //   } else if(this.statementResponse.statusCode == 400)
        //   {

        //     this.statusMessage = this.statementResponse.message;

        //     this.snackBar.open(this.statusMessage,'' ,
        //     {
        //     horizontalPosition:'center',
        //     verticalPosition:'top',
        //     duration: 3000,
        //     panelClass: 'center',


        //     });


        //   }
        //   else {
        //     this.statusMessage = this.statementResponse.message;

        //     this.snackBar.open(this.statusMessage,'' ,
        //     {
        //     horizontalPosition:'center',
        //     verticalPosition:'top',
        //     duration: 3000,
        //     panelClass: 'center',


        //     });


        //   }

        // })

      }
    }
  }

  selectAccountNumber() {
    this.service.fetchAccountNumber().subscribe(accNumber => {


      const decryptData = this.encryptAndDecrypt.decryptfinal(accNumber.data, this.encryptandDecryptkey);

      this.parentMenu = JSON.parse(decryptData);
      this.accountnumberlist1 = this.parentMenu.responseContent;
      this.accountnumberlist2 = this.parentMenu.responseContent;

    })
  }

  startToday = new Date();

  transactionstartdateselect(transdate: string) {
    this.transactonstartdate = transdate;

    this.table = false;
    this.table1 = false;
    this.table2 = false;
    this.mySecondTableData.data = [];
    this.myFirstTableData.data = [];
    this.transactionstartdatevalue = false;


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

  // monthDiff(dateFrom: any, dateTo: any) {
  //   if (dateFrom != undefined) {
  //     return dateTo.getMonth() - dateFrom.getMonth() +
  //       (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
  //   } else {
  //     return null;
  //   }
  // }
  monthDiff(dateFrom: any, dateTo: any) {
    if (dateFrom != undefined) {

      var fromDate = new Date(dateFrom);

      return dateTo.getMonth() - fromDate.getMonth() +
        (12 * (dateTo.getFullYear() - fromDate.getFullYear()))
    } else {
      return null;
    }
  }

  transactionenddateselect(enddate: string) {

    this.notes = true;

    this.selectedtransactionendDate = enddate;

    this.table = false;
    this.table1 = false;
    this.table2 = false;


    this.mySecondTableData.data = [];
    this.myFirstTableData.data = [];




    this.transactionenddatavalue = false;
  }



  accNumberSelected(customerid: string) {

    this.table = false;
    this.mySecondTableData.data = [];

    this.table1 = false;

    this.table2 = false;


    this.myFirstTableData.data = [];



    this.accountnumbervalue = false;


    this.selectedCustomerID = customerid;


    for (let i = 0; i < this.parentMenu.responseContent.length; i++) {

      if (this.parentMenu.responseContent[i].customerId == this.selectedCustomerID) {


        this.selectedAccountNumberValue = this.parentMenu.responseContent[i].accNo;

      }

      else {
        // this.selectedAccountNumberValue="";
      }


    }





  }




  // @HostListener('keydown', ['$event']) validateNo(e: KeyboardEvent) {


  // }

  search() {
  
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
  }

  clickEndDate() {
    if (!this.startDate.dirty) {
      this.snackBar.open('Please select transaction start date', '',
        {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'center',
        });
    }
  }






  getValue() {
    this.selectAccountNumber();
  }





}


