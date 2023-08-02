import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, Provider, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmDialogComponentComponent } from '../confirm-dialog-component/confirm-dialog-component.component';

import { ServiceType } from 'src/app/service-type';
import { ServiceTypeResponse } from 'src/app/service-type-response';
import { ViewTicketsList } from 'src/app/view-tickets-list';


import { ServicesService } from 'src/app/services.service';
import { ViewTickets } from 'src/app/view-tickets';
import { ViewTicketsTable } from 'src/app/view-tickets-table';
import { PopUpComponentComponent } from '../pop-up-component/pop-up-component.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EncryptAndDecryptResponse } from 'src/app/encrypt-and-decrypt-response';
import { EncryptionDTO } from 'src/app/encryption-dto';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';
import { EncryptKey } from 'src/app/encrypt-key';






@Component({
  selector: 'app-view-tickets',
  templateUrl: './view-tickets.component.html',
  styleUrls: ['./view-tickets.component.scss'],
  providers: [DatePipe]
})


export class ViewTicketsComponent implements OnInit {


  today = new Date();
  ticketStatus: any





  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();
  encryptAndDecryptResposne: EncryptAndDecryptResponse = new EncryptAndDecryptResponse();


  signInNavResponse: SignInNavResponse = new SignInNavResponse();

  encryptDTO: EncryptionDTO = new EncryptionDTO();

  searchfilter = false;

  @ViewChild('paginator', { static: false }) set paginatorPageSize(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = " ";
    }
  }
  viewTickets: ViewTickets = new ViewTickets();


  bothValue!: string;

  viewTicketsList!: ViewTicketsList[];

  displayedColumns: string[] = ['state', 'district', 'ia', 'merchantCode', 'merchantName', 'serviceType', 'issue',
    'requestedTimestamp', 'status', 'closedBy', 'actions'];

  startDate = new FormControl();
  endDate = new FormControl();
  hideRequiredMarker = "true"

  private sort!: MatSort;

  comment!: any;

  encryptKeyValue!: string;


  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.dataSource.sort = this.sort;
  }

  dataSource = new MatTableDataSource<ViewTicketsList>(this.viewTicketsList);

  constructor(private router: Router, private cdref: ChangeDetectorRef, private datepipe: DatePipe, private formBuilder: FormBuilder,
    private dateAdapter: DateAdapter<Date>, public dialog: MatDialog, private snackBar: MatSnackBar,
    private ticketService: ServicesService, private spinnerService: NgxSpinnerService) {
    this.dateAdapter.setLocale('en-GB');

    this.today.setDate(this.today.getDate());

    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');


  }
  isShow = false



  disToDate!: boolean;

  //on init
  serviceType!: ServiceType
  serviceList: ServiceTypeResponse[] = [];

  servicelist1: Record<any, any>[] = this.serviceList;
  servicelist2: Record<any, any>[] = this.serviceList;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;
  notes = true;

  ngOnInit(): void {
    this.getKey();








  }

  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }

  response: ViewTicketsTable = new ViewTicketsTable();
  convFromDate: any
  convToDate: any



  service = new FormControl();
  status = new FormControl();
  merchantCode = new FormControl();
  ticket = new FormControl();

  endDateValue!: boolean

  startToday = new Date();


  orgValueChange() {

     this.notes = true;
    this.endDateValue = false;
    if (this.startDate.dirty) {
      this.disToDate = false
      this.isShow = false;
      this.dataSource.data = [];

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

  viewTicketsRequest() {


    if (this.endDate.invalid) {
      this.endDateValue = true
    }
    else if (this.ticket.invalid || this.merchantCode.invalid) {
      
    }
    else {
      //date conversion

      this.convFromDate = this.datepipe.transform(this.startDate.value, 'yyyy-MM-dd');
      this.convToDate = this.datepipe.transform(this.endDate.value, 'yyyy-MM-dd');

      this.viewTickets.fromDate = this.convFromDate
      this.viewTickets.toDate = this.convToDate

      if (typeof (this.viewTickets.fromDate) == 'object') {

       

        this.fetchValue();
      }
      else {
        // from date selected 

        if (typeof (this.viewTickets.toDate) == 'object') {

          // todate mandatory 

         

          this.snackBar.open("Please select To date", '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',


            });

        }
        else {
          // all ok 
          
          this.fetchValue();
        }
      }

    }


  }

  onSelect(serviceId: number) {

    this.notes = true;

    this.viewTickets.serviceTypeId = serviceId;
    this.isShow = false;
    this.dataSource.data = [];

  }



  //get selected rows

  tickets: ViewTicketsList = new ViewTicketsList();
  selectedRow(clicked: any) {
    this.tickets = clicked
  }

  //close ticket
  closeTicket(id: string) {


    const uservalue = id.trim() + "," + this.signInNavResponse.responseContent.username;


    var encryptData = this.encryptAndDecrypt.encryptfinal(uservalue, this.encryptKeyValue);

    this.spinnerService.show();
    this.ticketService.closeTicket(encryptData).subscribe(data => {



      const decryptData = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptKeyValue);


      this.encryptAndDecryptResposne = JSON.parse(decryptData);

      this.spinnerService.hide();
      if (this.encryptAndDecryptResposne.statusCode == 409) {
        this.snackBar.open("Ticket ID not present or already closed", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });

      }

      else {


        var encryptData = this.encryptAndDecrypt.encryptfinal(this.viewTickets, this.encryptKeyValue);

        this.encryptDTO.data = encryptData;

        this.ticketService.viewTickets(this.encryptDTO).subscribe(data => {


          var decryptData = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptKeyValue);

          const ticketResposne = JSON.parse(decryptData);


          this.spinnerService.hide();
          

          this.response = ticketResposne

          this.viewTicketsList = this.response.responseContent
          this.searchfilter = true;
          this.isShow = true
          this.dataSource.data = this.viewTicketsList;
          this.snackBar.open(this.encryptAndDecryptResposne.message, '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',


            });



        });
      }
    });
  }

  toggleDisplay() {
    this.isShow = true;
  }




  //comment dialog
  openAddFileDialog(): void {

    const dialogRef = this.dialog.open(PopUpComponentComponent, {
      width: '400px',
      height: '264px',
      autoFocus: false,
      // panelClass: "dialog-responsive",
      data: { comment: this.comment }

    });

    dialogRef.afterClosed().subscribe(result => {

      
      this.comment = result;
      this.updateComment()
    });
  }

  //close dialog
  openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponentComponent, {
      width: '400px',
      autoFocus: false,
      data: {
        message: 'Are you sure want to close ticket ?'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.closeTicket(this.tickets.ticketId)
      }
      else {
        this.spinnerService.hide();
      }
    });
  }

  //update comment
  updateComment() {

    this.spinnerService.show();




    //const encodevalue = encodeURIComponent(encryptData);
    if (this.comment != undefined) {

      const ticketDetails = this.comment.trim() + "," + this.tickets.ticketId.trim();
      
      const encryptData = this.encryptAndDecrypt.encryptfinal(ticketDetails, this.encryptKeyValue);
      
      this.ticketService.addComment(encryptData).subscribe(data => {

        this.spinnerService.hide();

        this.comment = "";


        const decryptData = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptKeyValue);


        this.encryptAndDecryptResposne = JSON.parse(decryptData);
        this.snackBar.open(this.encryptAndDecryptResposne.message, '', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'center',
        });

      });
    }

    else {
      this.spinnerService.hide();
      
    }


  }




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  letterOnly(event: any) {
    event.target.maxLength = 30;

    var charCode = event.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)

      return true;
    else
      return false;
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


  todayEnter() {
    this.isShow = false;
    this.dataSource.data = [];
    this.notes = true;

  }



  statusOpen() {
    this.isShow = false;
    this.dataSource.data = [];
    this.notes = true;
  }

  ticketIdenter() {
    //this.isShow = false;
    //this.dataSource.data = [];
    this.notes = true;
  }
  merchantCodeEnter() {
    //this.isShow = false;
    //this.dataSource.data = [];
    this.notes = true;
  }


  getKey() {



    this.ticketService.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;
      const keyValue1 = keys.split("//");
      const firstDecrypt = this.encryptAndDecrypt.decryptfinal(keyValue1[1].trim(), keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      const finalkeyValue1 = finalkeyValue;

      this.encryptKeyValue = finalkeyValue1[0].trim();

      if (this.encryptKeyValue != "" || this.encryptKeyValue != null) {
        this.getValue();
      }
    });





  }

  getValue() {
    this.disToDate = true;

    this.notes = true;



    this.ticketService.getServiceList().subscribe(data => {


      

      var decryptData = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptKeyValue);


      this.serviceType = JSON.parse(decryptData);

      this.serviceList = this.serviceType.responseContent
      this.servicelist1 = this.serviceList;
      this.servicelist2 = this.serviceList;

    }
    );
  }

  fetchValue() {

    this.spinnerService.show();
    //this.viewTickets.ticketId.toUpperCase();
    if (this.ticketStatus === "undefined") {
      this.viewTickets.status = this.bothValue;
    } else {
      this.viewTickets.status = this.ticketStatus
    }

    if (this.viewTickets.merchantCode == null || this.viewTickets.merchantCode == "") {
      this.viewTickets.merchantCode = undefined
    }
    else {

      const merchantID = this.viewTickets.merchantCode.toUpperCase();

      this.viewTickets.merchantCode = merchantID.trim();
    }

    if (this.viewTickets.ticketId == null || this.viewTickets.ticketId == "") {
      this.viewTickets.ticketId = undefined
    }
    else {

      const ticketId = this.viewTickets.ticketId.toUpperCase();
      this.viewTickets.ticketId = ticketId.trim();


    }

    
    var encryptData = this.encryptAndDecrypt.encryptfinal(this.viewTickets, this.encryptKeyValue);

    this.encryptDTO.data = encryptData;

    //var dec = this.encryptAndDecrypt.decryptfinal(this.encryptDTO.data, this.encryptandDecryptkey);

    this.ticketService.viewTickets(this.encryptDTO).subscribe(data => {

      var decryptData = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptKeyValue);






      const ticketResposne = JSON.parse(decryptData);


      this.spinnerService.hide();
      if (ticketResposne != null) {
        this.dataSource.data = []
        this.response = ticketResposne



        

        if (this.viewTickets.toDate == "" || this.viewTickets.toDate == null) {
          this.notes = true;

        }
        else
        {
          this.notes = false;

        }
        // this.snackBar.open("Data fetched successfully", '',
        //   {
        //     horizontalPosition: 'center',
        //     verticalPosition: 'top',
        //     duration: 3000,
        //     panelClass: 'center',

        //   });
        this.viewTicketsList = this.response.responseContent
        // this.service.reset()
        // this.service.setErrors(null)
        // this.status.reset()
        // this.status.setErrors(null)
        // this.merchantCode.reset()
        // this.merchantCode.setErrors(null)
        // this.ticket.reset()
        // this.ticket.setErrors(null)
        // this.startDate.reset()
        // this.startDate.setErrors(null)
        // this.endDate.reset()
        // this.endDate.setErrors(null)
        if (this.response.statusCode == 409) {
          this.isShow = false;

          this.notes = true;
          this.dataSource.data = [];
          // alert("No value present")
          this.snackBar.open('Record not found', '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',
          });
        }
        else {
          // this.snackBar.open("Data fetched successfully", '',
          //   {
          //     horizontalPosition: 'center',
          //     verticalPosition: 'top',
          //     duration: 3000,
          //     panelClass: 'center',
          //   });

          if (this.viewTickets.toDate == "" || this.viewTickets.toDate == null) {
            this.notes = true;

           
  
          }
          else
          {
            this.notes = false;
         

          }

         
          this.searchfilter = true;
          this.isShow = true
          this.dataSource.data = this.viewTicketsList;
          // this.dataSource=new MatTableDataSource(this.viewTicketsList)
          // this.dataSource.sort = this.sort;

        }
      }
    }
    )
  }
}