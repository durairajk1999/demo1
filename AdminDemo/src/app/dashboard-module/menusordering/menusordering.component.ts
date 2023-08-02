import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MasterMenuOrderDTO } from 'src/app/master-menu-order-dto';
import { MenuOrderingTableResponse } from 'src/app/menu-ordering-table-response';
import { MenuOrderingTableResponseContent } from 'src/app/menu-ordering-table-response-content';
import { MenuOrderingTableResponseRoleGroup } from 'src/app/menu-ordering-table-response-role-group';
import { MenusOrdering } from 'src/app/menus-ordering';
import { MenusOrderingResponse } from 'src/app/menus-ordering-response';
import { MenusOrderingResponseContent } from 'src/app/menus-ordering-response-content';
import { MenusOrderingServiceService } from 'src/app/menus-ordering-service.service';
import { MasterMenuOrderChange } from 'src/app/master-menu-order-change';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { error } from 'jquery';

import { EncryptAndDecryptResponse } from 'src/app/encrypt-and-decrypt-response';
import { EncryptionDTO } from 'src/app/encryption-dto';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';
import { ServicesService } from 'src/app/services.service';




var orderIdChangeArray: any[] = [];

@Component({
  selector: 'app-menusordering',
  templateUrl: './menusordering.component.html',
  styleUrls: ['./menusordering.component.scss']
})
export class MenusorderingComponent implements OnInit {

  encryptandDecryptkey!: string;

  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();
  constructor(private menusOrderingService: MenusOrderingServiceService, private service: ServicesService, private cdref: ChangeDetectorRef, private router: Router, private fb: FormBuilder, private snackBar: MatSnackBar,
    private spinnerService: NgxSpinnerService) {


   


  }

  masterMenuOrderDTOs: MasterMenuOrderDTO[] = [];
  masterMenuOrderChange: MasterMenuOrderChange = new MasterMenuOrderChange();

  //encryptAndDecrypt : EncryptionAndDecryption = new EncryptionAndDecryption();

  encryptDTO: EncryptionDTO = new EncryptionDTO();

  encrytAndDecryptResposne: EncryptAndDecryptResponse = new EncryptAndDecryptResponse();

  @ViewChildren("orderSelection") orderIdSelection!: QueryList<MatSelect>;
  assign = new Array<number>();
  // assign:any;
  selectedOption = new Set<string>();

  OrderIdChangemap = new Map<any, any>();



  formctl!: FormControl;
  disabled = true;
  groupValue!: boolean
  groupName: any
  ngOnInit() {


    this.groupName = ""
    this.groupValue = false;

    this.menuOrderingForm = new FormGroup({
      groupName1: new FormControl('', [Validators.required])
    });
    this.roleGroupId = this.groupName1
    this.formctl = new FormControl({ value: '', disabled: this.disabled })

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

  selected(id: any, index: any) {

    var masterMenuId = index.masterMenuId;
    var orderId = id;
    var aaa = { masterMenuId, orderId };


    this.OrderIdChangemap.set(index.masterMenuId, aaa);

    this.selectedOption.clear();

    this.orderIdSelection.toArray().forEach(ls => {


      const selectedVal = ls.value;

      if (selectedVal && selectedVal !== "undefined")
        this.selectedOption.add(selectedVal);

    });

    this.selectedOption.forEach(sl => {
      var numberValue = Number(sl);



    });
  }

  isSelected(lang: string) {
    return this.selectedOption.has(lang);
  }



  groupSelect(name: any) {

    this.toDisplay = false;
    this.dataSource.data = [];

    this.groupValue = false
    this.groupName = name
  }


  menusOrderingResp!: MenusOrderingResponse
  menusOrderingResponseContent: MenusOrderingResponseContent[] = [];

  groupnamelist1: Record<any, any>[] = this.menusOrderingResponseContent;
  groupnamelist2: Record<any, any>[] = this.menusOrderingResponseContent;
  @Input() clearSearchInput = false;
  @Input() fixOnTop = false;



  //table
  menuOrderingTableResp!: MenuOrderingTableResponse
  menuOrderingRespContent!: MenuOrderingTableResponseContent[]
  menuOrderingTableResponseGroup: MenuOrderingTableResponseRoleGroup = new MenuOrderingTableResponseRoleGroup();
  hideRequiredMarker = "true"
  menuOrderingForm!: FormGroup;
  dropdownForm!: FormGroup;

  menusOrdering: MenusOrdering = new MenusOrdering();
  roletable = false;


  dataSource = new MatTableDataSource<MenuOrderingTableResponseContent>(this.menuOrderingRespContent);

  displayedColumns: string[] = ['slNo', 'groupName', 'parentMenuName', 'menuName', 'currentOrderId', 'neworderId'];

  roleGroupId!: string
  groupName1!: string
  groupId = new FormControl();
  toDisplay = false

  private sort!: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    this.dataSource.sort = this.sort;
  }





  onSubmit() {
    this.groupId.setErrors([Validators.required]);
    this.groupId.updateValueAndValidity();

    this.OrderIdChangemap.clear();
    this.selectedOption.clear();

    if (this.groupName == "" || this.groupName == null) {
      this.groupValue = true
    } else {
      this.spinnerService.show()
      this.roleGroupId = this.groupName


      const encryptData = this.encryptAndDecrypt.encryptfinal(this.roleGroupId, this.encryptandDecryptkey);

      this.menusOrderingService.getMenu(encryptData).subscribe(data => {
        const decryptData = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptandDecryptkey);
        this.menuOrderingTableResp = JSON.parse(decryptData);
        this.encrytAndDecryptResposne = JSON.parse(decryptData);
        this.spinnerService.hide();

        // this.districtResult = this.districtResponse.result;
        // this.groupId.reset()
        // this.groupId.setErrors(null)
        this.menuOrderingRespContent = this.menuOrderingTableResp.responseContent






        if (this.encrytAndDecryptResposne.statusCode != 200) {



          this.snackBar.open('Menu not found', '', {

            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });
          this.toDisplay = false
        }

        else {

          this.toDisplay = true

          // this.snackBar.open('Menu fetched successfully', '', {

          //   horizontalPosition: 'center',
          //   verticalPosition: 'top',
          //   duration: 3000,
          //   panelClass: 'center',


          // });

        }


        this.dataSource.data = this.menuOrderingRespContent
        // this.dataSource.sortingDataAccessor = (row:MenuOrderingTableResponseContent,columnName:string) : string => {
        //   if(columnName=="groupName") return row.roleGroup.roleGroupName;
        //   var columnValue = row[columnName as keyof MenuOrderingTableResponseContent] as string;
        //   return columnValue;
        // }
      }






      );
    }

  }




  @ViewChild('paginator', { static: false }) set paginatorPageSize(pager: MatPaginator) {
    if (pager) {
      this.dataSource.paginator = pager;
      this.dataSource.paginator._intl = new MatPaginatorIntl()
      this.dataSource.paginator._intl.itemsPerPageLabel = "";
    }
  }



  public checkError = (controlName: string, errorName: string) => {
    return this.menuOrderingForm.controls[controlName].hasError(errorName);
  }
  onBlur(): void {
    this.groupId.setErrors(null);
  }


  public changeSort(event: any) {
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {

        case 'slNo': {
          return item;
        }
        case 'parentMenuName': {
          return item.parentMenu.parentMenuName;
        }
        case 'groupName': {
          return item.roleGroup.roleGroupName;
        }

        default: return item[property as keyof MenuOrderingTableResponseContent];
      }
    };
  }

  k: number = 0
  l: number = 0

  //refresh
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  orderidchange() {
    if (this.OrderIdChangemap.size <= 0) {
      this.snackBar.open('Please select order ID', '', {

        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: 'center',


      });
    } else {
      this.OrderIdChangemap.forEach((value: any, key: any) => {
        orderIdChangeArray.push(value);
      });

      this.masterMenuOrderChange.masterMenuOrderDTOs = orderIdChangeArray;


      this.masterMenuOrderChange.masterMenuOrderDTOs.forEach(order => {

        var orId = order.orderId
        //Changed order id
        this.menuOrderingRespContent.filter(menus => {
          if (menus.orderId == orId) {
            //Master id for changed order id
            var masterId = menus.masterMenuId;



            var ind = this.menuOrderingRespContent.findIndex(ko => ko.masterMenuId === masterId)
            this.masterMenuOrderChange.masterMenuOrderDTOs.filter(oldId => {

              if (oldId.masterMenuId == masterId) {
                ++this.k;

              } else {
                ++this.l;
              }
            })

            // for (let i in this.menuOrderingRespContent) {
            //   if (this.menuOrderingRespContent[i].masterMenuId == masterId)
            // }
          }

        }

        )
      })
      if (this.k == this.masterMenuOrderChange.masterMenuOrderDTOs.length) {
        this.k = 0
        this.l = 0

        const encryptData = this.encryptAndDecrypt.encryptfinal(this.masterMenuOrderChange, this.encryptandDecryptkey);

        this.encryptDTO.data = encryptData;

        this.menusOrderingService.updateMasterMenuOrder(this.encryptDTO).subscribe(data => {

          const decryptData = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptandDecryptkey);

          this.snackBar.open('Menu order updated successfully', '', {

            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',


          });
        });

        this.reloadCurrentRoute();
      }

      else {
        this.k = 0
        this.l = 0
        this.snackBar.open('Order ID already exists', '', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',

          panelClass: 'center',


        });
      }


      //       }
      //     }
      //   }

      // }



      this.selectedOption = new Set<string>();

      orderIdChangeArray = []
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



  ngAfterContentChecked() {

    this.cdref.detectChanges();
  }


  getValue() {


    this.menusOrderingService.getGroupList().subscribe(data => {
      const decryptData = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptandDecryptkey);
      this.menusOrderingResp = JSON.parse(decryptData);
      // this.stateResponse = data;
      // this.stateList = this.stateResponse.result;
      this.menusOrderingResponseContent = this.menusOrderingResp.responseContent;
      this.groupnamelist1 = this.menusOrderingResponseContent;
      this.groupnamelist2 = this.menusOrderingResponseContent;
    });
  }

}