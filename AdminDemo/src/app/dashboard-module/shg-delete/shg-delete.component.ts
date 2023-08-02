import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Deleteshg } from 'src/app/deleteshg';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { ServicesService } from 'src/app/services.service';
import { ShgDetailsRequest } from 'src/app/shg-details-request';
import { ShgDetailsResponse } from 'src/app/shg-details-response';
import { state } from 'src/app/State';
import { State } from 'src/app/state-details';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { StatedetailsResult } from 'src/app/statedetails-result';
import { LogoutpopupComponent } from '../logoutpopup/logoutpopup.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-shg-delete',
  templateUrl: './shg-delete.component.html',
  styleUrls: ['./shg-delete.component.scss']
})
export class ShgDeleteComponent implements OnInit {

  statevalue!: boolean;
  districtvalue!: boolean;


  selectedStateName = "";
  selectedDistrictName = "";
  iaList: StatedetailsResult[] = [];


  shgDeletionForm!: FormGroup;
  deleteShg: Deleteshg = new Deleteshg()
  hideRequiredMarker = "true"

  shgGroupDetails: state = new state();
  constructor(private service: ServicesService, private dialog: MatDialog,private cdref: ChangeDetectorRef, private snackBar: MatSnackBar, private spinnerService: NgxSpinnerService) {
    this.dataSource = new MatTableDataSource<ShgDetailsResponse>(this.shgDetailsResponse);
  }

  //on init
  stateDetails: State = new State();
  districtDetails: State = new State();
  iaDetails: State = new State();

  iadetailslist1: Record<any, any>[] = this.iaDetails.result;
  iadetailslist2: Record<any, any>[] = this.iaDetails.result;


  animatorDetails: State = new State();
  animatornamelist1: Record<any, any>[] = this.animatorDetails.result;
  animatornamelist2: Record<any, any>[] = this.animatorDetails.result;


  state = new FormControl();
  district = new FormControl();
  ia = new FormControl();
  animator = new FormControl();
  shgcode = new FormControl();
  shgName = new FormControl();
  filter = new FormControl();


  shgDetailsRequest: ShgDetailsRequest = new ShgDetailsRequest();
  shgDetailsResponse: ShgDetailsResponse[] = [];
  districtList: StatedetailsResult[] = [];

  districtlist1: Record<any, any>[] = this.districtList;
  districtlist2: Record<any, any>[] = this.districtList;

  // iaList:StatedetailsResult[]=[];
  animatorList: StatedetailsResult[] = [];

  listOfGroupId !: any;

  stateName !: string;
  districtName !: string;
  nameOfSHPI !: string;
  shpiId !: string;
  animatorId !: string;
  stateResult: StatedetailsResult[] = [];

  statelist1: Record<any, any>[] = this.stateResult;
  statelist2: Record<any, any>[] = this.stateResult;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;


  ngOnInit(): void {
    this.statevalue = false;
    this.districtvalue = false;

    this.service.getStateService().subscribe(data => {

      this.stateDetails = data;
      this.stateResult = this.stateDetails.result
      this.statelist1 = this.stateResult;
      this.statelist2 = this.stateResult;
    });
  }

  dataSource = new MatTableDataSource<ShgDetailsResponse>(this.shgDetailsResponse); // class with object

  private sort!: MatSort;


  @ViewChild('firstTableSort') set matSort(ms: MatSort) {
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
    }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  //single space
  checkstuff(event: any) {
    if (event.target.value.substr(-1) === ' ' && event.code === 'Space') {
      
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




  handleInput(event: any) {
    if (event.target.selectionEnd === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }

  displayedColumns: string[] = ['select', 'SHGCode', 'nameoftheshg', 'animatorname', 'username'];
  selection = new SelectionModel<ShgDetailsResponse>(true, []); // imp

  selected: ShgDetailsResponse[] = [];

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }
  isAllSelected() {

    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  checkboxLabel(row?: ShgDetailsResponse): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    if (this.selection.isSelected(row)) {
      'deselect'
    }
    else {
      'select';
    }
    return "";
  }


  gotid(num: any) {
  
  }


  submit(name: any) {
    
  }

  header(name: boolean) {
    
  }

  onSelect(stateName: string) {
    this.selectedStateName = stateName;
    this.selectedDistrictName = "";


    this.toDisplay = false;
    this.dataSource.data = [];

    this.statevalue = false;
    this.stateName = stateName;
    this.shgDetailsRequest.state = stateName;
   // this.districtvalue = false
    this.district.reset();
    // this.district.setErrors(null);
    this.districtList = []
    this.ia.reset();
    this.iaDetails.result = []
    this.animator.reset();
    this.animatorDetails.result = [];


    this.service.districtNameFetch(stateName).subscribe(data => {

      this.districtDetails = data;
      this.districtList = this.districtDetails.result
      if (this.districtDetails.result.length <= 0) {
        this.snackBar.open('District not found', '', {

          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'center',


        });
      }

      this.districtlist1 = this.districtList;
      this.districtlist2 = this.districtList;

    });
  }

  onChange(districtName: string) {


    this.toDisplay = false;
    this.dataSource.data = [];
    this.selectedDistrictName = districtName;

    this.statevalue = false;
    this.districtvalue = false;
    this.districtName = districtName;
    this.shgDetailsRequest.district = this.districtName;
    this.ia.reset();
    this.iaDetails.result = []
    this.animator.reset();
    this.animatorDetails.result = [];
    this.service.getIaNameList(this.stateName, districtName).subscribe(data => {
      this.iaDetails = data;
      if (this.iaDetails.result.length <= 0) {
        this.snackBar.open('IA name not found', '', {

          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'center',


        });
      }

      this.iadetailslist2 = this.iaDetails.result;
      this.iadetailslist1 = this.iaDetails.result;

    });
  }

  animatorselect() {
    this.toDisplay = false;
    this.dataSource.data = [];

  }

  getAnimaterNames(id: string) {


    this.toDisplay = false;
    this.dataSource.data = [];

    this.statevalue = false;
    this.districtvalue = false;

    this.shpiId = id;
    this.animator.reset();
    this.animatorDetails.result = [];
    this.shgDetailsRequest.ngo_id = id;

    this.service.getAnimaterName(this.stateName, this.districtName, this.shpiId).subscribe(data => {
      this.animatorDetails = data;
      if (this.animatorDetails.result.length <= 0) {
        this.snackBar.open('Animator name not found', '', {

          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'center',


        });
      }

      this.animatornamelist1 = this.animatorDetails.result;
      this.animatornamelist2 = this.animatorDetails.result;

    });
  }
  toDisplay = false
  shgDetails() {
    this.selection.clear();
    this.listOfGroupId = " ";


    if ((this.selectedStateName == "" || this.selectedStateName == "") && (this.selectedDistrictName == null || this.selectedDistrictName == "")) {
      this.statevalue = true;
      this.districtvalue = true;

    }


    else {


      if (this.selectedStateName == null || this.selectedStateName == "") {

        this.statevalue = true;
        this.districtvalue = false;


      }

      else if (this.selectedDistrictName == null || this.selectedDistrictName == "") {
        this.statevalue = false;
        this.districtvalue = true;

      }
      else {
        this.spinnerService.show();

        this.shgDetailsRequest.animatorId = this.animatorId;
        if(this.shgDetailsRequest.shgName != undefined){

          const shgName = this.shgDetailsRequest.shgName.toUpperCase();

          this.shgDetailsRequest.shgName = shgName.trim();
        }
        
        if(this.shgDetailsRequest.shgCode != undefined){

          const shgCode = this.shgDetailsRequest.shgCode.toUpperCase();

          this.shgDetailsRequest.shgCode =shgCode.trim();
        }
        //this.shgDetailsRequest.shgCode.toUpperCase();
        //this.shgDetailsRequest.shgName.toUpperCase();


       

        this.service.getShgDetails(this.shgDetailsRequest).subscribe(data => {
          this.stateDetails = data;
          this.spinnerService.hide();

          this.shgDetailsResponse = this.stateDetails.result;

          if (this.shgDetailsResponse.length <= 0) {
            this.toDisplay = false
            this.snackBar.open('SHG/JLG details not found', '', {

              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',


            });

          } else {


            this.dataSource.data = []
            this.filter.reset();
            this.dataSource.filter = " "
            // this.snackBar.open('Data fetched successfully', '', {

            //   horizontalPosition: 'center',
            //   verticalPosition: 'top',
            //   duration: 3000,
            //   panelClass: 'center',


            // });
            this.toDisplay = true
            this.dataSource.data = this.shgDetailsResponse;

          }




        })
      }
      // this.state.setValidators([Validators.required])
      // this.state.updateValueAndValidity();
      // this.district.setValidators([Validators.required])
      // this.district.updateValueAndValidity();
      // if (this.state.invalid || this.district.invalid || this.ia.invalid) {
      //  
      //   this.toDisplay = false
      // } else {
      //   this.spinnerService.show();

      
      //   this.shgDetailsRequest.animatorId = this.animatorId;
      //   this.service.getShgDetails(this.shgDetailsRequest).subscribe(data => {
      //     this.stateDetails = data;
      //     this.spinnerService.hide();

      //     this.shgDetailsResponse = this.stateDetails.result;

      //     if (this.shgDetailsResponse.length <= 0) {
      //       this.toDisplay = false
      //       this.snackBar.open('SHG details not found', '', {

      //         horizontalPosition: 'center',
      //         verticalPosition: 'top',
      //         duration: 3000,
      //         panelClass: 'center',


      //       });
      //     } else {
      //       this.snackBar.open('SHG details retrieved successfully', '', {

      //         horizontalPosition: 'center',
      //         verticalPosition: 'top',
      //         duration: 3000,
      //         panelClass: 'center',


      //       });
      //       this.toDisplay = true
      //       this.dataSource.data = this.shgDetailsResponse;


      //     }


      //   })
      // }


    }
  }

  onBlur(): void {
    this.state.markAsUntouched();
    this.district.markAsUntouched();


  }

  selectedGroup() {
    this.district.setValidators([Validators.required]);
    this.district.updateValueAndValidity();
    var groupIdList = this.selection.selected.map(function (shg) {
      return shg.group_id;
    });
    const listOfGroupId = groupIdList.map(group_id => ({ group_id }));

    this.listOfGroupId = listOfGroupId
    if (this.listOfGroupId.length <= 0) {
      this.snackBar.open('Please select SHG/JLG group', '', {

        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'center',


      });

    } else {

      this.openConfirmDialog()


    }


  }






  letterOnly(event: any) {
    event.target.maxLength = 30;

    var charCode = event.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)

      return true;
    else
      return false;
  }


  districtTouch(name: any) {

    // if (this.districtList.length == 0) {
    if (!this.state.dirty) {

      
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


  iaTouch(name: any) {

    // if (this.iaList.length == 0) {
    if (!this.district.dirty) {

      
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
  animatorTouch(name: any) {
    // if (this.animatorList.length == 0) {
    if (!this.ia.dirty) {

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



  openConfirmDialog() {
    const dialogRef = this.dialog.open(LogoutpopupComponent, {
      width: '400px',
      autoFocus:false,
      data: {
        message: 'Are you sure want to delete ?'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.DeleteGroup();
      }
    });
  }


  DeleteGroup() {
    this.service.shgGroupDelete(this.listOfGroupId).subscribe(data => {
      if (data.result == "Unable to delete") {
        this.selection.clear();
        if(this.listOfGroupId.length>1){
          this.snackBar.open("Cannot delete SHG/JLG groups", '', {

            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',
  
  
          });

        }else{
          this.snackBar.open("Cannot delete SHG/JLG group", '', {

            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',
  
  
          });
        }
     
      } else if (data.message == "Success") {


        this.shgDetails();
        // this.service.getShgDetails(this.shgDetailsRequest).subscribe(data => {
        //   this.stateDetails = data;


        //   this.shgDetailsResponse = this.stateDetails.result;
        //   this.dataSource.data = this.shgDetailsResponse;
        // });
        if (this.listOfGroupId.length > 1) {
          
          this.snackBar.open("SHG/JLG groups deleted successfully", '', {

            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });
        } else {
          

          this.snackBar.open("SHG/JLG group deleted successfully", '', {

            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });
        }
      }

        // this.snackBar.open("SHG/JLG group deleted successfully", '', {

        //   horizontalPosition: 'center',
        //   verticalPosition: 'top',
        //   duration: 3000,
        //   panelClass: 'center',


        // });
       else {
        this.snackBar.open("Failed to delete SHG/JLG group", '', {

          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'center',


        });
      }
      // alert(this.stateDetails.result)
    })
  }
}