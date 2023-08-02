import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, Provider, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Route, Router } from '@angular/router';
import * as $ from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServicesService } from 'src/app/services.service';
import { State } from 'src/app/state-details';
import { StatedetailsResult } from 'src/app/statedetails-result';
import { Viewia } from 'src/app/viewia';
import { IaviewViewPopuoComponent } from '../iaview-view-popuo/iaview-view-popuo.component';
import { ViewEditPopupComponent } from '../view-edit-popup/view-edit-popup.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-ia',
  templateUrl: './view-ia.component.html',
  styleUrls: ['./view-ia.component.scss'],
  providers: [DatePipe]
})
export class ViewIaComponent implements OnInit {




  viewIa!: FormGroup;

  pagination = false;
  table = false;
  hideRequiredMarker = "true"
  statedetails: State = new State();
  selectedStateName = "";
  selectedDistrictName = "";

  payoutToggle: any;

  dateconv: any

  shgTransToggle: any;

  ngoNameToggle: any;

  ngoLogoToggle: any;

  memberNameToggle: any;

  StateName = "";
  districtname = "";


  state = false;
  district = false;
  districtNamedetails: State = new State();
  credential: StatedetailsResult = new StatedetailsResult();
  iaTableDetails: State = new State();
  districtlist: StatedetailsResult[] = [];

  districtlist1: Record<any, any>[] = this.districtlist;

  districtlist2: Record<any, any>[] = this.districtlist;



  statelist: StatedetailsResult[] = [];
  statelist1: Record<any, any>[] = this.statelist;

  statelist2: Record<any, any>[] = this.statelist;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;




  ialist: StatedetailsResult[] = [];
  @ViewChild('paginator', { static: false }) set paginatorPageSize(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = "";
      this.dataSource.paginator.selectConfig.disableOptionCentering = true;
    }
  }
  // @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<StatedetailsResult>(this.ialist);
  displayedColumns: string[] = ['name_of_SHPI', 'reg_Date', 'reg_No', 'state_Name', 'district_Name', 'name_of_CEO', 'conNo_CEO', 'actions'];
  constructor(private datepipe: DatePipe, private rou: Router, private cdref: ChangeDetectorRef, private service: ServicesService, private dialog: MatDialog, private spinnerService: NgxSpinnerService, private snackBar: MatSnackBar) {



  }
  submitted = false;

  ngOnInit() {
    this.getStateDetailsList()
  }
  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }

  private sort!: MatSort;


  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.dataSource.sort = this.sort;
  }





  getStateDetailsList() {
    this.service.getStateService().subscribe(statelist => {
    
      this.statedetails = statelist;
      
      this.statelist = this.statedetails.result;

      this.statelist1 = this.statelist
      this.statelist2 = this.statelist


    })
  }
  AddnewShow() {
    this.rou.navigate(['Admin/ia/creation'])
  }
  submit() {

    this.filter.reset();
    this.dataSource.filter = " "
    if ((this.selectedStateName == null || this.selectedStateName == "") && (this.selectedDistrictName == null || this.selectedDistrictName == "")) {
      this.state = true;
      this.district = true;
    }
    else {
      if (this.selectedStateName == "" || this.selectedStateName == null) {
        this.state = true;
        this.district = false;
        // dont call 
      }
      else if (this.selectedDistrictName == "" || this.selectedDistrictName == null) {
        this.state = false;
        this.district = true;
        this.credential.district_name = "";
      }
      else {

        this.spinnerService.show();
        this.service.iaList(this.selectedStateName, this.selectedDistrictName).subscribe(ialistfetch => {


          this.spinnerService.hide();


          

          if (ialistfetch.result.length == 0) {

            this.dataSource.data = [];
            this.pagination = false;
            this.table = false;

            this.snackBar.open('Record not found', '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',
              }
            )


          }

          else {
            // this.dataSource.data = [];











            this.pagination = true;
            this.table = true;
            this.iaTableDetails = ialistfetch;

            for (let i = 0; i < this.iaTableDetails.result.length; i++) {

              const d = this.iaTableDetails.result[i];

              
              const m = d.reg_Date.split("/");

              this.iaTableDetails.result[i].reg_Date = m[1] + "/" + m[0] + "/" + m[2];

              // this.iaTableDetails.result[i].reg_Date="";

              //this.iaTableDetails.result[i].reg_Date;
              //this.iaTableDetails.result[0].reg_Date=y;



            }






           












            this.ialist = this.iaTableDetails.result;






            this.dataSource.data = this.ialist;
            // this.snackBar.open('Data fetched successfully', '',
            //   {
            //     horizontalPosition: 'center',
            //     verticalPosition: 'top',
            //     duration: 3000,
            //     panelClass: 'center',
            //   }
            // )


          }








        })
      }
    }
  }
  // selected state name 
  stateName(statename: string) {

    this.selectedStateName = statename;
    this.selectedDistrictName = "";

    this.dataSource.data = [];
    this.pagination = false;
    this.table = false;
    this.credential.district_name = " ";


    this.service.districtNameFetch(statename).subscribe(districtnamelist => {
      this.districtNamedetails = districtnamelist;
      this.districtlist = this.districtNamedetails.result;

      this.districtlist1 = this.districtlist
      this.districtlist2 = this.districtlist

    })
  }
  // IA details 
  districtName(districtname: string) {
    this.selectedDistrictName = districtname;
    this.dataSource.data = [];
    this.pagination = false;
    this.table = false;
  }

  i!: number;
  // view pop up


  startView(i: number, id: number, category: string, reg_No: string, reg_Date: string, address: string, name_of_Secretary: string, name_of_MIS_Operator: string, conNo_MIS_Operator: string, email_ID1_SHPI: string, email_ID2_SHPI: string, ngO_Payout_Flag: string, shG_Trans_Com: string, ngO_Name_Flag
    : string, ngO_Logo_Flag: string, ngO_Member_Flag: string) {
    const dialogRef = this.dialog.open(IaviewViewPopuoComponent, {

      width: '375px',
      autoFocus: false,

      data: {
        id: id, category: category, reg_No: reg_No, reg_Date: reg_Date, address: address, name_of_Secretary: name_of_Secretary, name_of_MIS_Operator: name_of_MIS_Operator, conNo_MIS_Operator: conNo_MIS_Operator, email_ID1_SHPI: email_ID1_SHPI, email_ID2_SHPI: email_ID2_SHPI, ngO_Payout_Flag: ngO_Payout_Flag, shG_Trans_Com: shG_Trans_Com, ngO_Name_Flag
          : ngO_Name_Flag, ngO_Logo_Flag: ngO_Logo_Flag, ngO_Member_Flag: ngO_Member_Flag
      }
    });
  }

  // startView(i: number, id: number, name_of_SHPI: string, state_Name: string, district_Name: string, name_of_CEO: string, conNo_CEO: string) {
  //   const dialogRef = this.dialog.open(IaviewViewPopuoComponent, {

  //     width: '355px',
  //     autoFocus:false,

  //     data: { id: id, name_of_SHPI: name_of_SHPI, state_Name: state_Name, district_Name: district_Name, name_of_CEO: name_of_CEO, conNo_CEO: conNo_CEO }
  //   });
  // }



  update() {

    this.spinnerService.show();
    this.service.iaList(this.selectedStateName, this.selectedDistrictName).subscribe(ialistfetch => {

      this.spinnerService.hide();

      this.pagination = true;


      this.table = true;

      this.iaTableDetails = ialistfetch;

      for (let i = 0; i < this.iaTableDetails.result.length; i++) {

        const d = this.iaTableDetails.result[i];

        
        const m = d.reg_Date.split("/");

        this.iaTableDetails.result[i].reg_Date = m[1] + "/" + m[0] + "/" + m[2];

        // this.iaTableDetails.result[i].reg_Date="";

        //this.iaTableDetails.result[i].reg_Date;
        //this.iaTableDetails.result[0].reg_Date=y;



      }

      this.ialist = this.iaTableDetails.result;
      this.dataSource.data = this.ialist;









    })



  }


  // startEdit(i: number, id: number, name_of_SHPI: string, state_Name: string, district_Name: string, name_of_CEO: string, conNo_CEO: string) {
  //   const dialogRef = this.dialog.open(ViewEditPopupComponent, {
  //     height: '543px',
  //     width: '350px',
  //     autoFocus: false,

  //     data: { id: id, name_of_SHPI: name_of_SHPI, state_Name: state_Name, district_Name: district_Name, name_of_CEO: name_of_CEO, conNo_CEO: conNo_CEO }
  //   }).afterClosed().subscribe(res => {
  //     this.update();
  //   })
  // }

  startEdit(i: number, id: number, name_of_SHPI: string, category: string, reg_No: string, reg_Date: string, address: string, name_of_CEO: string, conNo_CEO: string, name_of_Secretary: string, name_of_MIS_Operator: string, conNo_MIS_Operator: string, email_ID1_SHPI: string, email_ID2_SHPI: string, ngO_Payout_Flag: string, shG_Trans_Com: string, ngO_Name_Flag
    : string, ngO_Logo_Flag: string, ngO_Member_Flag: string) {
    if (ngO_Payout_Flag == "Yes") {
      this.payoutToggle = true;

    }
    else {
      this.payoutToggle = false;
    }

    if (shG_Trans_Com == "Yes") {
      this.shgTransToggle = true;
    }
    else {
      this.shgTransToggle = false;
    }

    if (ngO_Name_Flag == "Yes") {
      this.ngoNameToggle = true;
    }
    else {
      this.ngoNameToggle = false;
    }

    if (ngO_Logo_Flag == "Yes") {

      this.ngoLogoToggle = true;
    }
    else {
      this.ngoLogoToggle = false;
    }

    if (ngO_Member_Flag == "Yes") {
      this.memberNameToggle = true;
    }
    else {
      this.memberNameToggle = false;
    }
    


    const m = reg_Date.split("/");

    reg_Date = m[1] + "/" + m[0] + "/" + m[2];

    const dialogRef = this.dialog.open(ViewEditPopupComponent, {
      height: '563px',
      width: '767px',
      autoFocus: false,


      data: {
        id: id, name_of_SHPI: name_of_SHPI, category: category, reg_No: reg_No, reg_Date: reg_Date, address: address, name_of_CEO: name_of_CEO, conNo_CEO: conNo_CEO, name_of_Secretary: name_of_Secretary, name_of_MIS_Operator: name_of_MIS_Operator, conNo_MIS_Operator: conNo_MIS_Operator, email_ID1_SHPI: email_ID1_SHPI, email_ID2_SHPI: email_ID2_SHPI, ngO_Payout_Flag: this.payoutToggle, shG_Trans_Com: this.shgTransToggle, ngO_Name_Flag
          : this.ngoNameToggle, ngO_Logo_Flag: this.ngoLogoToggle, ngO_Member_Flag: this.memberNameToggle
      }
    }).afterClosed().subscribe(res => {
      this.update();
    })
  }



  onlyNumberKey(event: any) {


    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
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
    if (this.selectedStateName == "") {
      this.snackBar.open("Please select state", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',
      });
    } else {
    }

  }


  filter = new FormControl();

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

    if (evt.key == arrowRight || evt.key == arrowLeft || evt.key == del) {
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