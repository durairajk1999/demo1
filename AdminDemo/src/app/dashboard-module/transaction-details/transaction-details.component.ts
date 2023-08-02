import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { formatNumber } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { District } from 'src/app/District';
import { MerchantStateRequest } from 'src/app/merchant-state-request';
import { Report } from 'src/app/report';
import { ResponseMerchantReport } from 'src/app/response-merchant-report';
import { ResponseStatement } from 'src/app/response-statement';
import { ServicesService } from 'src/app/services.service';
import { State } from 'src/app/state-details';
import { StatedetailsResult } from 'src/app/statedetails-result';
import { TransactionDetailsMerchant } from 'src/app/transaction-details-merchant';
import { TransactionMerchantRequest } from 'src/app/transaction-merchant-request';
import { Transactiondetails } from 'src/app/transactiondetails';
import { ServiceTypeTransactionRequest } from './ServiceTypeTransactionRequest';
import { ZonalFilterListRequest } from './ZonalFilterListRequest';
import { CurrentDateTransactionDetails } from './CurrentDateTransactionDetails';
import * as XLSX from 'xlsx';
import { MerchantWiseUsingNGOIdRequest } from './MerchantWiseUsingNGOIdRequest';
@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
  providers: [DatePipe]
})
export class TransactionDetailsComponent implements AfterViewInit {
  state = new FormControl('', [Validators.required]);
  district = new FormControl('', [Validators.required]);
  today = new Date();
  now = new Date();
  currentDateTransactions: CurrentDateTransactionDetails = new CurrentDateTransactionDetails
  merchantWiseUsingNGOIdRequest: MerchantWiseUsingNGOIdRequest = new MerchantWiseUsingNGOIdRequest;
  pagination1 = false;
  table1 = false;
  pagination2 = false;
  table2 = false;
  merchantID = "";
  endDateValid = false;
  selectedTodate = "";
  selectedFdate = "";
  merchantCodeValueForm = new FormControl();
  merchantCodeValue = "";
  disToDate!: boolean;

  isCurrentDateData:any;
  isMerchantData:any;
  isMerchantId:any;

  convRegDate!:any;

  monthperiod!:boolean;

  currentDate = new Date();

  notes!: boolean;
  // validation 
  stateNameSelect = "";
  districtNameSelect = "";
  iaNameSelect = "";
  merhcnatNameSelect = "";
  resetState = new FormControl();
  resetDistrict = new FormControl();
  resetIa = new FormControl();
  resetMerchant = new FormControl();
  merchantabc = new FormControl();
  filter = new FormControl();
  testCurrentDate: any;
  testCurrentFromDate: any;
  testCurrentToDate: any;
  constructor(private dateAdapter: DateAdapter<Date>, private cdref: ChangeDetectorRef, private service: ServicesService, private spinnerService: NgxSpinnerService, private snackBar: MatSnackBar, private datepipe: DatePipe) {
    this.dateAdapter.setLocale('en-GB');
    this.today.setDate(this.today.getDate())

    this.convRegDate = this.datepipe.transform(this.currentDate, 'dd/MM/YYYY');

    


  }
  displayedColumns: string[] = ['Service', 'Total_Transactions', 'Total_Amount', 'Success_Transactions', 'Success_Percent', 'Total_SuccAmount', 'Total_Incentive'];
  merchantdisplayedColumns: string[] = ['Merchant_Code', 'Total_Transactions', 'Total_Value', 'Total_SuccessTrans', 'Success_Percent', 'Success_Value', 'Incentive'];
  // dataSource = ELEMENT_DATA;
  // memberdataSource = ELEMENT_DATA1;
  transactionDetailsForm!: FormGroup;
  transactionDetails: Transactiondetails = new Transactiondetails()
  transactionMerchant: TransactionDetailsMerchant = new TransactionDetailsMerchant();
  hideRequiredMarker = "true"
  date = "";
  startDate = new FormControl();
  endDate = new FormControl();
  credential: StatedetailsResult = new StatedetailsResult();
  districtlist: StatedetailsResult[] = [];
  districtlist1: Record<any, any>[] = this.districtlist;
  districtlist2: Record<any, any>[] = this.districtlist;
  statelist: StatedetailsResult[] = [];
  statelist1: Record<any, any>[] = this.statelist;
  statelist2: Record<any, any>[] = this.statelist;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;
  serviceTypeTransactionDetails: ServiceTypeTransactionRequest = new ServiceTypeTransactionRequest();
  zonalFilterRequest: ZonalFilterListRequest[] = []
  ialist: StatedetailsResult[] = [];
  ialist1: Record<any, any>[] = this.ialist;
  ialist2: Record<any, any>[] = this.ialist;
  merchantList: StatedetailsResult[] = [];
  merchantlist1: Record<any, any>[] = this.merchantList;
  merchantlist2: Record<any, any>[] = this.merchantList;
  serviceTypeStateDistrictList: ResponseStatement[] = [];
  merchantStateDistrictList: ResponseMerchantReport[] = [];
  serviceTypeNgoIdList: ResponseStatement[] = [];
  merchantRequestStateList1: MerchantStateRequest[] = [];
  merchantRequestDistrictList1: District[] = [];
  //merchant table request structure
  merchantRequestDetails: TransactionMerchantRequest = new TransactionMerchantRequest();
  statedetails: State = new State();
  districtNamedetails: State = new State();
  iaListDetails: State = new State();
  merchantDetails: State = new State();
  serviceTypeStateDistrictDetails: Report = new Report();
  merchantStateDistrictDetails: any;
  // serviceTypeNgoIdDetails: Report = new Report();
  selectedStateName = "";
  selectedDistrictName = "";
  selectedIaName: any;
  selectedMerchant = "";
  statevalue!: boolean;
  districtvalue!: boolean;
  iavalue!: boolean;
  merchantvalue!: boolean;
  dataSource = new MatTableDataSource<ResponseStatement>(this.serviceTypeStateDistrictList);
  memberdataSource = new MatTableDataSource<ResponseMerchantReport>(this.merchantStateDistrictList);
  message!: string;
  firstmessage!: string;
  secondmessage!: string;
  convFromDate: any;
  convToDate: any;
  @ViewChild('firstTableSort', { static: false }) set firstTableSort(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild('secondTableSort', { static: false }) set secondTableSort(sort: MatSort) {
    this.memberdataSource.sort = sort;
  }
  @ViewChild('paginator', { static: false }) set paginatorPageSize(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = " ";
      this.dataSource.paginator.selectConfig.disableOptionCentering = true;
    }
  }
  @ViewChild('paginatorNew', { static: false }) set paginator(pager: MatPaginator) {
    if (pager) {
      this.memberdataSource.paginator = pager;
      this.memberdataSource.paginator._intl = new MatPaginatorIntl()
      this.memberdataSource.paginator._intl.itemsPerPageLabel = " ";
      this.memberdataSource.paginator.selectConfig.disableOptionCentering = true;
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  applyFilters(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.memberdataSource.filter = filterValue.trim().toLowerCase();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.firstTableSort;
    this.memberdataSource.sort = this.secondTableSort;
  }
  //datePipe = new DatePipe();
  ngOnInit(): void {

    this.isCurrentDateData=false;
    this.notes = true;
    this.monthperiod=true;
    this.currentDateServiceType();
    this.currentDateMerchantWise();
    this.disToDate = true;
    this.getStateDetailsList();
    this.statevalue = false;
    this.districtvalue = false;
    // this.iavalue = false;
    // this.merchantvalue = false;
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }
  exportExcel() {
    const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data.map((item) => { return { "Service Type": item.Service, "Total No.of Transactions": item.Total_Transactions, "Total Amount (₹)": item.Total_Amount, "No.of Success Transactions": item.Success_Transactions, "Success Percentage (%)": item.Success_Percent, "Success Amount (₹)": item.Total_SuccAmount, "Total Incentive (₹)": item.Total_Incentive }; }));
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
    XLSX.writeFile(workBook, 'Service Type Transaction Details.xlsx');
  }
  exportExcel1() {
    const workSheet = XLSX.utils.json_to_sheet(this.memberdataSource.data.map((item) => { return { "Merchant Code": item.Merchant_Code, "Total No.of Transactions": item.Total_Transactions, "Total Amount(₹)": item.Total_Value, "No.of Success Transactions": item.Total_SuccessTrans, "Success Percentage (%)": item.Success_Percent, "Success Amount (₹)": item.Success_Value, "Total Incentive (₹)": item.Incentive }; }));
    const workBook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
    XLSX.writeFile(workBook, 'Merchant Transaction Details.xlsx');
  }
  passwordChange() {
    if (this.merchantCodeValueForm.hasError('pattern')) {
      return 'Enter valid merchant code';
    }
    return this.merchantCodeValueForm.hasError('minlength') ? 'Should have minimum 9 characters' : '';
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
    if (evt.key == arrowRight || evt.key == arrowLeft || evt.key == del || evt.key == "," || evt.key == ".") {
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
  currentDateServiceType() {
    // this.pagination1 = true;
    // this.table1 = true;
    // this.pagination2 = true;
    // this.table2 = true;
    //no filter
    
    this.convFromDate = this.datepipe.transform(this.now, 'dd/MM/yyyy');
    this.testCurrentFromDate = this.convFromDate;
    this.testCurrentToDate = this.convToDate;
    this.convToDate = this.datepipe.transform(this.now, 'dd/MM/yyyy');
    this.currentDateTransactions.fromDate = this.convFromDate;
    this.currentDateTransactions.toDate = this.convToDate;
    this.spinnerService.show();
    this.service.getCurrentDateTransactionDetails(this.currentDateTransactions).subscribe(list => {
      this.spinnerService.hide();
      this.serviceTypeStateDistrictDetails = list;
      this.serviceTypeStateDistrictList = this.serviceTypeStateDistrictDetails.statement;
      if (this.serviceTypeStateDistrictList == null) {
        this.pagination1 = false;
        this.table1 = false;
        this.isShow = false;
        this.isCurrentDateData=false;
        // this.message = "Service type transaction record not found ";
        // this.snackBar.open(this.message, '', {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        //   duration: 3000,
        //   // panelClass: ['blue-snackbar']
        //   panelClass: 'center',
        // });

       
      }
      else {

        this.dataSource.data = [];
        this.pagination1 = true;
        this.table1 = true;
        this.isShow = true;
        this.isCurrentDateData=true;
        // this.firstmessage='Service type record retreived successfully'
        // this.snackBar.open('Data fetched successfully', '', {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        //   duration: 3000,
        //   panelClass: 'center',
        // });
        this.serviceTypeStateDistrictList.forEach(amt => {
          var totalAmo = amt.Total_Amount
          var succAmo = amt.Total_SuccAmount
          var totalIncen = amt.Total_Incentive
          var numAmo: number = +totalAmo;
          var numSucc: number = +succAmo
          var numInce: number = +totalIncen
          let formatAmo = formatNumber(numAmo, 'en-US',
            '1.2');
          let formatSucc = formatNumber(numSucc, 'en-US',
            '1.2');
          let formatInc = formatNumber(numInce, 'en-US',
            '1.2');
          var wholeAmo = formatAmo.replace(/,/g, "")
          var wholeSucc = formatSucc.replace(/,/g, "")
          var wholeInce = formatInc.replace(/,/g, "")
          var deciAmo = Number(wholeAmo)
          var deciSucc = Number(wholeSucc)
          var deciIncen = Number(wholeInce)
          var convAmou = deciAmo.toLocaleString('en-IN', {
            minimumFractionDigits: 2, maximumFractionDigits: 2
          })
          var convSucc = deciSucc.toLocaleString('en-IN', {
            minimumFractionDigits: 2, maximumFractionDigits: 2
          })
          var convIncen = deciIncen.toLocaleString('en-IN', {
            minimumFractionDigits: 2, maximumFractionDigits: 2
          })
          amt.Total_Amount = convAmou
          amt.Total_SuccAmount = convSucc
          amt.Total_Incentive = convIncen
        })
        this.pagination1 = true;
        this.table1 = true;
        this.pagination2 = true;
        this.table2 = true;
        this.dataSource.data = this.serviceTypeStateDistrictList;
      }
    });
  }
  currentDateMerchantWise() {
    //no filter
    this.convFromDate = this.datepipe.transform(this.now, 'dd/MM/yyyy');
    this.convToDate = this.datepipe.transform(this.now, 'dd/MM/yyyy');
    this.merchantRequestStateList1 = [];
    this.merchantRequestDistrictList1 = []
    this.merchantRequestStateList1.push({ state: "" })
    this.merchantRequestDistrictList1.push({ district: "" })
    this.merchantRequestDetails.state = this.merchantRequestStateList1;
    this.merchantRequestDetails.district = this.merchantRequestDistrictList1;
    this.merchantRequestDetails.fromDate = this.convFromDate
    this.merchantRequestDetails.toDate = this.convToDate
    
    this.spinnerService.show();
    this.service.getCurrentDateTransactionMerchantWise(this.merchantRequestDetails).subscribe(merchant => {

      this.spinnerService.hide();
      this.merchantStateDistrictDetails = merchant;
      this.merchantStateDistrictList = this.merchantStateDistrictDetails.statement;
      if (this.merchantStateDistrictList == null) {
        this.pagination2 = false;
        this.table2 = false;
        // this.message = "Merchant transaction record not found";
        // this.snackBar.open(this.message, '', {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        //   duration: 3000,
        //   // panelClass: ['blue-snackbar']
        //   panelClass: 'center',
        // });
      }
      else {
        this.memberdataSource.data = [];
        this.pagination2 = true;
        this.table2 = true;
        this.isCurrentDateData=true;
        this.merchantStateDistrictList.forEach(amt => {
          var totalAmo = amt.Total_Value
          var succAmo = amt.Success_Value
          var totalIncen = amt.Incentive
          var numAmo: number = +totalAmo;
          var numSucc: number = +succAmo
          var numInce: number = +totalIncen
          let formatAmo = formatNumber(numAmo, 'en-US',
            '1.2');
          let formatSucc = formatNumber(numSucc, 'en-US',
            '1.2');
          let formatInc = formatNumber(numInce, 'en-US',
            '1.2');
          var wholeAmo = formatAmo.replace(/,/g, "")
          var wholeSucc = formatSucc.replace(/,/g, "")
          var wholeInce = formatInc.replace(/,/g, "")
          var deciAmo = Number(wholeAmo)
          var deciSucc = Number(wholeSucc)
          var deciIncen = Number(wholeInce)
          var convAmou = deciAmo.toLocaleString('en-IN', {
            minimumFractionDigits: 2, maximumFractionDigits: 2
          })
          var convSucc = deciSucc.toLocaleString('en-IN', {
            minimumFractionDigits: 2, maximumFractionDigits: 2
          })
          var convIncen = deciIncen.toLocaleString('en-IN', {
            minimumFractionDigits: 2, maximumFractionDigits: 2
          })
          amt.Total_Value = convAmou
          amt.Success_Value = convSucc
          amt.Incentive = convIncen
        })
        this.memberdataSource.data = this.merchantStateDistrictList;
        // this.secondmessage = "Merchant record retreived successfully";
        // this.message = "Merchant record retreived successfully";
        // this.snackBar.open(this.message, '', {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        //   duration: 3000,
        //   // panelClass: ['blue-snackbar']
        //   panelClass: 'center',
        // })
      }
    })
  }
  getStateDetailsList() {
    // this.statevalue=true;
    this.service.getStateService().subscribe(statelist => {
      this.statedetails = statelist;
      this.statelist = this.statedetails.result;
      this.statelist1 = this.statelist;
      this.statelist2 = this.statelist;
    })
  }
  getDistrictName(statename: string) {
    this.stateNameSelect = statename;
    this.districtNameSelect = "";
    this.iaNameSelect = "";
    this.merhcnatNameSelect = "";
    this.dataSource.data = [];
    this.isShow = false;
    this.pagination1 = false;
    this.table1 = false;
    this.pagination2 = false;
    this.table2 = false;
    this.memberdataSource.data = [];
    this.districtlist1 = [];
    this.districtlist2 = [];
    this.ialist1 = [];
    this.ialist2 = [];
    this.merchantlist2 = [];
    this.merchantlist1 = [];
    this.merchantCodeValue = "";
    // this.dataSource.data = [];
    // this.memberdataSource.data = [];
    this.selectedStateName = statename;
    this.selectedDistrictName = "";
    this.transactionDetails.district_name = "";
    this.selectedIaName = ""
    this.transactionDetails.id = ""
    this.selectedMerchant = "";
    this.statevalue = false;
    this.transactionDetails.trainers_Name = ""
    this.merchantID = "";
    // this.pagination1 = false;
    // this.table1 = false;
    // this.pagination2 = false;
    // this.table2 = false;
    this.service.districtNameFetch(statename).subscribe(districtnamelist => {
      this.districtNamedetails = districtnamelist;
      this.districtlist = this.districtNamedetails.result;
      this.districtlist1 = this.districtlist;
      this.districtlist2 = this.districtlist;
    })
  }
  iaList(districtname: string) {
    this.districtNameSelect = districtname;
    this.iaNameSelect = "";
    this.merhcnatNameSelect = "";
    this.ialist1 = [];
    this.ialist2 = [];
    this.merchantlist2 = [];
    this.merchantlist1 = [];
    this.dataSource.data = [];
    this.isShow = false;
    this.pagination1 = false;
    this.table1 = false;
    this.pagination2 = false;
    this.table2 = false;
    this.memberdataSource.data = [];
    // this.dataSource.data = [];
    // this.memberdataSource.data = [];
    this.selectedDistrictName = districtname;
    this.selectedIaName = "";
    this.transactionDetails.id = "";
    this.selectedMerchant = "";
    this.transactionDetails.trainers_Name = ""
    this.districtvalue = false;
    // this.pagination1 = false;
    // this.table1 = false;
    // this.pagination2 = false;
    // this.table2 = false;
    this.service.getIaNameList(this.selectedStateName, districtname).subscribe(ialistfetch => {
      this.iaListDetails = ialistfetch;
      this.ialist = this.iaListDetails.result;
      //this.dataSource.data = this.ialist;
      if (this.ialist.length === 0) {
        this.message = "IA name not found";
        this.snackBar.open(this.message, '', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          // panelClass: ['blue-snackbar']
          panelClass: 'center',
        });
      }
      this.ialist1 = this.ialist;
      this.ialist2 = this.ialist;
    });
  }
  getMerchantName(ngoId: any) {
    if (typeof (ngoId) == "undefined") {
     
    }
    else {
      this.iaNameSelect = ngoId;
      this.merhcnatNameSelect = "";
      this.merchantlist2 = [];
      this.merchantlist1 = [];
      this.dataSource.data = [];
      this.isShow = false;
      this.pagination1 = false;
      this.table1 = false;
      this.pagination2 = false;
      this.table2 = false;
      this.memberdataSource.data = [];
      // this.selectedDistrictName = districtname;
      this.selectedIaName = ngoId;
      
      // this.dataSource.data = [];
      // this.memberdataSource.data = [];
      this.selectedMerchant = "";
      this.transactionDetails.trainers_Name = "";
      // this.pagination1 = false;
      // this.table1 = false;
      // this.pagination2 = false;
      // this.table2 = false;
      this.service.merchantDetails(ngoId).subscribe(merchantName => {
        this.merchantDetails = merchantName;
        this.merchantList = this.merchantDetails.result;
        if (this.merchantList.length === 0) {
          this.message = "Merchant name not found";
          this.snackBar.open(this.message, '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            // panelClass: ['blue-snackbar']
            panelClass: 'center',
          });
        }
        this.merchantlist1 = this.merchantList;
        this.merchantlist2 = this.merchantList;
      });
    }
  }
  getMerchantID(merchantID: string) {

    if(merchantID == undefined)
    {
      this.selectedMerchant = ""
    }
    else{
      this.merhcnatNameSelect = merchantID;
    this.dataSource.data = [];
    this.isShow = false;
    this.pagination1 = false;
    this.table1 = false;
    this.pagination2 = false;
    this.table2 = false;
    this.memberdataSource.data = [];
    this.selectedMerchant = ""
    this.selectedMerchant = merchantID;

    }
    
  }
  // old
  //   submit() {
  //     this.filter.reset();
  //     this.dataSource.filter = ""
  //     this.memberdataSource.filter = ""
  //     if ((this.selectedStateName == "" || this.selectedStateName == "") && 
  //    (this.selectedDistrictName == null || this.selectedDistrictName == "") && 
  //    (this.selectedIaName == null || this.selectedIaName == "") && 
  //    (this.merchantCodeValue == null || this.merchantCodeValue == "")&&
  //    (this.selectedMerchant==null||this.selectedMerchant == "")&&
  //    (this.selectedFdate == null ||this.selectedFdate == "")&&
  //    (this.selectedTodate==null || this.selectedTodate == " "))
  //   //  (this.startDate == null)&& (this.endDate == null))
  //     {
  //       // this.statevalue = true;
  //       // this.districtvalue = true;
  //       //this.iavalue = true;
  //       //this.merchantvalue = true;
  //       
  //       this.currentDateServiceType();
  //     this.currentDateMerchantWise();
  //     }
  //     else if ((this.selectedStateName == null || this.selectedStateName == "") &&
  //       (this.selectedDistrictName == null || this.selectedDistrictName == "") &&
  //       (this.selectedIaName == null || this.selectedIaName == "") &&
  //       (this.merchantCodeValue == null || this.merchantCodeValue == "") &&
  //       (this.selectedMerchant == null || this.selectedMerchant == "") &&
  //       (this.selectedFdate != null || this.selectedFdate != "") &&
  //       (this.selectedTodate != null || this.selectedTodate != ""))
  //     // (this.startDate == null) && (this.endDate == null))
  //     {
  //       if (this.selectedTodate == null || this.selectedTodate == "") {
  //         this.todateSelect();
  //       }
  //       else {
  //        
  //         this.onlyDateServiceType();
  //         // this.onlyDateMerchantWise();
  //       }
  //     }
  //     // if ((this.selectedStateName == "" || this.selectedStateName == "") && (this.selectedDistrictName == null || this.selectedDistrictName == "") && (this.selectedIaName == null || this.selectedIaName == "") && (this.merchantCodeValue == null || this.merchantCodeValue == "")) {
  //     //   // this.statevalue = true;
  //     //   // this.districtvalue = true;
  //     //   //this.iavalue = true;
  //     //   //this.merchantvalue = true;
  //     //   
  //     // }
  //     // else if ((this.selectedStateName == null || this.selectedStateName == "") && (this.merchantCodeValue == null || this.merchantCodeValue == "")) {
  //     //   // this.statevalue = false;
  //     //   // this.districtvalue = true;
  //     //   // this.iavalue = false;
  //     //   // this.merchantvalue = false;
  //     // }
  //     // else if ((this.selectedDistrictName == null || this.selectedDistrictName == "") && (this.merchantCodeValue == null || this.merchantCodeValue == "")) {
  //     //   // this.statevalue = false;
  //     //   // this.districtvalue = true;
  //     //   //this.iavalue = true;
  //     //   //this.merchantvalue = true;
  //     // }
  //     else {
  //       if ((this.selectedStateName != null || this.selectedStateName != "") &&
  //         (this.selectedDistrictName == null || this.selectedDistrictName == "") && (this.merchantCodeValue == null || this.merchantCodeValue == ""))
  //       {
  //         if ((this.selectedStateName != null || this.selectedStateName != "") &&
  //           (this.selectedFdate == null || this.selectedFdate == "") &&
  //           (this.selectedTodate == null || this.selectedTodate == "")) {
  //           
  //           this.onlyStateDateServiceType();
  //         }
  //         else if ((this.selectedStateName != null || this.selectedStateName != "") &&
  //           (this.selectedFdate != null || this.selectedFdate != "") &&
  //           (this.selectedTodate != null || this.selectedTodate != "")) {
  //           if (this.selectedTodate == null || this.selectedTodate == "") {
  //             
  //             this.todateSelect()
  //           }
  //           else {
  //           
  //             this.onlyStateDateServiceType();
  //           }
  //         }
  // //           if (this.endDate.status == "VALID") {
  // //             this.spinnerService.show();
  // //             this.convFromDate = this.datepipe.transform(this.startDate.value, 'dd/MM/yyyy');
  // //             this.convToDate = this.datepipe.transform(this.endDate.value, 'dd/MM/yyyy');
  // //             this.serviceTypeTransactionDetails.fromDate = this.convFromDate;
  // //             this.serviceTypeTransactionDetails.toDate = this.convToDate;
  // //             this.serviceTypeTransactionDetails.ngoID = ""
  // //             this.zonalFilterRequest = [];
  // //             this.zonalFilterRequest.push({ state: this.selectedStateName, district: this.selectedDistrictName })
  // //             this.serviceTypeTransactionDetails.zonalFilter = this.zonalFilterRequest
  // //             this.service.getServiceTypeStateDistrict(this.serviceTypeTransactionDetails).subscribe(service => {
  // //               this.spinnerService.hide();
  // //               this.serviceTypeStateDistrictDetails = service;
  // //               this.serviceTypeStateDistrictList = this.serviceTypeStateDistrictDetails.statement;
  // //               if (this.serviceTypeStateDistrictList == null) {
  // //                 this.pagination1 = false;
  // //                 this.table1 = false;
  // //                 // this.message = "Service type transaction record not found ";
  // //                 // this.snackBar.open(this.message, '', {
  // //                 //   horizontalPosition: 'center',
  // //                 //   verticalPosition: 'top',
  // //                 //   duration: 3000,
  // //                 //   // panelClass: ['blue-snackbar']
  // //                 //   panelClass: 'center',
  // //                 // });
  // //               }
  // //               else {
  // // this.dataSource.data=[]
  // //                 this.pagination1 = true;
  // //                 this.table1 = true;
  // //                 // this.firstmessage='Service type record retreived successfully'
  // //                 // this.snackBar.open('Data fetched successfully', '', {
  // //                 //   horizontalPosition: 'center',
  // //                 //   verticalPosition: 'top',
  // //                 //   duration: 3000,
  // //                 //   panelClass: 'center',
  // //                 // });
  // //                 this.serviceTypeStateDistrictList.forEach(amt => {
  // //                   var totalAmo = amt.Total_Amount
  // //                   var succAmo = amt.Total_SuccAmount
  // //                   var totalIncen = amt.Total_Incentive
  // //                   var numAmo: number = +totalAmo;
  // //                   var numSucc: number = +succAmo
  // //                   var numInce: number = +totalIncen
  // //                   let formatAmo = formatNumber(numAmo, 'en-US',
  // //                     '1.2');
  // //                   let formatSucc = formatNumber(numSucc, 'en-US',
  // //                     '1.2');
  // //                   let formatInc = formatNumber(numInce, 'en-US',
  // //                     '1.2');
  // //                   var wholeAmo = formatAmo.replace(/,/g, "")
  // //                   var wholeSucc = formatSucc.replace(/,/g, "")
  // //                   var wholeInce = formatInc.replace(/,/g, "")
  // //                   var deciAmo = Number(wholeAmo)
  // //                   var deciSucc = Number(wholeSucc)
  // //                   var deciIncen = Number(wholeInce)
  // //                   var convAmou = deciAmo.toLocaleString('en-IN', {
  // //                     minimumFractionDigits: 2, maximumFractionDigits: 2
  // //                   })
  // //                   var convSucc = deciSucc.toLocaleString('en-IN', {
  // //                     minimumFractionDigits: 2, maximumFractionDigits: 2
  // //                   })
  // //                   var convIncen = deciIncen.toLocaleString('en-IN', {
  // //                     minimumFractionDigits: 2, maximumFractionDigits: 2
  // //                   })
  // //                   amt.Total_Amount = convAmou
  // //                   amt.Total_SuccAmount = convSucc
  // //                   amt.Total_Incentive = convIncen
  // //                 })
  // //                 this.dataSource.data = this.serviceTypeStateDistrictList;
  // //               }
  // //               this.merchantRequestStateList1 = [];
  // //               this.merchantRequestDistrictList1 = []
  // //               this.merchantRequestStateList1.push({ state: this.selectedStateName })
  // //               this.merchantRequestDistrictList1.push({ district: this.selectedDistrictName })
  // //               this.merchantRequestDetails.state = this.merchantRequestStateList1;
  // //               this.merchantRequestDetails.district = this.merchantRequestDistrictList1;
  // //               this.merchantRequestDetails.fromDate = this.transactionDetails.fromDate;
  // //               this.merchantRequestDetails.toDate = this.transactionDetails.toDate;
  // //               this.service.getMerchantStateDistrict(this.merchantRequestDetails).subscribe(merchant => {
  // //                 this.merchantStateDistrictDetails = merchant;
  // //                 this.merchantStateDistrictList = this.merchantStateDistrictDetails.statement;
  // //                 if (this.merchantStateDistrictList == null) {
  // //                   this.pagination2 = false;
  // //                   this.table2 = false;
  // //                   // this.message = "Merchant transaction record not found";
  // //                   // this.snackBar.open(this.message, '', {
  // //                   //   horizontalPosition: 'center',
  // //                   //   verticalPosition: 'top',
  // //                   //   duration: 3000,
  // //                   //   // panelClass: ['blue-snackbar']
  // //                   //   panelClass: 'center',
  // //                   // });
  // //                 }
  // //                 else {
  // // this.memberdataSource.data=[]
  // //                   this.pagination2 = true;
  // //                   this.table2 = true;
  // //                   this.merchantStateDistrictList.forEach(amt => {
  // //                     var totalAmo = amt.Total_Value
  // //                     var succAmo = amt.Success_Value
  // //                     var totalIncen = amt.Incentive
  // //                     var numAmo: number = +totalAmo;
  // //                     var numSucc: number = +succAmo
  // //                     var numInce: number = +totalIncen
  // //                     let formatAmo = formatNumber(numAmo, 'en-US',
  // //                       '1.2');
  // //                     let formatSucc = formatNumber(numSucc, 'en-US',
  // //                       '1.2');
  // //                     let formatInc = formatNumber(numInce, 'en-US',
  // //                       '1.2');
  // //                     var wholeAmo = formatAmo.replace(/,/g, "")
  // //                     var wholeSucc = formatSucc.replace(/,/g, "")
  // //                     var wholeInce = formatInc.replace(/,/g, "")
  // //                     var deciAmo = Number(wholeAmo)
  // //                     var deciSucc = Number(wholeSucc)
  // //                     var deciIncen = Number(wholeInce)
  // //                     var convAmou = deciAmo.toLocaleString('en-IN', {
  // //                       minimumFractionDigits: 2, maximumFractionDigits: 2
  // //                     })
  // //                     var convSucc = deciSucc.toLocaleString('en-IN', {
  // //                       minimumFractionDigits: 2, maximumFractionDigits: 2
  // //                     })
  // //                     var convIncen = deciIncen.toLocaleString('en-IN', {
  // //                       minimumFractionDigits: 2, maximumFractionDigits: 2
  // //                     })
  // //                     amt.Total_Value = convAmou
  // //                     amt.Success_Value = convSucc
  // //                     amt.Incentive = convIncen
  // //                   })
  // //                   this.memberdataSource.data = this.merchantStateDistrictList;
  // //                   // this.secondmessage = "Merchant record retreived successfully";
  // //                   // this.message = "Merchant record retreived successfully";
  // //                   // this.snackBar.open(this.message, '', {
  // //                   //   horizontalPosition: 'center',
  // //                   //   verticalPosition: 'top',
  // //                   //   duration: 3000,
  // //                   //   // panelClass: ['blue-snackbar']
  // //                   //   panelClass: 'center',
  // //                   // })
  // //                 }
  // //                 if (this.serviceTypeStateDistrictList == null && this.merchantStateDistrictList == null) {
  // //                   this.snackBar.open("Record not found", '', {
  // //                     horizontalPosition: 'center',
  // //                     verticalPosition: 'top',
  // //                     duration: 3000,
  // //                     panelClass: 'center',
  // //                   })
  // //                 } else {
  // //                   // this.snackBar.open("Data fetched successfully", '', {
  // //                   //   horizontalPosition: 'center',
  // //                   //   verticalPosition: 'top',
  // //                   //   duration: 3000,
  // //                   //   panelClass: 'center',
  // //                   // })
  // //                 }
  // //               })
  // //             })
  // //           }
  // //           else {
  // //             this.endDateValid = true;
  // //           }
  //       }
  //       else if (this.selectedStateName != "" && this.selectedStateName != null && this.selectedDistrictName != "" &&
  //         this.selectedDistrictName != null && this.selectedIaName == "")
  //          {
  //           if (this.selectedDistrictName != "" && this.selectedDistrictName != null && this.selectedIaName == "")
  //            {
  //             if (this.selectedStateName != "" && this.selectedDistrictName != null && this.selectedFdate == null && this.selectedTodate == null || this.selectedFdate == "" && this.selectedTodate == "") {
  //              
  //               this.onlyStateAndDistrict();
  //             }
  //             else if (this.selectedStateName != "" && this.selectedDistrictName != null && this.selectedFdate != null && this.selectedTodate != null) {
  //               if (this.selectedTodate == null || this.selectedTodate == "") {
  //                 
  //                 this.todateSelect()
  //               }
  //               else {
  //                 
  //                 this.onlyStateAndDistrict();
  //               }
  //             }
  //             else {
  //               // this.onlyStateAndDistrict();
  //               
  //             }
  // //           if (this.endDate.status == "VALID") {
  // //             this.spinnerService.show();
  // //             this.convFromDate = this.datepipe.transform(this.startDate.value, 'dd/MM/yyyy');
  // //             this.convToDate = this.datepipe.transform(this.endDate.value, 'dd/MM/yyyy');
  // //             this.serviceTypeTransactionDetails.fromDate = this.convFromDate;
  // //             this.serviceTypeTransactionDetails.toDate = this.convToDate;
  // //             this.serviceTypeTransactionDetails.ngoID = this.selectedIaName;
  // //             this.zonalFilterRequest = [];
  // //             this.zonalFilterRequest.push({ state: this.selectedStateName, district: this.selectedDistrictName })
  // //             this.serviceTypeTransactionDetails.zonalFilter = this.zonalFilterRequest
  // //             this.service.getServiceTypeNgoId(this.serviceTypeTransactionDetails).subscribe(serviceNgoId => {
  // //               //this.dataSource.data = [];
  // //               this.serviceTypeStateDistrictDetails = serviceNgoId;
  // //               this.serviceTypeStateDistrictList = this.serviceTypeStateDistrictDetails.statement;
  // //               if (this.serviceTypeStateDistrictList == null) {
  // //                 this.pagination1 = false;
  // //                 this.table1 = false;
  // //               }
  // //               else {
  // // this.dataSource.data=[]
  // //                 this.pagination1 = true;
  // //                 this.table1 = true;
  // //                 this.serviceTypeStateDistrictList.forEach(amt => {
  // //                   var totalAmo = amt.Total_Amount
  // //                   var succAmo = amt.Total_SuccAmount
  // //                   var totalIncen = amt.Total_Incentive
  // //                   var numAmo: number = +totalAmo;
  // //                   var numSucc: number = +succAmo
  // //                   var numInce: number = +totalIncen
  // //                   let formatAmo = formatNumber(numAmo, 'en-US',
  // //                     '1.2');
  // //                   let formatSucc = formatNumber(numSucc, 'en-US',
  // //                     '1.2');
  // //                   let formatInc = formatNumber(numInce, 'en-US',
  // //                     '1.2');
  // //                   var wholeAmo = formatAmo.replace(/,/g, "")
  // //                   var wholeSucc = formatSucc.replace(/,/g, "")
  // //                   var wholeInce = formatInc.replace(/,/g, "")
  // //                   var deciAmo = Number(wholeAmo)
  // //                   var deciSucc = Number(wholeSucc)
  // //                   var deciIncen = Number(wholeInce)
  // //                   var convAmou = deciAmo.toLocaleString('en-IN', {
  // //                     minimumFractionDigits: 2, maximumFractionDigits: 2
  // //                   })
  // //                   var convSucc = deciSucc.toLocaleString('en-IN', {
  // //                     minimumFractionDigits: 2, maximumFractionDigits: 2
  // //                   })
  // //                   var convIncen = deciIncen.toLocaleString('en-IN', {
  // //                     minimumFractionDigits: 2, maximumFractionDigits: 2
  // //                   })
  // //                   amt.Total_Amount = convAmou
  // //                   amt.Total_SuccAmount = convSucc
  // //                   amt.Total_Incentive = convIncen
  // //                 })
  // //                 this.dataSource.data = this.serviceTypeStateDistrictList;
  // //               }
  // //               this.service.getMerchantByNgoId(this.transactionDetails).subscribe(merchant => {
  // //                 this.spinnerService.hide();
  // //                 // this.dataSource.data = [];
  // //                 this.merchantStateDistrictDetails = merchant;
  // //                 this.merchantStateDistrictList = this.merchantStateDistrictDetails.statement;
  // //                 if (this.merchantStateDistrictList == null) {
  // //                   this.pagination2 = false;
  // //                   this.table2 = false;
  // //                 }
  // //                 else {
  // //                   this.pagination2 = true;
  // //                   this.table2 = true;
  // //                   this.merchantStateDistrictList.forEach(amt => {
  // //                     var totalAmo = amt.Total_Value
  // //                     var succAmo = amt.Success_Value
  // //                     var totalIncen = amt.Incentive
  // //                     var numAmo: number = +totalAmo;
  // //                     var numSucc: number = +succAmo
  // //                     var numInce: number = +totalIncen
  // //                     let formatAmo = formatNumber(numAmo, 'en-US',
  // //                       '1.2');
  // //                     let formatSucc = formatNumber(numSucc, 'en-US',
  // //                       '1.2');
  // //                     let formatInc = formatNumber(numInce, 'en-US',
  // //                       '1.2');
  // //                     var wholeAmo = formatAmo.replace(/,/g, "")
  // //                     var wholeSucc = formatSucc.replace(/,/g, "")
  // //                     var wholeInce = formatInc.replace(/,/g, "")
  // //                     var deciAmo = Number(wholeAmo)
  // //                     var deciSucc = Number(wholeSucc)
  // //                     var deciIncen = Number(wholeInce)
  // //                     var convAmou = deciAmo.toLocaleString('en-IN', {
  // //                       minimumFractionDigits: 2, maximumFractionDigits: 2
  // //                     })
  // //                     var convSucc = deciSucc.toLocaleString('en-IN', {
  // //                       minimumFractionDigits: 2, maximumFractionDigits: 2
  // //                     })
  // //                     var convIncen = deciIncen.toLocaleString('en-IN', {
  // //                       minimumFractionDigits: 2, maximumFractionDigits: 2
  // //                     })
  // //                     amt.Total_Value = convAmou
  // //                     amt.Success_Value = convSucc
  // //                     amt.Incentive = convIncen
  // //                   })
  // //                 }
  // //                 if (this.serviceTypeStateDistrictList == null && this.merchantStateDistrictList== null) {
  // //                   this.snackBar.open("Record not found", '', {
  // //                     horizontalPosition: 'center',
  // //                     verticalPosition: 'top',
  // //                     duration: 3000,
  // //                     panelClass: 'center',
  // //                   })
  // //                 } else {
  // // this.memberdataSource.data=[]
  // //                   // this.snackBar.open("Data fetched successfully", '', {
  // //                   //   horizontalPosition: 'center',
  // //                   //   verticalPosition: 'top',
  // //                   //   duration: 3000,
  // //                   //   panelClass: 'center',
  // //                   // })
  // //                 }
  // //                 this.memberdataSource.data = this.merchantStateDistrictList;
  // //               })
  // //             })
  // //           }
  //           // else {
  //           //   this.endDateValid = true;
  //           // }
  //         }
  //       }
  // //       else if (this.selectedStateName != "" && this.selectedDistrictName != "" && this.selectedIaName != "" && this.selectedMerchant != "" && this.transactionDetails.merchantID != "") 
  // //       {
  // //         if (this.endDate.status == "VALID") {
  // //           this.spinnerService.show();
  // //           this.convFromDate = this.datepipe.transform(this.startDate.value, 'dd/MM/yyyy');
  // //           this.convToDate = this.datepipe.transform(this.endDate.value, 'dd/MM/yyyy');
  // //           this.serviceTypeTransactionDetails.fromDate = this.convFromDate;
  // //           this.serviceTypeTransactionDetails.toDate = this.convToDate;
  // //           this.dataSource.data = [];
  // //           this.memberdataSource.data = [];
  // //           
  // //           this.serviceTypeTransactionDetails.ngoID = this.selectedIaName;
  // //           this.serviceTypeTransactionDetails.merchantID = this.selectedMerchant;
  // //           this.zonalFilterRequest = [];
  // //           this.zonalFilterRequest.push({ state: this.selectedStateName, district: this.selectedDistrictName })
  // //           this.serviceTypeTransactionDetails.zonalFilter = this.zonalFilterRequest
  // //           
  // //           this.service.getServiceByMerchantId(this.serviceTypeTransactionDetails).subscribe(serviceMerchantId => {
  // //             this.spinnerService.hide();
  // //             this.serviceTypeStateDistrictDetails = serviceMerchantId;
  // //             this.serviceTypeStateDistrictList = this.serviceTypeStateDistrictDetails.statement;
  // //             if (this.serviceTypeStateDistrictList == null) {
  // //               this.pagination1 = false;
  // //               this.table1 = false;
  // //               this.pagination2 = false;
  // //               this.table2 = false;
  // //               this.message = "Record not found";
  // //               this.snackBar.open(this.message, '', {
  // //                 horizontalPosition: 'center',
  // //                 verticalPosition: 'top',
  // //                 duration: 3000,
  // //                 // panelClass: ['blue-snackbar']
  // //                 panelClass: 'center',
  // //               });
  // //             }
  // //             else {
  // // this.dataSource.data=[]
  // //               this.pagination1 = true;
  // //               this.table1 = true;
  // //               this.pagination2 = false;
  // //               this.table2 = false;
  // //              // this.message = "Data fetched successfully";
  // //               // this.snackBar.open(this.message, '', {
  // //               //   horizontalPosition: 'center',
  // //               //   verticalPosition: 'top',
  // //               //   duration: 3000,
  // //               //   // panelClass: ['blue-snackbar']
  // //               //   panelClass: 'center',
  // //               // });
  // //               this.serviceTypeStateDistrictList.forEach(amt => {
  // //                 var totalAmo = amt.Total_Amount
  // //                 var succAmo = amt.Total_SuccAmount
  // //                 var totalIncen = amt.Total_Incentive
  // //                 var numAmo: number = +totalAmo;
  // //                 var numSucc: number = +succAmo
  // //                 var numInce: number = +totalIncen
  // //                 let formatAmo = formatNumber(numAmo, 'en-US',
  // //                   '1.2');
  // //                 let formatSucc = formatNumber(numSucc, 'en-US',
  // //                   '1.2');
  // //                 let formatInc = formatNumber(numInce, 'en-US',
  // //                   '1.2');
  // //                 var wholeAmo = formatAmo.replace(/,/g, "")
  // //                 var wholeSucc = formatSucc.replace(/,/g, "")
  // //                 var wholeInce = formatInc.replace(/,/g, "")
  // //                 var deciAmo = Number(wholeAmo)
  // //                 var deciSucc = Number(wholeSucc)
  // //                 var deciIncen = Number(wholeInce)
  // //                 var convAmou = deciAmo.toLocaleString('en-IN', {
  // //                   minimumFractionDigits: 2, maximumFractionDigits: 2
  // //                 })
  // //                 var convSucc = deciSucc.toLocaleString('en-IN', {
  // //                   minimumFractionDigits: 2, maximumFractionDigits: 2
  // //                 })
  // //                 var convIncen = deciIncen.toLocaleString('en-IN', {
  // //                   minimumFractionDigits: 2, maximumFractionDigits: 2
  // //                 })
  // //                 amt.Total_Amount = convAmou
  // //                 amt.Total_SuccAmount = convSucc
  // //                 amt.Total_Incentive = convIncen
  // //               })
  // //             }
  // //             this.dataSource.data = this.serviceTypeStateDistrictList;
  // //           })
  // //         }
  // //         else {
  // //           this.endDateValid = true;
  // //         }
  // //       }
  // else if (this.selectedStateName != "" && this.selectedDistrictName != "" && this.selectedIaName != "" && this.selectedMerchant == "") {
  //   if (this.selectedIaName != "") {
  //     if (this.selectedStateName != "" && this.selectedDistrictName != "" && this.selectedIaName != ""
  //       && this.selectedFdate == null && this.selectedTodate == null || this.selectedFdate == "" && this.selectedTodate == "") {
  //       
  //       this.onlyStateDistrictAndIA();
  //     }
  //     else if (this.selectedStateName != "" && this.selectedDistrictName != null && this.selectedIaName != null && this.selectedFdate != null && this.selectedTodate != null) {
  //       if (this.selectedTodate == null || this.selectedTodate == "") {
  //        
  //         this.todateSelect()
  //       }
  //       else {
  //         
  //         this.onlyStateDistrictAndIA();
  //       }
  //     }
  //     else {
  //       // this.onlyStateAndDistrict();
  //       
  //     }
  //   }
  // }
  //       else if (this.merchantCodeValue != "" && this.selectedDistrictName == "" && this.selectedIaName == "" && this.selectedStateName == "" && this.selectedMerchant == "") {
  //         if (this.merchantCodeValue != null) {
  //           this.transactionMerchant.merchantID = this.merchantCodeValue;
  //           if (this.merchantCodeValueForm.valid) {
  //             this.spinnerService.show();
  //             this.service.getServiceGetMerchantId(this.transactionMerchant).subscribe(serviceMerchantId => {
  //               //this.dataSource.data = [];
  //               this.spinnerService.hide();
  //               this.serviceTypeStateDistrictDetails = serviceMerchantId;
  //               this.serviceTypeStateDistrictList = this.serviceTypeStateDistrictDetails.statement;
  //               if (this.serviceTypeStateDistrictList == null) {
  //                 this.pagination1 = false;
  //                 this.table1 = false;
  //                 this.pagination2 = false;
  //                 this.table2 = false;
  //                 this.message = "Record not found";
  //                 this.snackBar.open(this.message, '',
  //                   {
  //                     horizontalPosition: 'center',
  //                     verticalPosition: 'top',
  //                     duration: 3000,
  //                     // panelClass: ['blue-snackbar']
  //                     panelClass: 'center',
  //                   });
  //               }
  //               else {
  // this.dataSource.data=[]
  //                 this.pagination1 = true;
  //                 this.table1 = true;
  //                 this.pagination2 = false;
  //                 this.table2 = false;
  //                 // this.message = "Data fetched successfully";
  //                 // this.snackBar.open(this.message, '', {
  //                 //   horizontalPosition: 'center',
  //                 //   verticalPosition: 'top',
  //                 //   duration: 3000,
  //                 //   // panelClass: ['blue-snackbar']
  //                 //   panelClass: 'center',
  //                 // });
  //                 this.serviceTypeStateDistrictList.forEach(amt => {
  //                   var totalAmo = amt.Total_Amount
  //                   var succAmo = amt.Total_SuccAmount
  //                   var totalIncen = amt.Total_Incentive
  //                   var numAmo: number = +totalAmo;
  //                   var numSucc: number = +succAmo
  //                   var numInce: number = +totalIncen
  //                   let formatAmo = formatNumber(numAmo, 'en-US',
  //                     '1.2');
  //                   let formatSucc = formatNumber(numSucc, 'en-US',
  //                     '1.2');
  //                   let formatInc = formatNumber(numInce, 'en-US',
  //                     '1.2');
  //                   var wholeAmo = formatAmo.replace(/,/g, "")
  //                   var wholeSucc = formatSucc.replace(/,/g, "")
  //                   var wholeInce = formatInc.replace(/,/g, "")
  //                   var deciAmo = Number(wholeAmo)
  //                   var deciSucc = Number(wholeSucc)
  //                   var deciIncen = Number(wholeInce)
  //                   var convAmou = deciAmo.toLocaleString('en-IN', {
  //                     minimumFractionDigits: 2, maximumFractionDigits: 2
  //                   })
  //                   var convSucc = deciSucc.toLocaleString('en-IN', {
  //                     minimumFractionDigits: 2, maximumFractionDigits: 2
  //                   })
  //                   var convIncen = deciIncen.toLocaleString('en-IN', {
  //                     minimumFractionDigits: 2, maximumFractionDigits: 2
  //                   })
  //                   amt.Total_Amount = convAmou
  //                   amt.Total_SuccAmount = convSucc
  //                   amt.Total_Incentive = convIncen
  //                 })
  //                 this.dataSource.data = this.serviceTypeStateDistrictList;
  //               }
  //             });
  //           }
  //         }
  //       }
  //       else {
  //         
  //       }
  //     }
  //   }
  // new 
  submit() {
    // this.dataSource.data = []
    this.filter.reset();
    this.dataSource.filter = ""
    this.memberdataSource.filter = "";
    this.isCurrentDateData=false;
    this.isMerchantData=false;
    // this.selectedFdate=""
    // this.selectedTodate=""
    if ((this.selectedStateName == null || this.selectedStateName == "") &&
      (this.selectedDistrictName == null || this.selectedDistrictName == "") &&
      (this.selectedIaName == null || this.selectedIaName == "") &&
      (this.merchantCodeValue == null || this.merchantCodeValue == "") &&
      (this.selectedMerchant == null || this.selectedMerchant == "") &&
      (this.selectedFdate == null || this.selectedFdate == "") &&
      (this.selectedTodate == null || this.selectedTodate == ""))
    //  (this.startDate == null)&& (this.endDate == null))
    {
      
      this.currentDateServiceType();
      this.currentDateMerchantWise();
    }
    else if ((this.selectedStateName == null || this.selectedStateName == "") &&
      (this.selectedDistrictName == null || this.selectedDistrictName == "") &&
      (this.selectedIaName == null || this.selectedIaName == "") &&
      (this.merchantCodeValue == null || this.merchantCodeValue == "") &&
      (this.selectedMerchant == null || this.selectedMerchant == "") &&
      (this.selectedFdate != null || this.selectedFdate != "") &&
      (this.selectedTodate != null || this.selectedTodate != ""))
    // (this.startDate == null) && (this.endDate == null))
    {
      if (this.selectedTodate == null || this.selectedTodate == "") {
        this.todateSelect();
      }
      else {
        
        this.onlyDateServiceType();
        // this.onlyDateMerchantWise();
      }
    }
    // else if ((this.selectedStateName != null || this.selectedStateName != "") &&
    //   (this.selectedDistrictName == null || this.selectedDistrictName == "") &&
    //   (this.selectedIaName == null || this.selectedIaName == "") &&
    //   (this.merchantCodeValue == null || this.merchantCodeValue == "") &&
    //   (this.selectedMerchant == null || this.selectedMerchant == "") &&
    //   (this.selectedFdate != null || this.selectedFdate != "") ||
    //   (this.selectedTodate != null || this.selectedTodate != ""))
    // // (this.startDate == null) && (this.endDate == null))
    // {
    //  
    //   this.onlyStateDateServiceType();
    //   this.onlyStateDateMerchantWise();
    // }
    // if ((this.selectedStateName == "" || this.selectedStateName == "") && (this.selectedDistrictName == null || this.selectedDistrictName == "") && (this.selectedIaName == null || this.selectedIaName == "") && (this.merchantCodeValue == null || this.merchantCodeValue == "")) {
    //   // this.statevalue = true;
    //   // this.districtvalue = true;
    //   //this.iavalue = true;
    //   //this.merchantvalue = true;
    //  
    // }
    // else if ((this.selectedStateName == null || this.selectedStateName == "") && (this.merchantCodeValue == null || this.merchantCodeValue == "")) {
    //   // this.statevalue = false;
    //   // this.districtvalue = true;
    //   // this.iavalue = false;
    //   // this.merchantvalue = false;
    // }
    // else if ((this.selectedDistrictName == null || this.selectedDistrictName == "") && (this.merchantCodeValue == null || this.merchantCodeValue == "")) {
    //   // this.statevalue = false;
    //   // this.districtvalue = true;
    //   //this.iavalue = true;
    //   //this.merchantvalue = true;
    // }
    else {
      
      if ((this.selectedStateName != null || this.selectedStateName != "") &&
        (this.selectedDistrictName == null || this.selectedDistrictName == "") && (this.merchantCodeValue == null || this.merchantCodeValue == "")) {
        if ((this.selectedStateName != null || this.selectedStateName != "") &&
          (this.selectedFdate == null || this.selectedFdate == "") &&
          (this.selectedTodate == null || this.selectedTodate == "")) {
          
          this.onlyStateDateServiceType();
        }
        else if ((this.selectedStateName != null || this.selectedStateName != "") &&
          (this.selectedFdate != null || this.selectedFdate != "") &&
          (this.selectedTodate != null || this.selectedTodate != "")) {
          if (this.selectedTodate == null || this.selectedTodate == "") {
          
            this.todateSelect()
          }
          else {
          
            this.onlyStateDateServiceType();
          }
        }
      }
      else if (this.selectedStateName != "" && this.selectedStateName != null && this.selectedDistrictName != "" &&
        this.selectedDistrictName != null && this.selectedIaName == "") {
        if (this.selectedDistrictName != "" && this.selectedDistrictName != null && this.selectedIaName == "") {
          if (this.selectedStateName != "" && this.selectedDistrictName != null && this.selectedFdate == null && this.selectedTodate == null || this.selectedFdate == "" && this.selectedTodate == "") {
            
            this.onlyStateAndDistrict();
          }
          else if (this.selectedStateName != "" && this.selectedDistrictName != null && this.selectedFdate != null && this.selectedTodate != null) {
            if (this.selectedTodate == null || this.selectedTodate == "") {
             
              this.todateSelect()
            }
            else {
              
              this.onlyStateAndDistrict();
            }
          }
          else {
            
          }
        }
      }
      else if (this.selectedStateName != "" && this.selectedDistrictName != "" && this.selectedIaName != "" && this.selectedMerchant == "") {
        if (this.selectedIaName != "") {
          if (this.selectedStateName != "" && this.selectedDistrictName != "" && this.selectedIaName != ""
            && this.selectedFdate == null && this.selectedTodate == null || this.selectedFdate == "" && this.selectedTodate == "") {
            
            this.onlyStateDistrictAndIA();
          }
          else if (this.selectedStateName != "" && this.selectedDistrictName != null && this.selectedIaName != null && this.selectedFdate != null && this.selectedTodate != null) {
            if (this.selectedTodate == null || this.selectedTodate == "") {
              
              this.todateSelect()
            }
            else {
              
              this.onlyStateDistrictAndIA();
            }
          }
          else {
           
          }
        }
      }
      else if (this.selectedStateName != "" && this.selectedDistrictName != "" && this.selectedIaName != "" && this.selectedMerchant != "" && this.transactionDetails.merchantID != "") {
        if (this.selectedStateName != "" && this.selectedDistrictName != "" && this.selectedIaName != "" && this.selectedMerchant != ""
          && this.selectedFdate == null && this.selectedTodate == null || this.selectedFdate == "" && this.selectedTodate == "") {
          
          this.onlyStateDistrictIAAndMerchant();
        }
        else if (this.selectedStateName != "" && this.selectedDistrictName != null && this.selectedIaName != null && this.selectedMerchant != "" && this.selectedFdate != null && this.selectedTodate != null) {
          if (this.selectedTodate == null || this.selectedTodate == "") {
            
            this.todateSelect()
          }
          else {
            
            this.onlyStateDistrictIAAndMerchant();
          }
        }
        else {
         
        }
      }
      else if (this.selectedIaName == "" && this.selectedStateName == "" && this.selectedMerchant == "" && this.merchantCodeValue != "" && this.selectedDistrictName == "") {
        if (this.merchantCodeValue != null) {
         
          this.transactionMerchant.merchantID = this.merchantCodeValue;
          if (this.merchantCodeValueForm.valid) {
            this.spinnerService.show();
            this.service.getServiceGetMerchantId(this.transactionMerchant).subscribe(serviceMerchantId => {
              //this.dataSource.data = [];
              this.spinnerService.hide();
              this.serviceTypeStateDistrictDetails = serviceMerchantId;
              this.serviceTypeStateDistrictList = this.serviceTypeStateDistrictDetails.statement;
              if (this.serviceTypeStateDistrictList == null) {
                this.pagination1 = false;
                this.table1 = false;
                this.pagination2 = false;
                this.table2 = false;
                this.message = "Record not found";
                this.snackBar.open(this.message, '',
                  {
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                    duration: 3000,
                    // panelClass: ['blue-snackbar']
                    panelClass: 'center',
                  });
              }
              else {
                this.dataSource.data = []
                this.pagination1 = true;
                this.table1 = true;
                this.pagination2 = false;
                this.table2 = false;
                this.isMerchantData=true;
                this.isMerchantId=this.transactionMerchant.merchantID;
                // this.message = "Data fetched successfully";
                // this.snackBar.open(this.message, '', {
                //   horizontalPosition: 'center',
                //   verticalPosition: 'top',
                //   duration: 3000,
                //   // panelClass: ['blue-snackbar']
                //   panelClass: 'center',
                // });
                this.serviceTypeStateDistrictList.forEach(amt => {
                  var totalAmo = amt.Total_Amount
                  var succAmo = amt.Total_SuccAmount
                  var totalIncen = amt.Total_Incentive
                  var numAmo: number = +totalAmo;
                  var numSucc: number = +succAmo
                  var numInce: number = +totalIncen
                  let formatAmo = formatNumber(numAmo, 'en-US',
                    '1.2');
                  let formatSucc = formatNumber(numSucc, 'en-US',
                    '1.2');
                  let formatInc = formatNumber(numInce, 'en-US',
                    '1.2');
                  var wholeAmo = formatAmo.replace(/,/g, "")
                  var wholeSucc = formatSucc.replace(/,/g, "")
                  var wholeInce = formatInc.replace(/,/g, "")
                  var deciAmo = Number(wholeAmo)
                  var deciSucc = Number(wholeSucc)
                  var deciIncen = Number(wholeInce)
                  var convAmou = deciAmo.toLocaleString('en-IN', {
                    minimumFractionDigits: 2, maximumFractionDigits: 2
                  })
                  var convSucc = deciSucc.toLocaleString('en-IN', {
                    minimumFractionDigits: 2, maximumFractionDigits: 2
                  })
                  var convIncen = deciIncen.toLocaleString('en-IN', {
                    minimumFractionDigits: 2, maximumFractionDigits: 2
                  })
                  amt.Total_Amount = convAmou
                  amt.Total_SuccAmount = convSucc
                  amt.Total_Incentive = convIncen
                })
                this.dataSource.data = this.serviceTypeStateDistrictList;
              }
            });
          }
        }
      }
      else {
        
      }
    }
  }
  selectedRows(clickedRows: any) {
    if (clickedRows == "" || clickedRows == null) {
    } else {
      this.getServiceDataByMerchant(clickedRows);
    }
  }
  getServiceDataByMerchant(merchantCode: any) {

    this.isCurrentDateData=false;
    this.transactionMerchant.merchantID = merchantCode;
    this.spinnerService.show();
    this.service.getServiceGetMerchantId(this.transactionMerchant).subscribe(serviceMerchantId => {
      //this.dataSource.data = [];
      this.spinnerService.hide();
      this.serviceTypeStateDistrictDetails = serviceMerchantId;
      this.serviceTypeStateDistrictList = this.serviceTypeStateDistrictDetails.statement;
      if (this.serviceTypeStateDistrictList == null) {
        this.pagination1 = false;
        this.table1 = false;
        this.pagination2 = false;
        this.table2 = false;
        this.message = "Record not found";
        this.snackBar.open(this.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            // panelClass: ['blue-snackbar']
            panelClass: 'center',
          });
      }
      else {
        this.dataSource.data = []
        this.pagination1 = true;
        this.table1 = true;
        this.pagination2 = false;
        this.table2 = false;
        this.isMerchantData=true;
        this.isMerchantId=merchantCode;
        // this.message = "Data fetched successfully";
        // this.snackBar.open(this.message, '', {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        //   duration: 3000,
        //   // panelClass: ['blue-snackbar']
        //   panelClass: 'center',
        // });
        this.serviceTypeStateDistrictList.forEach(amt => {
          var totalAmo = amt.Total_Amount
          var succAmo = amt.Total_SuccAmount
          var totalIncen = amt.Total_Incentive
          var numAmo: number = +totalAmo;
          var numSucc: number = +succAmo
          var numInce: number = +totalIncen
          let formatAmo = formatNumber(numAmo, 'en-US',
            '1.2');
          let formatSucc = formatNumber(numSucc, 'en-US',
            '1.2');
          let formatInc = formatNumber(numInce, 'en-US',
            '1.2');
          var wholeAmo = formatAmo.replace(/,/g, "")
          var wholeSucc = formatSucc.replace(/,/g, "")
          var wholeInce = formatInc.replace(/,/g, "")
          var deciAmo = Number(wholeAmo)
          var deciSucc = Number(wholeSucc)
          var deciIncen = Number(wholeInce)
          var convAmou = deciAmo.toLocaleString('en-IN', {
            minimumFractionDigits: 2, maximumFractionDigits: 2
          })
          var convSucc = deciSucc.toLocaleString('en-IN', {
            minimumFractionDigits: 2, maximumFractionDigits: 2
          })
          var convIncen = deciIncen.toLocaleString('en-IN', {
            minimumFractionDigits: 2, maximumFractionDigits: 2
          })
          amt.Total_Amount = convAmou
          amt.Total_SuccAmount = convSucc
          amt.Total_Incentive = convIncen
        })
        this.dataSource.data = this.serviceTypeStateDistrictList;
      }
    });
  }
  isShow = false
  toggleDisplay() {
    this.isShow = true;
  }
  merchantCodeEnter(merchantEnterValue: string) {
    this.dataSource.data = [];
    this.isShow = false;
    this.pagination1 = false;
    this.table1 = false;
    this.pagination2 = false;
    this.table2 = false;
    this.memberdataSource.data = [];
    this.merchantCodeValue = merchantEnterValue;
    this.statevalue = false;
    this.districtvalue = false;
    this.pagination1 = false;
    this.table1 = false;
    this.pagination2 = false;
    this.table2 = false;
    this.selectedDistrictName = "";
    this.selectedStateName = "";
    this.selectedIaName = "";
    this.selectedMerchant = ""
    this.resetState.reset();
    this.resetDistrict.reset();
    this.resetIa.reset();
    this.resetMerchant.reset();
    this.startDate.reset();
    this.endDate.reset();
    this.monthperiod=false;
  }
  letterOnly(event: any) {
    event.target.maxLength = 30;
    var charCode = event.keyCode;
    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)
      return true;
    else
      return false;
  }
  districtTouch() {
    if (this.stateNameSelect == "") {
      this.snackBar.open("Please select state", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',
      });
    }
    else {
    }
  }
  iaTouch() {
    if (this.districtNameSelect == "") {
      this.snackBar.open("Please select district", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',
      });
    }
    else {
    }
  }
  animatorTouch() {
    if (this.iaNameSelect == "") {
      this.snackBar.open("Please select IA name", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',
      });
    }
    else {
    }
  }
  startToday = new Date();
  orgValueChange() {
    this.merchantCodeValue = "";
    this.endDateValid = false;
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
  monthDiff(dateFrom: any, dateTo: any) {
    if (dateFrom != undefined) {
      return dateTo.getMonth() - dateFrom.getMonth() +
        (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
    } else {
      return null;
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
  selectFromDate(fromdate: string) {
    this.monthperiod=true;
    this.selectedFdate = fromdate
    this.pagination1 = false;
    this.table1 = false;
    this.isShow = false;
    this.table2 = false;
    
  }
  selectToDate(todate: string) {
    this.monthperiod=true;
    this.selectedTodate = todate;
    this.pagination1 = false;
    this.table1 = false;
    this.isShow = false;
    this.table2 = false;
  }
  todateSelect() {
    // if (!this.startDate.dirty) {
    this.snackBar.open('Please select To date', '',
      {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'center',
      });
    // }
  }
  onlyDateServiceType() {

    if ((this.selectedFdate != null || this.selectedFdate != "") && (this.selectedTodate != null || this.selectedTodate != "")) {
     
      
      this.convFromDate = this.datepipe.transform(this.selectedFdate, 'dd/MM/yyyy');
      this.convToDate = this.datepipe.transform(this.selectedTodate, 'dd/MM/yyyy');
      this.currentDateTransactions.fromDate = this.convFromDate;
      this.currentDateTransactions.toDate = this.convToDate;
      this.spinnerService.show();
      
      this.service.getCurrentDateTransactionDetails(this.currentDateTransactions).subscribe(list => {
        this.spinnerService.hide();
        
        this.serviceTypeStateDistrictDetails = list;
        this.serviceTypeStateDistrictList = this.serviceTypeStateDistrictDetails.statement;
        if (this.serviceTypeStateDistrictList == null) {
          this.pagination1 = false;
          this.table1 = false;
          this.isShow = false;
          this.monthperiod=true;
          // this.message = "Service type transaction record not found ";
          // this.snackBar.open(this.message, '', {
          //   horizontalPosition: 'center',
          //   verticalPosition: 'top',
          //   duration: 3000,
          //   // panelClass: ['blue-snackbar']
          //   panelClass: 'center',
          // });
        }
        else {
          this.dataSource.data = [];

          this.pagination1 = true;
          this.table1 = true;
          this.isShow = true;
          this.monthperiod=false;
          // this.firstmessage='Service type record retreived successfully'
          // this.snackBar.open('Data fetched successfully', '', {
          //   horizontalPosition: 'center',
          //   verticalPosition: 'top',
          //   duration: 3000,
          //   panelClass: 'center',
          // });
          this.serviceTypeStateDistrictList.forEach(amt => {
            var totalAmo = amt.Total_Amount
            var succAmo = amt.Total_SuccAmount
            var totalIncen = amt.Total_Incentive
            var numAmo: number = +totalAmo;
            var numSucc: number = +succAmo
            var numInce: number = +totalIncen
            let formatAmo = formatNumber(numAmo, 'en-US',
              '1.2');
            let formatSucc = formatNumber(numSucc, 'en-US',
              '1.2');
            let formatInc = formatNumber(numInce, 'en-US',
              '1.2');
            var wholeAmo = formatAmo.replace(/,/g, "")
            var wholeSucc = formatSucc.replace(/,/g, "")
            var wholeInce = formatInc.replace(/,/g, "")
            var deciAmo = Number(wholeAmo)
            var deciSucc = Number(wholeSucc)
            var deciIncen = Number(wholeInce)
            var convAmou = deciAmo.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })
            var convSucc = deciSucc.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })
            var convIncen = deciIncen.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })
            amt.Total_Amount = convAmou
            amt.Total_SuccAmount = convSucc
            amt.Total_Incentive = convIncen
          })
          this.pagination1 = true;
          this.table1 = true;
          // this.pagination2 = true;
          // this.table2 = true;
          this.dataSource.data = this.serviceTypeStateDistrictList;
        }
        this.convFromDate = this.datepipe.transform(this.selectedFdate, 'dd/MM/yyyy');
        this.convToDate = this.datepipe.transform(this.selectedTodate, 'dd/MM/yyyy');
        this.merchantRequestStateList1 = [];
        this.merchantRequestDistrictList1 = []
        this.merchantRequestStateList1.push({ state: "" })
        this.merchantRequestDistrictList1.push({ district: "" })
        this.merchantRequestDetails.state = this.merchantRequestStateList1;
        this.merchantRequestDetails.district = this.merchantRequestDistrictList1;
        this.merchantRequestDetails.fromDate = this.convFromDate
        this.merchantRequestDetails.toDate = this.convToDate
        
       
        this.spinnerService.show();
        this.service.getCurrentDateTransactionMerchantWise(this.merchantRequestDetails).subscribe(merchant => {
          
          this.merchantStateDistrictDetails = merchant;
          this.merchantStateDistrictList = this.merchantStateDistrictDetails.statement;
          this.spinnerService.hide();
          if (this.merchantStateDistrictList == null) {
            this.pagination2 = false;
            this.table2 = false;
            this.isShow=false;

            this.monthperiod=true;


            // this.message = "Merchant transaction record not found";
            // this.snackBar.open(this.message, '', {
            //   horizontalPosition: 'center',
            //   verticalPosition: 'top',
            //   duration: 3000,
            //   // panelClass: ['blue-snackbar']
            //   panelClass: 'center',
            // });
          }
          else {

            this.memberdataSource.data=[];
            this.pagination2 = true;
            this.table2 = true;
            this.isShow=true;
            this.monthperiod=false;
            this.merchantStateDistrictList.forEach(amt => {
              var totalAmo = amt.Total_Value
              var succAmo = amt.Success_Value
              var totalIncen = amt.Incentive
              var numAmo: number = +totalAmo;
              var numSucc: number = +succAmo
              var numInce: number = +totalIncen
              let formatAmo = formatNumber(numAmo, 'en-US',
                '1.2');
              let formatSucc = formatNumber(numSucc, 'en-US',
                '1.2');
              let formatInc = formatNumber(numInce, 'en-US',
                '1.2');
              var wholeAmo = formatAmo.replace(/,/g, "")
              var wholeSucc = formatSucc.replace(/,/g, "")
              var wholeInce = formatInc.replace(/,/g, "")
              var deciAmo = Number(wholeAmo)
              var deciSucc = Number(wholeSucc)
              var deciIncen = Number(wholeInce)
              var convAmou = deciAmo.toLocaleString('en-IN', {
                minimumFractionDigits: 2, maximumFractionDigits: 2
              })
              var convSucc = deciSucc.toLocaleString('en-IN', {
                minimumFractionDigits: 2, maximumFractionDigits: 2
              })
              var convIncen = deciIncen.toLocaleString('en-IN', {
                minimumFractionDigits: 2, maximumFractionDigits: 2
              })
              amt.Total_Value = convAmou
              amt.Success_Value = convSucc
              amt.Incentive = convIncen
            })
            this.memberdataSource.data = this.merchantStateDistrictList;
            // this.secondmessage = "Merchant record retreived successfully";
            // this.message = "Merchant record retreived successfully";
            // this.snackBar.open(this.message, '', {
            //   horizontalPosition: 'center',
            //   verticalPosition: 'top',
            //   duration: 3000,
            //   // panelClass: ['blue-snackbar']
            //   panelClass: 'center',
            // })
          }
          if (this.serviceTypeStateDistrictList == null && this.merchantStateDistrictList == null) {
            this.snackBar.open("Record not found", '', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',
            })
          }
        })
      });
    }
  }
  onlyStateDateServiceType() {
    if ((this.selectedStateName != "" || this.selectedStateName != null) &&
      (this.selectedDistrictName == "" || this.selectedDistrictName == null)) {
      // if (this.selectedDistrictName != "" && this.selectedDistrictName != null && this.selectedIaName == "") {
     
      if (this.endDate.status == "VALID") {
        this.spinnerService.show();
        this.convFromDate = this.datepipe.transform(this.startDate.value, 'dd/MM/yyyy');
        this.convToDate = this.datepipe.transform(this.endDate.value, 'dd/MM/yyyy');
        this.serviceTypeTransactionDetails.fromDate = this.convFromDate;
        this.serviceTypeTransactionDetails.toDate = this.convToDate;
        // this.serviceTypeTransactionDetails.ngoID = ""
        this.zonalFilterRequest = [];
        this.zonalFilterRequest.push({ state: this.selectedStateName, district: "" })
        this.serviceTypeTransactionDetails.zonalFilter = this.zonalFilterRequest
        
        this.service.getServiceTypeStateDistrict(this.serviceTypeTransactionDetails).subscribe(service => {
         
          this.spinnerService.hide();
          this.serviceTypeStateDistrictDetails = service;
          this.serviceTypeStateDistrictList = this.serviceTypeStateDistrictDetails.statement;
          if (this.serviceTypeStateDistrictList == null) {
            this.pagination1 = false;
            this.table1 = false;
            this.monthperiod=false;
            // this.message = "Service type transaction record not found ";
            // this.snackBar.open(this.message, '', {
            //   horizontalPosition: 'center',
            //   verticalPosition: 'top',
            //   duration: 3000,
            //   // panelClass: ['blue-snackbar']
            //   panelClass: 'center',
            // });
          }
          else {
            this.dataSource.data = []
            this.pagination1 = true;
            this.table1 = true;
            this.monthperiod=false;
            // this.firstmessage='Service type record retreived successfully'
            // this.snackBar.open('Data fetched successfully', '', {
            //   horizontalPosition: 'center',
            //   verticalPosition: 'top',
            //   duration: 3000,
            //   panelClass: 'center',
            // });
            this.serviceTypeStateDistrictList.forEach(amt => {
              var totalAmo = amt.Total_Amount
              var succAmo = amt.Total_SuccAmount
              var totalIncen = amt.Total_Incentive
              var numAmo: number = +totalAmo;
              var numSucc: number = +succAmo
              var numInce: number = +totalIncen
              let formatAmo = formatNumber(numAmo, 'en-US',
                '1.2');
              let formatSucc = formatNumber(numSucc, 'en-US',
                '1.2');
              let formatInc = formatNumber(numInce, 'en-US',
                '1.2');
              var wholeAmo = formatAmo.replace(/,/g, "")
              var wholeSucc = formatSucc.replace(/,/g, "")
              var wholeInce = formatInc.replace(/,/g, "")
              var deciAmo = Number(wholeAmo)
              var deciSucc = Number(wholeSucc)
              var deciIncen = Number(wholeInce)
              var convAmou = deciAmo.toLocaleString('en-IN', {
                minimumFractionDigits: 2, maximumFractionDigits: 2
              })
              var convSucc = deciSucc.toLocaleString('en-IN', {
                minimumFractionDigits: 2, maximumFractionDigits: 2
              })
              var convIncen = deciIncen.toLocaleString('en-IN', {
                minimumFractionDigits: 2, maximumFractionDigits: 2
              })
              amt.Total_Amount = convAmou
              amt.Total_SuccAmount = convSucc
              amt.Total_Incentive = convIncen
            })
            this.dataSource.data = this.serviceTypeStateDistrictList;
          }
          this.merchantRequestStateList1 = [];
          this.merchantRequestDistrictList1 = []
          this.merchantRequestStateList1.push({ state: this.selectedStateName })
          this.merchantRequestDistrictList1.push({ district: "" })
          this.merchantRequestDetails.state = this.merchantRequestStateList1;
          this.merchantRequestDetails.district = this.merchantRequestDistrictList1;
          this.merchantRequestDetails.fromDate = this.convFromDate;
          this.merchantRequestDetails.toDate = this.convToDate;
          
          this.service.getMerchantStateDistrict(this.merchantRequestDetails).subscribe(merchant => {
          
            this.merchantStateDistrictDetails = merchant;
            this.merchantStateDistrictList = this.merchantStateDistrictDetails.statement;
            if (this.merchantStateDistrictList == null) {
              this.pagination2 = false;
              this.table2 = false;

              this.monthperiod=false;
              // this.message = "Merchant transaction record not found";
              // this.snackBar.open(this.message, '', {
              //   horizontalPosition: 'center',
              //   verticalPosition: 'top',
              //   duration: 3000,
              //   // panelClass: ['blue-snackbar']
              //   panelClass: 'center',
              // });
            }
            else {
              this.memberdataSource.data = []
              this.pagination2 = true;
              this.table2 = true;
              this.monthperiod=false;
              this.merchantStateDistrictList.forEach(amt => {
                var totalAmo = amt.Total_Value
                var succAmo = amt.Success_Value
                var totalIncen = amt.Incentive
                var numAmo: number = +totalAmo;
                var numSucc: number = +succAmo
                var numInce: number = +totalIncen
                let formatAmo = formatNumber(numAmo, 'en-US',
                  '1.2');
                let formatSucc = formatNumber(numSucc, 'en-US',
                  '1.2');
                let formatInc = formatNumber(numInce, 'en-US',
                  '1.2');
                var wholeAmo = formatAmo.replace(/,/g, "")
                var wholeSucc = formatSucc.replace(/,/g, "")
                var wholeInce = formatInc.replace(/,/g, "")
                var deciAmo = Number(wholeAmo)
                var deciSucc = Number(wholeSucc)
                var deciIncen = Number(wholeInce)
                var convAmou = deciAmo.toLocaleString('en-IN', {
                  minimumFractionDigits: 2, maximumFractionDigits: 2
                })
                var convSucc = deciSucc.toLocaleString('en-IN', {
                  minimumFractionDigits: 2, maximumFractionDigits: 2
                })
                var convIncen = deciIncen.toLocaleString('en-IN', {
                  minimumFractionDigits: 2, maximumFractionDigits: 2
                })
                amt.Total_Value = convAmou
                amt.Success_Value = convSucc
                amt.Incentive = convIncen
              })
              this.memberdataSource.data = this.merchantStateDistrictList;
              // this.secondmessage = "Merchant record retreived successfully";
              // this.message = "Merchant record retreived successfully";
              // this.snackBar.open(this.message, '', {
              //   horizontalPosition: 'center',
              //   verticalPosition: 'top',
              //   duration: 3000,
              //   // panelClass: ['blue-snackbar']
              //   panelClass: 'center',
              // })
            }
            if (this.serviceTypeStateDistrictList == null && this.merchantStateDistrictList == null) {
              this.snackBar.open("Record not found", '', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',
              })
            } else {
              // this.snackBar.open("Data fetched successfully", '', {
              //   horizontalPosition: 'center',
              //   verticalPosition: 'top',
              //   duration: 3000,
              //   panelClass: 'center',
              // })
            }
          })
        });
      }
    }
  }
  onlyStateAndDistrict() {
    this.spinnerService.show();
    this.convFromDate = this.datepipe.transform(this.startDate.value, 'dd/MM/yyyy');
    this.convToDate = this.datepipe.transform(this.endDate.value, 'dd/MM/yyyy');
    this.serviceTypeTransactionDetails.fromDate = this.convFromDate;
    this.serviceTypeTransactionDetails.toDate = this.convToDate;
    this.serviceTypeTransactionDetails.ngoID = ""
    this.zonalFilterRequest = [];
    this.zonalFilterRequest.push({ state: this.selectedStateName, district: this.selectedDistrictName })
    this.serviceTypeTransactionDetails.zonalFilter = this.zonalFilterRequest
   
    this.service.getServiceTypeStateDistrict(this.serviceTypeTransactionDetails).subscribe(service => {
      this.spinnerService.hide();
      this.serviceTypeStateDistrictDetails = service;
      this.serviceTypeStateDistrictList = this.serviceTypeStateDistrictDetails.statement;
      if (this.serviceTypeStateDistrictList == null) {
        this.pagination1 = false;
        this.table1 = false;
        this.monthperiod=false;
        // this.message = "Service type transaction record not found ";
        // this.snackBar.open(this.message, '', {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        //   duration: 3000,
        //   // panelClass: ['blue-snackbar']
        //   panelClass: 'center',
        // });
      }
      else {
        this.dataSource.data = []
        this.pagination1 = true;
        this.table1 = true;
        this.monthperiod=false;
        // this.firstmessage='Service type record retreived successfully'
        // this.snackBar.open('Data fetched successfully', '', {
        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        //   duration: 3000,
        //   panelClass: 'center',
        // });
        this.serviceTypeStateDistrictList.forEach(amt => {
          var totalAmo = amt.Total_Amount
          var succAmo = amt.Total_SuccAmount
          var totalIncen = amt.Total_Incentive
          var numAmo: number = +totalAmo;
          var numSucc: number = +succAmo
          var numInce: number = +totalIncen
          let formatAmo = formatNumber(numAmo, 'en-US',
            '1.2');
          let formatSucc = formatNumber(numSucc, 'en-US',
            '1.2');
          let formatInc = formatNumber(numInce, 'en-US',
            '1.2');
          var wholeAmo = formatAmo.replace(/,/g, "")
          var wholeSucc = formatSucc.replace(/,/g, "")
          var wholeInce = formatInc.replace(/,/g, "")
          var deciAmo = Number(wholeAmo)
          var deciSucc = Number(wholeSucc)
          var deciIncen = Number(wholeInce)
          var convAmou = deciAmo.toLocaleString('en-IN', {
            minimumFractionDigits: 2, maximumFractionDigits: 2
          })
          var convSucc = deciSucc.toLocaleString('en-IN', {
            minimumFractionDigits: 2, maximumFractionDigits: 2
          })
          var convIncen = deciIncen.toLocaleString('en-IN', {
            minimumFractionDigits: 2, maximumFractionDigits: 2
          })
          amt.Total_Amount = convAmou
          amt.Total_SuccAmount = convSucc
          amt.Total_Incentive = convIncen
        })
        this.dataSource.data = this.serviceTypeStateDistrictList;
      }
      this.merchantRequestStateList1 = [];
      this.merchantRequestDistrictList1 = []
      this.merchantRequestStateList1.push({ state: this.selectedStateName })
      this.merchantRequestDistrictList1.push({ district: this.selectedDistrictName })
      this.merchantRequestDetails.state = this.merchantRequestStateList1;
      this.merchantRequestDetails.district = this.merchantRequestDistrictList1;
      this.merchantRequestDetails.fromDate = this.transactionDetails.fromDate;
      this.merchantRequestDetails.toDate = this.transactionDetails.toDate;
      this.service.getMerchantStateDistrict(this.merchantRequestDetails).subscribe(merchant => {
        this.merchantStateDistrictDetails = merchant;
        this.merchantStateDistrictList = this.merchantStateDistrictDetails.statement;
        if (this.merchantStateDistrictList == null) {
          this.pagination2 = false;
          this.table2 = false;
          this.monthperiod=false;
          // this.message = "Merchant transaction record not found";
          // this.snackBar.open(this.message, '', {
          //   horizontalPosition: 'center',
          //   verticalPosition: 'top',
          //   duration: 3000,
          //   // panelClass: ['blue-snackbar']
          //   panelClass: 'center',
          // });
        }
        else {
          this.memberdataSource.data = []
          this.pagination2 = true;
          this.table2 = true;
          this.monthperiod=false;
          this.merchantStateDistrictList.forEach(amt => {
            var totalAmo = amt.Total_Value
            var succAmo = amt.Success_Value
            var totalIncen = amt.Incentive
            var numAmo: number = +totalAmo;
            var numSucc: number = +succAmo
            var numInce: number = +totalIncen
            let formatAmo = formatNumber(numAmo, 'en-US',
              '1.2');
            let formatSucc = formatNumber(numSucc, 'en-US',
              '1.2');
            let formatInc = formatNumber(numInce, 'en-US',
              '1.2');
            var wholeAmo = formatAmo.replace(/,/g, "")
            var wholeSucc = formatSucc.replace(/,/g, "")
            var wholeInce = formatInc.replace(/,/g, "")
            var deciAmo = Number(wholeAmo)
            var deciSucc = Number(wholeSucc)
            var deciIncen = Number(wholeInce)
            var convAmou = deciAmo.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })
            var convSucc = deciSucc.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })
            var convIncen = deciIncen.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })
            amt.Total_Value = convAmou
            amt.Success_Value = convSucc
            amt.Incentive = convIncen
          })
          this.memberdataSource.data = this.merchantStateDistrictList;
          // this.secondmessage = "Merchant record retreived successfully";
          // this.message = "Merchant record retreived successfully";
          // this.snackBar.open(this.message, '', {
          //   horizontalPosition: 'center',
          //   verticalPosition: 'top',
          //   duration: 3000,
          //   // panelClass: ['blue-snackbar']
          //   panelClass: 'center',
          // })
        }
        if (this.serviceTypeStateDistrictList == null && this.merchantStateDistrictList == null) {
          this.snackBar.open("Record not found", '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',
          })
        } else {
          // this.snackBar.open("Data fetched successfully", '', {
          //   horizontalPosition: 'center',
          //   verticalPosition: 'top',
          //   duration: 3000,
          //   panelClass: 'center',
          // })
        }
      })
    })
  }
  onlyStateDistrictAndIA() {
    if (this.selectedStateName != null && this.selectedDistrictName != null && this.selectedIaName != null && this.selectedMerchant == "") {
      this.spinnerService.show();
      this.convFromDate = this.datepipe.transform(this.startDate.value, 'dd/MM/yyyy');
      this.convToDate = this.datepipe.transform(this.endDate.value, 'dd/MM/yyyy');
      this.serviceTypeTransactionDetails.fromDate = this.convFromDate;
      this.serviceTypeTransactionDetails.toDate = this.convToDate;
      this.serviceTypeTransactionDetails.ngoID = this.selectedIaName;
      this.zonalFilterRequest = [];
      this.zonalFilterRequest.push({ state: this.selectedStateName, district: this.selectedDistrictName })
      this.serviceTypeTransactionDetails.zonalFilter = this.zonalFilterRequest
      
      this.service.getServiceTypeNgoId(this.serviceTypeTransactionDetails).subscribe(serviceNgoId => {
        
        this.serviceTypeStateDistrictDetails = serviceNgoId;
        this.serviceTypeStateDistrictList = this.serviceTypeStateDistrictDetails.statement;
        if (this.serviceTypeStateDistrictList == null) {
          this.pagination1 = false;
          this.table1 = false;
          this.monthperiod=false;
        }
        else {
          this.dataSource.data = []
          this.pagination1 = true;
          this.table1 = true;
          this.monthperiod=false;
          this.serviceTypeStateDistrictList.forEach(amt => {
            var totalAmo = amt.Total_Amount
            var succAmo = amt.Total_SuccAmount
            var totalIncen = amt.Total_Incentive
            var numAmo: number = +totalAmo;
            var numSucc: number = +succAmo
            var numInce: number = +totalIncen
            let formatAmo = formatNumber(numAmo, 'en-US',
              '1.2');
            let formatSucc = formatNumber(numSucc, 'en-US',
              '1.2');
            let formatInc = formatNumber(numInce, 'en-US',
              '1.2');
            var wholeAmo = formatAmo.replace(/,/g, "")
            var wholeSucc = formatSucc.replace(/,/g, "")
            var wholeInce = formatInc.replace(/,/g, "")
            var deciAmo = Number(wholeAmo)
            var deciSucc = Number(wholeSucc)
            var deciIncen = Number(wholeInce)
            var convAmou = deciAmo.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })
            var convSucc = deciSucc.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })
            var convIncen = deciIncen.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })
            amt.Total_Amount = convAmou
            amt.Total_SuccAmount = convSucc
            amt.Total_Incentive = convIncen
          })
          this.dataSource.data = this.serviceTypeStateDistrictList;
        }
        // this.transactionDetails.state_name = ""
        // this.transactionDetails.district_name = ""
        // this.transactionDetails.state = this.selectedStateName;
        // this.transactionDetails.district = this.selectedDistrictName
        // this.transactionDetails.ngoid = this.selectedIaName
        // this.transactionDetails.fromDate = this.convFromDate;
        // this.transactionDetails.toDate = this.convToDate;
        this.merchantWiseUsingNGOIdRequest.ngoid = this.selectedIaName;
        this.merchantWiseUsingNGOIdRequest.state = this.selectedStateName
        this.merchantWiseUsingNGOIdRequest.district = this.selectedDistrictName;
        this.merchantWiseUsingNGOIdRequest.fromDate = this.convFromDate;
        this.merchantWiseUsingNGOIdRequest.toDate = this.convToDate;
        this.merchantWiseUsingNGOIdRequest.isFullPayout = true;
        
        this.service.getMerchantByNgoId(this.merchantWiseUsingNGOIdRequest).subscribe(merchant => {
          this.spinnerService.hide();
          
          this.merchantStateDistrictDetails = merchant;
          this.merchantStateDistrictList = this.merchantStateDistrictDetails.statement;
          if (this.merchantStateDistrictList == null) {
            this.pagination2 = false;
            this.table2 = false;
            this.monthperiod=false;
          }
          else {
            this.pagination2 = true;
            this.table2 = true;
            this.monthperiod=false;
            this.merchantStateDistrictList.forEach(amt => {
              var totalAmo = amt.Total_Value
              var succAmo = amt.Success_Value
              var totalIncen = amt.Incentive
              var numAmo: number = +totalAmo;
              var numSucc: number = +succAmo
              var numInce: number = +totalIncen
              let formatAmo = formatNumber(numAmo, 'en-US',
                '1.2');
              let formatSucc = formatNumber(numSucc, 'en-US',
                '1.2');
              let formatInc = formatNumber(numInce, 'en-US',
                '1.2');
              var wholeAmo = formatAmo.replace(/,/g, "")
              var wholeSucc = formatSucc.replace(/,/g, "")
              var wholeInce = formatInc.replace(/,/g, "")
              var deciAmo = Number(wholeAmo)
              var deciSucc = Number(wholeSucc)
              var deciIncen = Number(wholeInce)
              var convAmou = deciAmo.toLocaleString('en-IN', {
                minimumFractionDigits: 2, maximumFractionDigits: 2
              })
              var convSucc = deciSucc.toLocaleString('en-IN', {
                minimumFractionDigits: 2, maximumFractionDigits: 2
              })
              var convIncen = deciIncen.toLocaleString('en-IN', {
                minimumFractionDigits: 2, maximumFractionDigits: 2
              })
              amt.Total_Value = convAmou
              amt.Success_Value = convSucc
              amt.Incentive = convIncen
            })
          }
          if (this.serviceTypeStateDistrictList == null && this.merchantStateDistrictList == null) {
            this.snackBar.open("Record not found", '', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',
            })
          } else {
            this.memberdataSource.data = []
            // this.snackBar.open("Data fetched successfully", '', {
            //   horizontalPosition: 'center',
            //   verticalPosition: 'top',
            //   duration: 3000,
            //   panelClass: 'center',
            // })
          }
          this.memberdataSource.data = this.merchantStateDistrictList;
        })
      })
    }
  }
  onlyStateDistrictIAAndMerchant() 
  {
    if (this.selectedStateName != null && this.selectedDistrictName != null && this.selectedIaName != null && this.selectedMerchant != null) {
      this.spinnerService.show();
      this.convFromDate = this.datepipe.transform(this.startDate.value, 'dd/MM/yyyy');
      this.convToDate = this.datepipe.transform(this.endDate.value, 'dd/MM/yyyy');
      this.serviceTypeTransactionDetails.fromDate = this.convFromDate;
      this.serviceTypeTransactionDetails.toDate = this.convToDate;
      this.dataSource.data = [];
      this.memberdataSource.data = [];
      this.serviceTypeTransactionDetails.ngoID = this.selectedIaName;
      this.serviceTypeTransactionDetails.merchantID = this.selectedMerchant;
      this.zonalFilterRequest = [];
      this.zonalFilterRequest.push({ state: this.selectedStateName, district: this.selectedDistrictName })
      this.serviceTypeTransactionDetails.zonalFilter = this.zonalFilterRequest
     
      this.service.getServiceByMerchantId(this.serviceTypeTransactionDetails).subscribe(serviceMerchantId => {
        this.spinnerService.hide();
        
        this.serviceTypeStateDistrictDetails = serviceMerchantId;
        this.serviceTypeStateDistrictList = this.serviceTypeStateDistrictDetails.statement;
        if (this.serviceTypeStateDistrictList == null) {
          this.pagination1 = false;
          this.table1 = false;
          this.pagination2 = false;
          this.monthperiod=false;
          this.table2 = false;
          this.isMerchantData=false;
          this.message = "Record not found";
          this.snackBar.open(this.message, '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            // panelClass: ['blue-snackbar']
            panelClass: 'center',
          });
        }
        else {
          this.dataSource.data = []
          this.pagination1 = true;
          this.table1 = true;
          this.pagination2 = false;
          this.monthperiod=false;
          this.table2 = false;
          this.isMerchantData=true;
          this.isMerchantId=this.serviceTypeTransactionDetails.merchantID;
          // this.message = "Data fetched successfully";
          // this.snackBar.open(this.message, '', {
          //   horizontalPosition: 'center',
          //   verticalPosition: 'top',
          //   duration: 3000,
          //   // panelClass: ['blue-snackbar']
          //   panelClass: 'center',
          // });
          this.serviceTypeStateDistrictList.forEach(amt => {
            var totalAmo = amt.Total_Amount
            var succAmo = amt.Total_SuccAmount
            var totalIncen = amt.Total_Incentive
            var numAmo: number = +totalAmo;
            var numSucc: number = +succAmo
            var numInce: number = +totalIncen
            let formatAmo = formatNumber(numAmo, 'en-US',
              '1.2');
            let formatSucc = formatNumber(numSucc, 'en-US',
              '1.2');
            let formatInc = formatNumber(numInce, 'en-US',
              '1.2');
            var wholeAmo = formatAmo.replace(/,/g, "")
            var wholeSucc = formatSucc.replace(/,/g, "")
            var wholeInce = formatInc.replace(/,/g, "")
            var deciAmo = Number(wholeAmo)
            var deciSucc = Number(wholeSucc)
            var deciIncen = Number(wholeInce)
            var convAmou = deciAmo.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })
            var convSucc = deciSucc.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })
            var convIncen = deciIncen.toLocaleString('en-IN', {
              minimumFractionDigits: 2, maximumFractionDigits: 2
            })
            amt.Total_Amount = convAmou
            amt.Total_SuccAmount = convSucc
            amt.Total_Incentive = convIncen
          })
        }
        this.dataSource.data = this.serviceTypeStateDistrictList;
      })
    }
  }
}