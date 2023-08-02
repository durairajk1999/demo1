
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Panchayat } from 'src/app/panchayat';
import { ServicesService } from 'src/app/services.service';

import { State } from 'src/app/state-details';
import { StatedetailsResult } from 'src/app/statedetails-result';
@Component({
  selector: 'app-panchayat-addition',
  templateUrl: './panchayat-addition.component.html',
  styleUrls: ['./panchayat-addition.component.scss']
})
export class PanchayatAdditionComponent implements OnInit {
  statevalue!: boolean;
  districtvalue!: boolean;
  blockvalue!: boolean;
  panchayatvalue!: boolean;
  villagevalue!: boolean;
  selectedStateName = "";
  selectedDistrictName = "";
  selectedBlockValue = "";
  selectedPanchayatValue = "";
  selectedVillageValue = ""
  villageNameEnter = "";
  panchayatNameEnter = "";
  panchayatmsg = "";
  villagemsg = "";
  // Panchayat Name is required
  blockForm = new FormControl();
  districtForm = new FormControl();
  panchayatName = new FormControl();
  villageForm = new FormControl();
  stateResponse: State = new State();
  statelist1: Record<any, any>[] = this.stateResponse.result;
  statelist2: Record<any, any>[] = this.stateResponse.result;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;
  // validation
  stateNameSelect = "";
  districtNameSelect = "";
  blockNameSelect = "";
  districtList: StatedetailsResult[] = [];
  districtResponse: State = new State();
  districtlist1: Record<any, any>[] = this.districtResponse.result;
  districtlist2: Record<any, any>[] = this.districtResponse.result;
  blockList: StatedetailsResult[] = [];
  blockResponse: State = new State();
  blocklist1: Record<any, any>[] = this.blockResponse.result;
  blocklist2: Record<any, any>[] = this.blockResponse.result;
  panchayatForm!: FormGroup;
  panchayat: Panchayat = new Panchayat()
  hideRequiredMarker = "true"
  msg!: string;
  msgpan!: string;
  constructor(private service: ServicesService, private cdref: ChangeDetectorRef, private spinnerService: NgxSpinnerService, public dialog: MatDialog, private snackBar: MatSnackBar, private router: Router) { }
  ngOnInit(): void {
    this.statevalue = false;
    this.districtvalue = false;
    this.blockvalue = false;
    this.panchayatvalue = false;
    this.villagevalue = false;
    this.service.getStateService().subscribe(data => {
      this.stateResponse = data;
      this.statelist1 = this.stateResponse.result;
      this.statelist2 = this.stateResponse.result;
    }
    )
  }
  onSelect(selectedStateName: string) {
    this.districtlist1 = [];
    this.districtlist2 = [];
    this.blocklist1 = [];
    this.blocklist2 = [];
    this.stateNameSelect = selectedStateName;
    this.districtNameSelect = "";
    this.blockNameSelect = "";
    this.selectedStateName = selectedStateName;
    this.selectedDistrictName = "";
    this.selectedBlockValue = "";
    this.selectedPanchayatValue = "";
    this.selectedVillageValue = ""
    this.villageNameEnter = "";
    this.panchayatNameEnter = "";
    this.blockForm.reset();
    this.districtForm.reset();
    this.districtResponse.result = [];
    this.blockResponse.result = [];
    this.statevalue = false;
    this.selectedStateName = selectedStateName
    this.service.districtNameFetch(selectedStateName).subscribe(data => {
      if (data.result.length == 0) {
        this.snackBar.open("District not found", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',
          });
      }
      else {
        this.districtResponse = data;
        this.districtList = this.districtResponse.result;
        this.districtlist1 = this.districtResponse.result;
        this.districtlist2 = this.districtResponse.result;
      }
    });
  }

  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }
  onChange(selectedDistrict: string) {
    this.blocklist1 = [];
    this.blocklist2 = [];
    this.districtNameSelect = selectedDistrict;
    this.blockNameSelect = "";
    this.districtvalue = false;
    this.selectedDistrictName = selectedDistrict;
    this.selectedBlockValue = "";
    this.selectedPanchayatValue = "";
    this.selectedVillageValue = "";
    this.villageNameEnter = "";
    this.panchayatNameEnter = "";
    this.blockForm.reset();
    this.service.blockFetch(this.selectedStateName, selectedDistrict).subscribe(data => {
      if (data.result.length == 0) {
        this.snackBar.open("Block not found", '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',
          });
      }
      else {
        this.blockResponse = data;
        this.blockList = this.blockResponse.result;
        this.blocklist1 = this.blockResponse.result;
        this.blocklist2 = this.blockResponse.result;
      }
    });
  }
  blockSelected(blockName: string) {
    this.blockvalue = false;
    this.blockNameSelect = blockName;
    this.selectedPanchayatValue = "";
    this.selectedVillageValue = ""
    this.selectedBlockValue = blockName;
    this.villageNameEnter = "";
    this.panchayatNameEnter = "";
  }
  onSubmit() {
    if ((this.selectedStateName == null || this.selectedStateName == "") && (this.selectedDistrictName == null || this.selectedDistrictName == "") && (this.selectedBlockValue == null || this.selectedBlockValue == "") && (this.selectedPanchayatValue == null || this.selectedPanchayatValue == "") && (this.selectedVillageValue == null || this.selectedVillageValue == "")) {
      this.statevalue = true;
      this.districtvalue = true;
      this.blockvalue = true;
      this.panchayatvalue = true;
      this.panchayatmsg = "Panchayat name is required";
      this.villagevalue = true;
      this.villagemsg = "Village name is required";
    }
    else {
      if (this.selectedStateName == null || this.selectedStateName == "") {
        this.statevalue = true;
        this.districtvalue = true;
        this.blockvalue = true;
        if (this.selectedPanchayatValue == null || this.selectedPanchayatValue == "") {
          this.panchayatvalue = true;
          this.panchayatmsg = "Panchayat name is required";
        }
        if (this.selectedVillageValue == null || this.selectedVillageValue == "") {
          this.villagevalue = true;
          this.villagemsg = "Village name is required";
        }
      }
      else if (this.selectedDistrictName == null || this.selectedDistrictName == "") {
        this.districtvalue = true;
        this.blockvalue = true;
        if (this.selectedPanchayatValue == null || this.selectedPanchayatValue == "") {
          this.panchayatvalue = true;
          this.panchayatmsg = "Panchayat name is required";
        }
        if (this.selectedVillageValue == null || this.selectedVillageValue == "") {
          this.villagevalue = true;
          this.villagemsg = "Village name is required";
        }
      }
      else if (this.selectedBlockValue == null || this.selectedBlockValue == "") {
        this.blockvalue = true;
        if (this.selectedPanchayatValue == null || this.selectedPanchayatValue == "") {
          this.panchayatvalue = true;
          this.panchayatmsg = "Panchayat name is required";
        }
        if (this.selectedVillageValue == null || this.selectedVillageValue == "") {
          this.villagevalue = true;
          this.villagemsg = "Village name is required";
        }
      }
      else if (this.selectedPanchayatValue == null || this.selectedPanchayatValue == "") {
        this.panchayatvalue = true;
        this.panchayatmsg = "Panchayat name is required";
        if (this.selectedVillageValue == null || this.selectedVillageValue == "") {
          this.villagevalue = true;
          this.villagemsg = "Village name is required";
        }
      }
      else if (this.selectedVillageValue == null || this.selectedVillageValue == "") {
        this.villagevalue = true;
        this.villagemsg = "Village name is required";
      }
      else {
        if (this.selectedPanchayatValue.length >= 3 && this.selectedVillageValue.length >= 3) {
          this.spinnerService.show();
          this.panchayat.state_name = this.selectedStateName;
          this.panchayat.district_name = this.selectedDistrictName;
          this.panchayat.block_name = this.selectedBlockValue;
          this.panchayat.village_panchayat_name = this.selectedPanchayatValue;

          this.panchayat.village_name = this.selectedVillageValue;

          const villageName = this.selectedVillageValue.toUpperCase();
          const villagePanchayatName = this.selectedPanchayatValue.toUpperCase();

          this.panchayat.village_panchayat_name = villagePanchayatName.trim();
          this.panchayat.village_name = villageName.trim();


          

          this.service.panchayatAddition(this.panchayat).subscribe(data => {
            this.spinnerService.hide();
            if (data.message == "Success") {
              this.snackBar.open("Panchayat added successfully", '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',
                });
              this.reloadCurrentRoute();
            }
            else {
              this.spinnerService.hide();
              this.snackBar.open("Panchayat added failed", '',
                {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 3000,
                  panelClass: 'center',
                });
            }
          });
        }
        else {
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
  panchayatselect(panchayatSelected: string) {
    // this.msgpan ="Panchayat Name is too short";
    if (panchayatSelected.length < 3) {
      this.panchayatvalue = true;
      this.panchayatmsg = this.msgpan;
      this.selectedPanchayatValue = panchayatSelected;
      if (panchayatSelected.length == 0) {
        this.selectedPanchayatValue = "";
        this.panchayatmsg = "";
        this.msgpan = "";
        this.panchayatvalue = false;
      }
    }
    else {
      this.selectedPanchayatValue = panchayatSelected;
      this.panchayatvalue = false;
      this.panchayatmsg = "";
    }
  }
  villageSelect(villageSelected: string) {
    //  this.msg ="Village Name is too short";
    if (villageSelected.length < 3) {
      this.villagemsg = this.msg;
      this.villagevalue = true;
      this.selectedVillageValue = villageSelected;
      if (villageSelected.length == 0) {
        this.selectedVillageValue = "";
        this.msg = "";
        this.villagemsg = "";
        this.villagevalue = false;
      }
    }
    else {
      this.selectedVillageValue = villageSelected;
      this.villagemsg = "";
      this.villagevalue = false;
    }
  }
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
    var del = 'Delete'

    var arrowLeft = 'ArrowLeft'
    var arrowRight = 'ArrowRight'
    var arrow: any

    if (evt.key == arrowRight || evt.key == arrowLeft || evt.key == del) {
      arrow = false;

    } else {
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
  blockTouch() {
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
}
