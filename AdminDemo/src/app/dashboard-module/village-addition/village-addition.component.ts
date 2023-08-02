import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServicesService } from 'src/app/services.service';
import { State } from 'src/app/state-details';
import { StatedetailsResult } from 'src/app/statedetails-result';
import { VillageAddition } from 'src/app/village-addition';
@Component({
  selector: 'app-village-addition',
  templateUrl: './village-addition.component.html',
  styleUrls: ['./village-addition.component.scss']
})
export class VillageAdditionComponent implements OnInit {


  statestatus!: boolean;
  districtstatus!: boolean;
  blockstatus!: boolean;
  panchayatstatus!: boolean;
  villagestatus!: boolean;




  stateNameSelect = "";
  districtNameSelect = "";
  blockNameSelect = "";
  panchayatnameSelect = "";

  selectedStateName = "";
  selectedDistrictName = "";
  selectedBlockName = "";
  selectedPanchayatName = "";
  selectedVillageName = "";

  stateList: StatedetailsResult[] = [];
  stateResponse!: State

  districtList: StatedetailsResult[] = [];
  districtResponse!: State
  districtoflist: StatedetailsResult[] = [];

  blockList: StatedetailsResult[] = [];
  blockResponse!: State
  blockoflist: StatedetailsResult[] = [];

  panchayatList: StatedetailsResult[] = [];
  panchayatoflist: StatedetailsResult[] = [];
  panchayatResponse!: State


  statelist1: Record<any, any>[] = this.stateList;
  statelist2: Record<any, any>[] = this.stateList;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;


  districtlist1: Record<any, any>[] = this.districtList;
  districtlist2: Record<any, any>[] = this.districtList;


  blocklist1: Record<any, any>[] = this.blockList;
  blocklist2: Record<any, any>[] = this.blockList;


  panchayatnamelist1: Record<any, any>[] = this.panchayatList;
  panchayatnamelist2: Record<any, any>[] = this.panchayatList;



  villageCreationResponse!: State




  village: VillageAddition = new VillageAddition()
  hideRequiredMarker = "true"
  constructor(private service: ServicesService,private cdref: ChangeDetectorRef, private spinnerService: NgxSpinnerService, public dialog: MatDialog, private snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {

    this.statestatus = false;
    this.districtstatus = false;
    this.blockstatus = false;
    this.panchayatstatus = false;
    this.villagestatus = false;



    this.service.getStateService().subscribe(data => {
      this.stateResponse = data;
      this.stateList = this.stateResponse.result;

      this.statelist1 = this.stateList;
      this.statelist2 = this.stateList;
    }
    )
  }
  ngAfterContentChecked() {
    
    this.cdref.detectChanges();
 }
  stateForm = new FormControl();
  districtForm = new FormControl();
  blockForm = new FormControl();
  panchayatForm = new FormControl();
  villageControl = new FormControl();

  onSelect(selectedStateName: string) {



    this.stateNameSelect = selectedStateName;
    this.districtNameSelect = "";
    this.blockNameSelect = "";
    this.panchayatnameSelect = "";


    this.districtlist1 = [];
    this.districtlist2 = [];
    this.blocklist1 = [];
    this.blocklist2 = [];
    this.panchayatnamelist1 = [];
    this.panchayatnamelist2 = [];


    this.selectedStateName = selectedStateName

    this.statestatus = false;


    this.selectedDistrictName = "";
    this.selectedBlockName = "";
    this.selectedPanchayatName = "";
    this.selectedVillageName = "";
    this.districtList = [];
    this.blockList = [];
    this.panchayatList = [];

    this.districtForm.reset();
    this.blockForm.reset();
    this.panchayatForm.reset();






    this.service.districtNameFetch(selectedStateName).subscribe(data => {

      this.districtResponse = data;


      if (this.districtResponse.result.length == 0) {

        this.snackBar.open("District not found", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });

      }

      else {


        this.districtList = this.districtResponse.result;
        this.districtlist1 = this.districtList;
        this.districtlist2 = this.districtList;
        this.districtoflist = this.districtList;

      }



    });





  }


  onChange(selectedDistrictName: string) {



    this.blocklist1 = [];
    this.blocklist2 = [];
    this.panchayatnamelist1 = [];
    this.panchayatnamelist2 = [];


    this.districtNameSelect = selectedDistrictName;
    this.blockNameSelect = "";
    this.panchayatnameSelect = "";

    this.blockList = [];

    this.panchayatList = [];
    this.selectedDistrictName = selectedDistrictName;


    this.blockForm.reset();
    this.panchayatForm.reset();

    this.statestatus = false;
    this.districtstatus = false;
    // this.blockstatus=false;
    // this.panchayatstatus=false;
    // this.villagestatus=false;

    this.selectedBlockName = "";
    this.selectedPanchayatName = "";
    this.selectedVillageName = "";



    this.service.blockFetch(this.selectedStateName, selectedDistrictName).subscribe(data => {

      this.blockResponse = data;

      if (this.blockResponse.result.length == 0) {

        this.snackBar.open("Block not found", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });



      }


      else {



        this.blockList = this.blockResponse.result;
        this.blocklist1 = this.blockList;
        this.blocklist2 = this.blockList;
        this.blockoflist = this.blockList;
      }


    });
  }

  //space
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


  isAlfa(evt: any) {


    evt = (evt || window.event);
    var charCode = (evt.which || evt.keyCode);
    var del='Delete'

    var arrowLeft = 'ArrowLeft'
    var arrowRight = 'ArrowRight'
    var arrow : any

    if (evt.key==arrowRight||evt.key == arrowLeft||evt.key == del){
      arrow = false;

    }else {
      arrow = true;
    }


    return ((
      (charCode > 32)
      && (charCode < 65 || charCode > 90)
      && (charCode < 97 || charCode > 122) && (arrow)

    ) || this.willCreateWhitespaceSequence(evt)) ? false : true;
  }




  handleInput(event: any) {
    if (event.target.selectionEnd === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }

  getPanchayat(selectedBlockName: string) {





    this.panchayatnamelist1 = [];
    this.panchayatnamelist2 = [];

    this.blockNameSelect = selectedBlockName;
    this.panchayatnameSelect = "";

    this.panchayatList = [];

    this.statestatus = false;
    this.districtstatus = false;
    this.blockstatus = false;
    // this.panchayatstatus=false;
    // this.villagestatus=false;
    this.selectedBlockName = selectedBlockName;

    this.selectedPanchayatName = "";
    this.selectedVillageName = "";


    this.service.FetchPanchayat(this.selectedStateName, this.selectedDistrictName, selectedBlockName).subscribe(data => {
      this.panchayatResponse = data;



      if (this.panchayatResponse.result.length == 0) {
        this.snackBar.open("Panchayat not found", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });

      }

      else {


        this.panchayatList = this.panchayatResponse.result;
        this.panchayatnamelist1 = this.panchayatList;
        this.panchayatnamelist2 = this.panchayatList;
        this.panchayatoflist = this.panchayatList;
      }



    });
  }


  selectpanchayat(panchayatvalue: string) {



    this.panchayatnameSelect = panchayatvalue;

    this.statestatus = false;
    this.districtstatus = false;
    this.blockstatus = false;
    this.panchayatstatus = false;



    this.selectedPanchayatName = panchayatvalue;
    this.selectedVillageName = "";
  }



  villageName() {
    this.villagestatus = false;
  }


  onSubmit() {

    this.selectedVillageName = this.village.village_name;

    if ((this.selectedStateName == null || this.selectedStateName == "") && (this.selectedDistrictName == null || this.selectedDistrictName == "") && (this.selectedBlockName == null || this.selectedBlockName == "") && (this.selectedPanchayatName == null || this.selectedPanchayatName == "") && (this.selectedVillageName == "" || this.selectedVillageName == null)) {
      this.statestatus = true;
      this.districtstatus = true;
      this.blockstatus = true;
      this.panchayatstatus = true;
      this.villagestatus = true;

    }

    else {


      if (this.selectedStateName == null || this.selectedStateName == "") {
        this.statestatus = true;


        if (this.selectedDistrictName == null || this.selectedDistrictName == "") {
          this.districtstatus = true;

        }

        if (this.selectedBlockName == null || this.selectedBlockName == "") {
          this.blockstatus = true;

        }

        if (this.selectedPanchayatName == null || this.selectedPanchayatName == "") {


          this.panchayatstatus = true;
        }


        if (this.selectedVillageName == null || this.selectedVillageName == "") {


          this.villagestatus = true;
        }



      }

      else if (this.selectedDistrictName == null || this.selectedDistrictName == "") {

        this.districtstatus = true;

        if (this.selectedBlockName == null || this.selectedBlockName == "") {
          this.blockstatus = true;

        }

        if (this.selectedPanchayatName == null || this.selectedPanchayatName == "") {


          this.panchayatstatus = true;
        }


        if (this.selectedVillageName == null || this.selectedVillageName == "") {


          this.villagestatus = true;
        }

        if (this.selectedStateName == null || this.selectedStateName == "") {
          this.statestatus = true;
        }





      }

      else if (this.selectedBlockName == null || this.selectedBlockName == "") {

        this.blockstatus = true;

        if (this.selectedPanchayatName == null || this.selectedPanchayatName == "") {


          this.panchayatstatus = true;
        }


        if (this.selectedVillageName == null || this.selectedVillageName == "") {


          this.villagestatus = true;
        }

        if (this.selectedStateName == null || this.selectedStateName == "") {
          this.statestatus = true;
        }

        if (this.selectedDistrictName == null || this.selectedDistrictName == "") {

          this.districtstatus = true;
        }




      }

      else if (this.selectedPanchayatName == null || this.selectedPanchayatName == "") {

        this.panchayatstatus = true;

        this.village.village_panchayat_name = "";


        if (this.selectedVillageName == null || this.selectedVillageName == "") {


          this.villagestatus = true;
        }

        if (this.selectedStateName == null || this.selectedStateName == "") {
          this.statestatus = true;
        }

        if (this.selectedDistrictName == null || this.selectedDistrictName == "") {

          this.districtstatus = true;
        }


        if (this.selectedBlockName == null || this.selectedBlockName == "") {

          this.blockstatus = true;
        }




      }

      else if (this.selectedVillageName == null || this.selectedVillageName == "") {

        this.villagestatus = true;



        if (this.selectedStateName == null || this.selectedStateName == "") {
          this.statestatus = true;
        }

        if (this.selectedDistrictName == null || this.selectedDistrictName == "") {

          this.districtstatus = true;
        }


        if (this.selectedBlockName == null || this.selectedBlockName == "") {

          this.blockstatus = true;
        }

        if (this.selectedPanchayatName == null || this.selectedPanchayatName == "") {

          this.panchayatstatus = true;
        }

      }

      else {



        if(this.villageControl.valid)
        {

        this.village.block_name = this.selectedBlockName;
        this.village.district_name = this.selectedDistrictName;
        this.village.state_name = this.selectedStateName;
        this.village.village_name = this.selectedVillageName;
        this.village.village_panchayat_name = this.selectedPanchayatName;



        this.spinnerService.show();

        

        const vilageName = this.selectedVillageName.toUpperCase();
        this.village.village_name = vilageName.trim();

      

        this.service.villageAddition(this.village).subscribe(data => {

          this.spinnerService.hide();
          this.villageCreationResponse = data;
          

          if (this.villageCreationResponse.message == "Success") {

            this.snackBar.open(" Village added successfully", '',
              {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',


              });

            this.reloadCurrentRoute();

          }

          else {

          }


        });



        }

        else{
          
        }
        
      }




    }

  }



  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  spaceEnter() {
    
  }
  //return event.charCode != 32

  validate(s: any) {
    if (/^(\w+\s?)*\s*$/.test(s)) {
      return s.replace(/\s+$/, '');
    }
    return 'NOT ALLOWED';
  }





  letterOnly(event: any) {
    event.target.maxLength=30;

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


  blockTouch() {
    if (this.districtNameSelect == "") {
      this.snackBar.open("Please select district", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',


      });
    }
    else { }
  }






  panchayatTouch() {
    if (this.blockNameSelect == "") {
      this.snackBar.open("Please select block ", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',


      });
    }
    else {

    }
  }




}