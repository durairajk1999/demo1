import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { FormArray, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { Group } from 'src/app/Group';
import { Mastermenu } from 'src/app/mastermenu';
import { Menus } from 'src/app/menus';
import { ResponseContentGroup } from 'src/app/response-content-group';
import { RoleList } from 'src/app/role-list';
import { ServicesService } from 'src/app/services.service';
import { User } from 'src/app/User';
import { Usermenudetails } from 'src/app/usermenudetails';

import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EncryptAndDecryptResponse } from 'src/app/encrypt-and-decrypt-response';

import { EncryptionDTO } from 'src/app/encryption-dto';
import { DecryptionDTO } from 'src/app/decryption-dto';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';
import { coerceStringArray } from '@angular/cdk/coercion';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {


  signInDetail: Usermenudetails = new Usermenudetails();

  register: User = new User();
  myForm!: FormGroup;
  hideRequiredMarker = true;

  panelOpenState!: boolean;

  groupValue!: boolean
  roleValue!: boolean
  menuValue!: boolean

  opened = true;

  groupName!: any
  roleName!: any
  menuName!: any

  responseContent: ResponseContentGroup[] = [];

  //encryptionAndDecryption: EncryptionAndDecryption = new EncryptionAndDecryption();

  encryptAndDecryptResponse: EncryptAndDecryptResponse = new EncryptAndDecryptResponse();

  encryptionDTO: EncryptionDTO = new EncryptionDTO();
  decryptionDTO: DecryptionDTO = new DecryptionDTO();

  encryptionAndDecryptionResponse: EncryptAndDecryptResponse = new EncryptAndDecryptResponse();

  registerdtoForMenus: EncryptAndDecryptResponse = new EncryptAndDecryptResponse();


  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();

  group1: Record<any, any>[] = this.responseContent;

  group2: Record<any, any>[] = this.responseContent;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;




  roleResponse: RoleList[] = []
  roleofresponse: RoleList[] = [];

  role1: Record<any, any>[] = this.roleResponse;

  role2: Record<any, any>[] = this.roleResponse;

  getGroup: Group = new Group();
  groups: Group[] = [];
  group: Group = new Group;


  menu: Menus = new Menus();
  parentMenus: Menus[] = [];
  selectedItems: any = null;
  master: Mastermenu[] = [];
  child: Mastermenu = new Mastermenu();

  roleGroupName!: string
  submitted = false;
  //  highlightedmenu=""

  encryptandDecryptkey!: string;
  constructor(private cdref: ChangeDetectorRef, private router: Router, private snackBar: MatSnackBar, private formBuilder: FormBuilder, private userservice: ServicesService, private spinnerService: NgxSpinnerService) {

    const userInfo = JSON.parse(sessionStorage.getItem('UserDetails') || ''); // new 


    this.signInDetail.username = userInfo.responseContent.username; // new 
    this.signInDetail.id = userInfo.responseContent.id; // new 


  }


  ngOnInit(): void {

    this.panelOpenState = false
    this.groupValue = false
    this.roleValue = false
    this.menuValue = false

    this.groupName = "";
    this.roleName = "";
    this.menuName = []
    this.masterMenusSelected = new Array<number>();
    this.myForm = this.formBuilder.group({
      useremail: this.formBuilder.array([])
    });



    this.userservice.checkPass().subscribe(encryptKeys => {
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















    // this.userservice.highlightSideNav(this.highlightedmenu)
  }
  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }
  onSelect(groupNme: string) {
    this.groupValue = false
    this.roleName = ""
    this.menuName = []
    this.groupName = groupNme
    this.panelOpenState = false
    this.opened = true
    this.roleId.reset();
    this.parentMenus = [];

    var encryptData = this.encryptAndDecrypt.encryptfinal(groupNme, this.encryptandDecryptkey);


    const encodeValue = encodeURIComponent(encryptData);


    this.userservice
      .getRoleList(encodeValue).subscribe(data => {


        var decryptdata = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptandDecryptkey);

        this.encryptAndDecryptResponse = JSON.parse(decryptdata);
        this.roleResponse = this.encryptAndDecryptResponse.responseContents;

        // this.roleResponse = data.responseContent
        if (this.roleResponse.length <= 0) {
          this.snackBar.open('Role not found', '', {

            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });
        }


        this.role1 = this.roleResponse;
        this.role2 = this.roleResponse;
        this.roleofresponse = this.roleResponse;
      });
  }
  allComplete: boolean = false;
  completed: boolean = false
  menuSelected!: string;
  masterMenusSelected!: number[]

  getMenuId(event: MatCheckboxChange, id: number) {



    const checked = event.checked; // stored checked value true or false
    if (checked) {
      this.masterMenusSelected.push(id)


        ; // push the Id in array if checked
    } else {
      const index = this.masterMenusSelected.findIndex(list => list == id);//Find the index of stored id
      this.masterMenusSelected.splice(index, 1); // Then remove
    }
    this.register.masterMenus = this.masterMenusSelected

  }

  areAllSelected = false;


  getMenuList(roleName: string) {
    this.masterMenusSelected = [];


    this.groupValue = false
    this.roleValue = false
    this.roleName = roleName
    this.menuName = [];

    var encryptData = this.encryptAndDecrypt.encryptfinal(this.roleName, this.encryptandDecryptkey);


    // var ff = JSON.stringify(encryptData);

    const encodeURl = encodeURIComponent(encryptData)

    this.userservice.getMenus(encodeURl).subscribe(data => {


      var decryptData = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptandDecryptkey)


      this.registerdtoForMenus = JSON.parse(decryptData);


      this.parentMenus = this.registerdtoForMenus.responseContent;
      if (this.parentMenus.length <= 0) {
        this.snackBar.open('Menu not found', '', {

          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
          panelClass: 'center',


        });
      } else {
        this.panelOpenState = false
        this.opened = false
      }
      for (let i = 0; i < this.parentMenus.length; i++) {
        if (this.parentMenus[i].roleMenuDTOs == null) {
          this.masterMenusSelected.push(this.parentMenus[i].id);
        }

        else {

          for (let k = 0; k < this.parentMenus[i].roleMenuDTOs.length; k++) {
            this.masterMenusSelected.push(this.parentMenus[i].roleMenuDTOs[k].id);
          }
        }

      }
      this.register.masterMenus = this.masterMenusSelected;
    });
  }

  //email = new FormControl('', { validators: [Validators.required, Validators.pattern('[a-zA-Z0-9.]{1,30}@([a-zA-Z]){2,}[.]{1}[a-zA-Z]{3}$')] });


  //email = new FormControl('', { validators: [Validators.required, Validators.pattern('[a-zA-Z0-9.]{1,30}@anniyam.com$')] });

  // crct patter but without max length   email = new FormControl('', { validators: [Validators.required, Validators.pattern('^[a-z_A-z]{2,30}[a-zA-Z0-9.]{0,15}@anniyam.com$')] });

  email = new FormControl('', { validators: [Validators.required, Validators.pattern('^[a-z_A-z]{2,}[a-zA-Z0-9.]{0,}@anniyam.com$')] });


  mobile = new FormControl('', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]);
  groupId = new FormControl();
  roleId = new FormControl();
  firstName = new FormControl();
  lastName = new FormControl();
  getEmailError() {
    if (this.email.hasError('required')) {
      return 'Email ID is required';
    }
    return this.email.hasError('pattern') ? 'Enter valid Email ID' : '';
  }
  onBlur(): void {
    this.email.markAsUntouched();
    this.mobile.markAsUntouched();
    this.groupId.markAsUntouched();

    this.roleId.markAsUntouched();
    this.firstName.markAsUntouched();
    this.lastName.markAsUntouched();
  }
  getMobileError() {
    if (this.mobile.hasError('required')) {
      return 'Mobile number is required';
    }
    return this.mobile.hasError('pattern') ? 'Enter valid mobile number' : '';
  }

  groupError() {
    return 'Group is required';
  }
  roleError() {
    return 'Role is required';
  }
  firstNameError() {
    return 'First Name is required';
  }
  lastNameError() {
    return 'Last Name is required';
  }
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  submit = false;

  firstNameValue!: boolean
  lastNameValue!: boolean




  firstNameChange() {
    this.firstNameValue = false
  }

  lastNameChange() {
    this.lastNameValue = false
  }




  registerNow() {
    this.submit = true
    if ((this.register.firstName == "" || this.register.firstName == null) && (this.mobile.invalid) && (this.email.invalid) &&
      (this.register.lastName == "" || this.register.lastName == null) && (this.register.masterMenus == null || this.register.masterMenus == "") && (this.groupName == "" || this.groupName == null) && (this.roleName == "" || this.roleName == null)) {
      this.groupValue = true
      this.roleValue = true
      this.firstNameValue = true
      this.lastNameValue = true
      // this.menuValue=true
    }

    else if ((this.email.invalid) || (this.mobile.invalid)) {
      if ((this.register.firstName == "" || this.register.firstName == null) && (this.register.lastName == "" || this.register.lastName == null)) {
        this.firstNameValue = true
        this.lastNameValue = true
        if (this.groupName == "" || this.groupName == null) {
          this.groupValue = true
          this.roleValue = true
        }
        else if (this.roleName == "" || this.roleName == null) {
          this.roleValue = true
          this.groupValue = false
        }
      }
      else if (this.register.firstName == "" || this.register.firstName == null) {
        this.firstNameValue = true
        if (this.groupName == "" || this.groupName == null) {
          this.groupValue = true
          this.roleValue = true
        }
        else if (this.roleName == "" || this.roleName == null) {
          this.roleValue = true
          this.groupValue = false
        }
      }
      else if (this.register.lastName == "" || this.register.lastName == null) {
        this.lastNameValue = true
        if (this.groupName == "" || this.groupName == null) {
          this.groupValue = true
          this.roleValue = true
        }
        else if (this.roleName == "" || this.roleName == null) {
          this.roleValue = true
          this.groupValue = false
        }
      }
    }
    else if (this.register.lastName == "" || this.register.lastName == null) {
      this.lastNameValue = true

      if (this.register.firstName == "" || this.register.firstName == null) {
        this.firstNameValue = true
      }

    }
    else if (this.register.firstName == "" || this.register.firstName == null) {
      this.firstNameValue = true
    }

    else if ((this.groupName == "" || this.groupName == null) && (this.roleName == "" || this.roleName == null) && (this.register.masterMenus == null || this.register.masterMenus == "")) {
      this.groupValue = true
      this.roleValue = true
      // this.menuValue=true
    }
    else if (this.groupName == "" || this.groupName == null) {
      this.groupValue = true
      this.roleValue = false
      // this.menuValue=false
    }
    else if (this.roleName == "" || this.roleName == null) {
      this.groupValue = false
      this.roleValue = true
      // this.menuValue=true
    }
    else if (this.register.masterMenus == "" || this.register.masterMenus == null) {
      this.groupValue = false
      this.roleValue = false
      this.snackBar.open('Please select required menu', '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'center'


      });


      // this.menuValue=true
    }
    else if (this.firstName.invalid) {
    }
    else {
      this.spinnerService.show();

      const fName = this.register.firstName.replace(/\b\w/g, (x: string) => x.toUpperCase());

      const lName = this.register.lastName.replace(/\b\w/g, (x: string) => x.toUpperCase());

      this.register.firstName = fName.trim();

      this.register.lastName = lName.trim();





      this.register.createdBy = this.signInDetail.id + "/" + this.signInDetail.username; // new 





      var encryptdata = this.encryptAndDecrypt.encryptfinal(this.register, this.encryptandDecryptkey);



      this.encryptionDTO.data = encryptdata;

      this.userservice.userRegister(this.encryptionDTO).subscribe(
        data => {


          this.spinnerService.hide();
          var decryptData = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptandDecryptkey);


          this.decryptionDTO.data = decryptData;

          var resposne = JSON.parse(this.decryptionDTO.data);

          this.encryptionAndDecryptionResponse = resposne;

          if (this.encryptionAndDecryptionResponse.statusCode == 200) {
            this.reloadCurrentRoute();

            this.snackBar.open(this.encryptionAndDecryptionResponse.message, '', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center'


            });
          } else {

            if (this.encryptionAndDecryptionResponse.message == "Email id is already in use") {


              this.snackBar.open("User is already registered", '', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',


              });
            }

            else {
              this.snackBar.open(this.encryptionAndDecryptionResponse.message, '', {
                horizontalPosition: 'center',
                verticalPosition: 'top',
                duration: 3000,
                panelClass: 'center',


              });


            }



          }


        }
      )


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
  roleTouch() {
    if (!this.groupId.dirty) {
      this.snackBar.open("Please select group ", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',
      });
    } else {
    }

  }
  menuTouch() {

    if (!this.roleId.dirty) {
      this.snackBar.open("Please select role", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'center',


      });
    }

    else if (this.parentMenus.length <= 0) {
      this.snackBar.open('Menu not found', '', {

        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'center',


      });
    }

  }


  letterOnly(even: any) {
    even.target.maxLength = 30;
    var charCode = even.keyCode;

    if ((charCode > 64 && charCode < 91) || (charCode > 96 && charCode < 123) || charCode == 8)

      return true;
    else
      return false;
  }






  animatorTouch(name: any) {

    if (!this.roleId.dirty) {
      this.snackBar.open("Please select group", '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
        panelClass: 'center',
      });
    } else {
    }

  }



  getValue() {

    this.userservice.fetchAllGroupName().subscribe(data => {
      const decryptData = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptandDecryptkey);
      this.getGroup = JSON.parse(decryptData);
      this.responseContent = this.getGroup.responseContent;
      this.group1 = this.responseContent;
      this.group2 = this.responseContent;


    });
  }



}