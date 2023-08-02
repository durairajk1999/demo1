import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ServicesService } from 'src/app/services.service';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';
import { NotificationPopupComponentComponent } from '../notification-popup-component/notification-popup-component.component'; 
import { FTBeneficiaryDetailsDTO } from '../notify-component/FTBeneficiaryDetailsDTO';
import { ResponseBene } from '../notify-component/ResponseBene';
import { StatusUpdateRequest } from '../notify-component/StatusUpdateRequest';
import { PopUpComponentComponent } from '../pop-up-component/pop-up-component.component';
import { DatePipe } from '@angular/common';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-notification-component',
  templateUrl: './notification-component.component.html',
  styleUrls: ['./notification-component.component.scss'],
  providers:[DatePipe]
})
export class NotificationComponentComponent implements OnInit {

  userid:any;

  dateconv!:any

  addressValue:any;
  
  debitAccountNoValue:any;
  
  beneficiaryAccountNoValue:any;
  
  beneficiaryIFSCValue:any;
  
  beneficiaryNameValue:any;
  
  maxLimitValue:any;
  
  statusValue:any;
  
  transferTypeValue:any;
  
  bankNameValue:any;
  
  branchNameValue:any;
  
  shortNameValue:any;
  
  show!:boolean
  comment!: any;
  
  groupNameSearch = new FormControl();
  
  
  
    signInNavResponse: SignInNavResponse = new SignInNavResponse();
    request : StatusUpdateRequest = new  StatusUpdateRequest();
    responseBene:ResponseBene = new ResponseBene();
    details:FTBeneficiaryDetailsDTO[]=[];  
  
    displayedColumns: string[] = ['createdDate' ,'userName','addressLine', 'debitAccountNumber', 'beneficiaryAccountNumber', 'beneficiaryIFSC', 'beneficiaryName','maxLimit','beneficiaryStatus','transferType','bankName','branchName','shortName','actions'];
  
    constructor(private datePipe: DatePipe,public dialog: MatDialog,private cdref: ChangeDetectorRef,private service : ServicesService,private snackBar:MatSnackBar,private route:Router) { }
  
    dataSource = new MatTableDataSource<FTBeneficiaryDetailsDTO>(this.details);
  
    
  
  @ViewChild('paginator', { static: false }) set paginatorPageSize(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = "";
      this.dataSource.paginator.selectConfig.disableOptionCentering = true;
    }
  }


  private sort!: MatSort;
  private sort2!: MatSort;


  @ViewChild('firstTableSort') set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  
  setDataSourceAttributes() {
    this.dataSource.sort = this.sort;
   
  }
    ngOnInit(): void {
  
      this.show = true;
  
      
  
      
  
      
  
      this.service.beneficiaryGet().subscribe(data=>{
  

       
        this.responseBene = data;

        var datePipe = new DatePipe("en-US");
  
        this.responseBene.responseContent.forEach(dte => {
          var dat = dte.createdDate
          // var numdate: number = +date;
         
          // this.dateconv = datePipe.transform(dat, 'MM/dd/yyyy hh:mm:ss a');
          let myDate = dat.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")
          this.dateconv = this.datePipe.transform(myDate, 'dd/MM/yyyy hh:mm:ss a', 'es-ES');
          dte.createdDate = this.dateconv;


        })
        
          this.dataSource.data = this.responseBene.responseContent
        
        
  
  
        
  
       
  
        // this.addressValue = this.responseBene.responseContent.addressLine;
        // this.debitAccountNoValue = this.responseBene.responseContent.debitAccountNumber;
        // this.beneficiaryAccountNoValue = this.responseBene.responseContent.beneficiaryAccountNumber;
        // this.beneficiaryIFSCValue = this.responseBene.responseContent.beneficiaryIFSC;
        // this.beneficiaryNameValue = this.responseBene.responseContent.beneficiaryName;
        // this.maxLimitValue = this.responseBene.responseContent.maxLimit;
        // this.statusValue = this.responseBene.responseContent.beneficiaryStatus;
        // this.transferTypeValue = this.responseBene.responseContent.transferType;
        // this.bankNameValue = this.responseBene.responseContent.bankName;
        // this.branchNameValue = this.responseBene.responseContent.branchName;
        // this.shortNameValue = this.responseBene.responseContent.shortName;
  
  
  
       
       
  
        
  
       
  
  
  
      }
        )
    }
    
    ngAfterContentChecked() {
      
      this.cdref.detectChanges();
   }
   approve(status:any,userId:any,accountNo:any) 
  
    {
  
     {
  
      status = 'true'
        const dialogRef = this.dialog.open(NotificationPopupComponentComponent, {
          width: '400px',
          data: {
            message: 'Are you sure want to approve ?',
            user:userId,
            accountNumber:accountNo,
            statusValue :status
            
          }
    
        });
    
        dialogRef.afterClosed().subscribe(result => {
          this.comment = result;
          
        });
      }
    }
  
  
  
  
  
  // this.request.approvedBy = this.signInNavResponse.responseContent.username;
  // this.request.status = "Approved";
  // this.request.modifiedBy = this.signInNavResponse.responseContent.id;
  // this.request.userId=this.userid;
  // // this.request.beneficiaryAccountNumber =this.responseBene.responseContent.beneficiaryAccountNumber;
  
  
  //     this.service.statusUpdate(this.request).subscribe(data=>
  //       {
  //       
  
  //         if(data.statusCode == 200)
  //         {
  //           this.snackBar.open(data.message, '',
  //             {
  //               horizontalPosition: 'center',
  //               verticalPosition: 'top',
  //               duration: 3000,
  //               panelClass: 'center',
  
  
  //             });
  //             this.reloadCurrentRoute();
  //             // this.dialogRef.close();
              
  
  //         }
  //         else {
  
  //           this.snackBar.open(data.message, '',
  //             {
  //               horizontalPosition: 'center',
  //               verticalPosition: 'top',
  //               duration: 3000,
  //               panelClass: 'center',
  
  
  //             });
  //             this.reloadCurrentRoute();
  //             // this.dialogRef.close();
  
  //         }
  //       })
  
      
  //   }
  
    reject(status:any,userId:any,accountNo:any) {
  
      {
  
        {
          status = 'false';
     
           const dialogRef = this.dialog.open(NotificationPopupComponentComponent, {
             width: '400px',
             data: {
               message: 'Are you sure want to reject ?',
               user:userId,
            accountNumber:accountNo,
            statusValue:status
            
             }
       
           });
       
           
         }
       }
  
       
      }
  
  
  
  
     
  
  //     this.request.approvedBy = this.signInNavResponse.responseContent.username;
  // this.request.status = "Rejected";
  // this.request.modifiedBy = this.signInNavResponse.responseContent.id;
  // this.request.userId=this.userid;
  // // this.request.beneficiaryAccountNumber =this.responseBene.responseContent.beneficiaryAccountNumber;
  
  //     this.service.statusUpdate(this.request).subscribe(data=>{
  //       
  //       if(data.statusCode == 200)
  //         {
  //           this.snackBar.open(data.message, '',
  //             {
  //               horizontalPosition: 'center',
  //               verticalPosition: 'top',
  //               duration: 3000,
  //               panelClass: 'center',
  
  
  //             });
  //             this.reloadCurrentRoute();
  //             // this.dialogRef.close();
  
  //         }
  //         else {
  
  //           this.snackBar.open(data.message, '',
  //             {
  //               horizontalPosition: 'center',
  //               verticalPosition: 'top',
  //               duration: 3000,
  //               panelClass: 'center',
  
  
  //             });
  //             this.reloadCurrentRoute();
  //             // this.dialogRef.close();
  
  //         }
  
  //     })
    
    
  
  
  
    reloadCurrentRoute() {
      let currentUrl = this.route.url;
      this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.route.navigate([currentUrl]);
      });
    }
    isAlfa(evt: any) {
   
  
      evt = (evt || window.event);
      var charCode = (evt.which || evt.keyCode);
      var del='Delete'
  
      var arrowLeft = 'ArrowLeft'
      var arrowRight = 'ArrowRight'
      var arrow : any
  
      if (evt.key == arrowRight || evt.key == arrowLeft || evt.key == del || evt.key == '/' || evt.key == '@' || evt.key == ':' || evt.key == '.') {
        arrow = false;
  
      }
      
      
      else {
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
  
  
  
    handleInput(event: any) {
      if (event.target.selectionEnd === 0 && event.code === 'Space') {
        event.preventDefault();
      }
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
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  
  }
