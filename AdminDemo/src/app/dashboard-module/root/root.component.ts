import { DialogConfig } from '@angular/cdk/dialog';
import { NgZone, AfterContentInit, AfterViewChecked, AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Mastermenudetails } from 'src/app/mastermenudetails';
import { ServicesService } from 'src/app/services.service';
import { Usermenudetails } from 'src/app/usermenudetails';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignInNavResponse } from 'src/app/sign-in-nav-response';
import { ProfileEditComponent } from '../profile-edit/profile-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { Global } from 'src/app/globalComponent/Global';
import { LogoutpopupComponent } from '../logoutpopup/logoutpopup.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { style } from '@angular/animations';

import { EncryptAndDecryptResponse } from 'src/app/encrypt-and-decrypt-response';
import { environment } from 'src/environments/environment';
import { MatMenuTrigger } from '@angular/material/menu';
import { EnvService } from 'src/app/service/env.service';
import { NotifyComponentComponent } from '../notify-component/notify-component.component';
import { ParentMenus } from 'src/app/parent-menus';
import { ResponseContentParentMenus } from 'src/app/response-content-parent-menus';
import { Observable, Subscription, fromEvent, interval, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { EncryptionAndDecryption } from 'src/app/encryption-and-decryption';
import { AnniyamUserInterfaceComponent } from '../anniyam-user-interface/anniyam-user-interface.component';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { element } from 'angular';
import { coerceStringArray } from '@angular/cdk/coercion';
import { CustomSnackbarService } from 'src/app/directives/customsnackBarService.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSubscription!: Subscription;
  dataSubscriptionNotification!: Subscription;
  signInNavResponse: SignInNavResponse = new SignInNavResponse();

  passwordChangestatus: SignInNavResponse = new SignInNavResponse();
  encryptAndDecrypt: EncryptionAndDecryption = new EncryptionAndDecryption();
  encryptAndDecryptResponse: EncryptAndDecryptResponse = new EncryptAndDecryptResponse();
  userMenulist: Mastermenudetails[] = [];
  userMenulist1: Mastermenudetails[] = [];
  userCount = 0;
  onResize!: any;
  encryptandDecryptkey!: string;
  defaultIcon = "iconsArtboard 1@2x.png";
  defaultAlterIcon = "iconsArtboard 19@2x.png";
  oldProfileIcon = "iconsArtboard 2@2x.png profile";
  alterProfileIcon = "iconsArtboard 20@2x.png profile";

  idleState = 'Not started.';
  userlogin = 0;
  timedOut = false;
  lastPing?: Date;

  mouse1Sub!: Subscription;
  mouse2Sub!: Subscription;
  keySub!: Subscription;
  touchSub!: Subscription;
  scrollSub!: Subscription;
  constructor(private snackBarService: CustomSnackbarService, private _ngZone: NgZone, private route: Router, private env: EnvService, private service: ServicesService, private spinnerService: NgxSpinnerService, private snackBar: MatSnackBar, private dialog: MatDialog, private idle: Idle, private keepalive: Keepalive) {

    //idle.setIdle(60);

    this.mouse1Sub = fromEvent(document, 'mousemove').subscribe(() => this.onInteraction());
    this.touchSub = fromEvent(document, 'touchstart').subscribe(() => this.onInteraction());
    this.keySub = fromEvent(document, 'keypress').subscribe(() => this.onInteraction());
    this.mouse2Sub = fromEvent(document, 'mousedown').subscribe(() => this.onInteraction());
    this.scrollSub = fromEvent(document, 'scroll').subscribe(() => this.onInteraction());


    idle.setIdle(900);

    this.env.isExpired = false;




    /////////.log(this.env.isExpired)

    if (this.env.isExpired == false) {
      if (this.snackBar._openedSnackBarRef?.instance.data.message === "Session expired") {
        this.snackBar._openedSnackBarRef.dismissWithAction();
      }
    }


    idle.setTimeout(120);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {

      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.idle.stop();
      this.dialog.closeAll();
      this.timedOut = true;
      this.env.isExpired = true;
      this.ProfileLogOut();
    });

    idle.onIdleStart.subscribe(() => {

      this.showSendTimerDialog();
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will be logged out in ' + countdown + ' seconds !'
    });

    // keepalive.interval(2000);
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();

    var det = sessionStorage.getItem('UserDetails') || '';
    if (det == null || det == "") {
      this.route.navigateByUrl("/")
    }
    this.route.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url == '/admin') {
          this.route.navigateByUrl("/Admin")
        }









      }

    });
    this.signInNavResponse = JSON.parse(sessionStorage.getItem('UserDetails') || '');

    
    



    this.userMenulist = this.signInNavResponse.responseContent.userMenuDtos;
    this.route.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.highlightHeader()
        this.changeIcon();
      }
    });

    this.userLogedIn();
  }


  onInteraction() {
    this.reset();
  }

  endUrl = ""
  currentUrl = ""
  currentId = ""
  previousHigh = "Dashboard"
  filterName = ""
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.currentUrl = this.route.url
      this.currentId = this.currentUrl.substring(7)
      var storedid = localStorage.getItem('CurrentUrl') as any
      var icon1 = localStorage.getItem('Icon1') as any
      var icon2 = localStorage.getItem('Icon2') as any
      this.endUrl = this.route.url
      if (this.currentId == "" || this.currentId == null) {
        if (document.getElementById(this.defaultIcon)?.style.display === 'block') {
          (document.getElementById(this.defaultIcon) as HTMLElement).style.display = 'none';
          (document.getElementById(this.defaultAlterIcon) as HTMLElement).style.display = 'block'
        }
        if (document.getElementById(this.previousHigh)?.style.background === 'none') {
          (document.getElementById(this.previousHigh) as HTMLElement).style.background = "rgb(232, 240, 254)";
        }
      } else {
        if (document.getElementById(icon1)?.style.display === 'block') {
          (document.getElementById(icon1) as HTMLElement).style.display = 'none';
          (document.getElementById(icon2) as HTMLElement).style.display = 'block'
        }
        if (document.getElementById(storedid)?.style.background === 'none') {
          (document.getElementById(storedid) as HTMLElement).style.background = "rgb(232, 240, 254)";
        }
      }
    }, 100)
    // this.service.passwordChangeRequest(this.signInNavResponse.responseContent.email).subscribe(data => {
    // });
  }
  Anniyam = "ANNIYAM";
  userprofile = "";

  userprofileinside = "";
  userprofileoutside = "";
  opennum = 0;
  pnameopen = ""
  dropdown = "";
  current = ""
  privious = ""
  arrowpre = ""
  ngOnInit() {

    ///////.log("hello root")

    this.display();


    this.service.checkPass().subscribe(encryptKeys => {
      const keys = encryptKeys.data;
      const keyValue1 = keys.split("//");
      const firstDecrypt = this.encryptAndDecrypt.decryptfinal(keyValue1[1].trim(), keyValue1[0].trim());
      const jsonString = JSON.parse(firstDecrypt);
      const finalkeyValue = jsonString.split("|");
      const finalkeyValue1 = finalkeyValue;


      this.encryptandDecryptkey = finalkeyValue1[0].trim();


    });









    ///////.log("lll")
    window.addEventListener('storage', (event) => {
      if (event.storageArea == localStorage) {
        let token = localStorage.getItem('signIn');
        if (token == undefined) {
        } else {


          this._ngZone.run(() => {
            this.route.navigate(['/']);
          });


        }
      }
    }, false);


    //this.route.routeReuseStrategy.shouldReuseRoute = () => { return false; };   // very very important 
    this.dataSubscription = timer(0, 15000).pipe(
      map(() => {



        const userEmailId = this.encryptAndDecrypt.encryptfinal(this.signInNavResponse.responseContent.email, this.encryptandDecryptkey);




        const encodeValue = encodeURIComponent(userEmailId);


        if (this.userlogin == 0) {


          this.userlogin = 1;

        }
        else {


          this.service.passwordChangeRequestStatus(encodeValue).subscribe(data => {



            const decryptRes = this.encryptAndDecrypt.decryptfinal(data.data, this.encryptandDecryptkey);



            this.passwordChangestatus = JSON.parse(decryptRes);
            if (this.passwordChangestatus.status == "Changed") {
              localStorage.clear();
              sessionStorage.clear();
              this._ngZone.run(() => {
                this.route.navigate(['/']);
              });
            }
          });
        }


        this.checkuserProfile();

      })
    ).subscribe();
    this.dataSubscriptionNotification = timer(0, 150).pipe(
      map(() => {

        this.display();


      })
    ).subscribe();
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
    this.dataSubscriptionNotification.unsubscribe();

    this.mouse1Sub.unsubscribe();
    this.mouse2Sub.unsubscribe();
    this.touchSub.unsubscribe();
    this.scrollSub.unsubscribe();
    this.keySub.unsubscribe();
  }
  profileIcon() {
    (document.getElementById(this.oldProfileIcon) as HTMLElement).style.display = 'none';
    (document.getElementById(this.alterProfileIcon) as HTMLElement).style.display = 'inline-block'
  }
  profileIcon2() {
    (document.getElementById(this.oldProfileIcon) as HTMLElement).style.display = 'inline-block';
    (document.getElementById(this.alterProfileIcon) as HTMLElement).style.display = 'none'
  }
  highlightHeader() {
    this.currentUrl = this.route.url;
    this.currentId = this.currentUrl.substring(7);
    var storedid = localStorage.getItem('CurrentUrl') as any
    this.userMenulist1 = this.signInNavResponse.responseContent.userMenuDtos
    this.userMenulist1.forEach(menus => {
      if (menus.userMenuDtos) {
        menus.userMenuDtos.forEach(submenus => {
          if (submenus.url == this.currentId) {
            //this.filterName = submenus.masterSubMenuName
            this.filterName = menus.menuName + " >> " + submenus.menuName;
          }
        })
      } else {
        if (menus.url == this.currentId) {
          this.filterName = menus.menuName;
          //this.filterName = menus.masterSubMenuName
        }

      }
    })
    if (document.getElementById(storedid)?.style.background === "rgb(232, 240, 254)") {
      (document.getElementById(storedid) as HTMLElement).style.background = 'none';
    }
    if (this.currentId == "" || this.currentId == null) {
      this.Anniyam = this.previousHigh;
      if (document.getElementById(this.previousHigh)?.style.background === 'none') {
        (document.getElementById(this.previousHigh) as HTMLElement).style.background = "rgb(232, 240, 254)";
      }
      localStorage.setItem('CurrentUrl', this.previousHigh)
    }
    else if (this.currentId == "ia/creation") {
      this.filterName = "Add IA"
      this.Anniyam = this.filterName;
    }
    else if (this.currentId == "notification") {
      this.filterName = "Account Details Update"
      this.Anniyam = this.filterName;
    }
    else if (this.currentId == "accountDetails") {
      this.filterName = "Account Details"
      this.Anniyam = this.filterName;
    }
    else {
      if (document.getElementById(this.filterName)?.style.background === 'none') {
        (document.getElementById(this.filterName) as HTMLElement).style.background = "rgb(232, 240, 254)";
      }
      this.Anniyam = this.filterName;
      localStorage.setItem('CurrentUrl', this.filterName)
    }
  }
  firstIcon: any
  secondIcon: any
  changeIcon() {
    var currentMenuUrl = this.route.url
    var currentMenuId = currentMenuUrl.substring(7)
    var storedid = localStorage.getItem('CurrentUrl') as any
    var icon1 = localStorage.getItem('Icon1') as any
    var icon2 = localStorage.getItem('Icon2') as any
    this.userMenulist1 = this.signInNavResponse.responseContent.userMenuDtos
    this.userMenulist1.forEach(menus => {
      if (menus.userMenuDtos) {
        menus.userMenuDtos.forEach(submenus => {
          if (submenus.url == currentMenuId) {
            this.firstIcon = menus.iconName
            this.secondIcon = menus.alternateIcon
          }
        })
      } else {
        if (menus.url == currentMenuId) {
          this.firstIcon = menus.iconName
          this.secondIcon = menus.alternateIcon
        }
      }
    })
    if (document.getElementById(icon1)?.style.display === 'none') {
      (document.getElementById(icon1) as HTMLElement).style.display = 'none';
      (document.getElementById(icon2) as HTMLElement).style.display = 'block'
    }
    if (document.getElementById(icon2)?.style.display === 'block') {
      (document.getElementById(icon2) as HTMLElement).style.display = 'none';
      (document.getElementById(icon1) as HTMLElement).style.display = 'block'
    }
    if (this.currentId == "" || this.currentId == null) {
      if (document.getElementById(this.defaultIcon)?.style.display === 'block') {
        (document.getElementById(this.defaultIcon) as HTMLElement).style.display = 'none';
        (document.getElementById(this.defaultAlterIcon) as HTMLElement).style.display = 'block'
      }
      localStorage.setItem('Icon1', this.defaultIcon)
      localStorage.setItem('Icon2', this.defaultAlterIcon)
    }
    else {
      if (document.getElementById(this.firstIcon)?.style.display === 'block') {
        (document.getElementById(this.firstIcon) as HTMLElement).style.display = 'none';
        (document.getElementById(this.secondIcon) as HTMLElement).style.display = 'block'
      }
      localStorage.setItem('Icon1', this.firstIcon)
      localStorage.setItem('Icon2', this.secondIcon)
    }
  }
  method1(cc: any) {
    this.highlightHeader();
  }
  colur(dashboard: any) {
    if (this.privious == null || this.privious == "") {
      this.current = dashboard;
      this.method1(dashboard);
    }
    else {
      if (this.privious == dashboard) {
        (document.getElementById(dashboard) as HTMLElement).style.background = "rgb(232, 240, 254)";
      }
      else {
        (document.getElementById(this.privious) as HTMLElement).style.background = "none";
        (document.getElementById(dashboard) as HTMLElement).style.background = "rgb(232, 240, 254)";
        this.privious = dashboard;
      }
    }
  }
  TogleCLick(ID: any) {
    if (document.getElementById(ID)?.style.display == "none") {
      (document.getElementById(ID) as HTMLElement).style.display = "block";
    }
    else {
      (document.getElementById(ID) as HTMLElement).style.display = "none";
    }
  }
  display() {
    ///////.log("display")
    //this.userprofile = this.signInNavResponse.responseContent.firstName+" "+this.signInNavResponse.responseContent.lastName;
    if (window.matchMedia('(max-width:500px)').matches) {
      ///////.log("mobile view ");
      (document.getElementById("title") as HTMLElement).style.fontSize = "15px";
      (document.getElementById("title") as HTMLElement).style.fontWeight = "500";

      (document.getElementById("personname") as HTMLElement).style.paddingRight = "0px";
      this.userprofile = "";

      (document.getElementById("personname") as HTMLElement).style.display = "block";

      (document.getElementById("personname") as HTMLElement).style.paddingBottom = "0px";



    }



    else {

      (document.getElementById("title") as HTMLElement).style.fontSize = "17px";
      (document.getElementById("title") as HTMLElement).style.fontWeight = "400";



      if (this.userprofile.length >= 50) {



        (document.getElementById("personname") as HTMLElement).style.display = "block";
        (document.getElementById("personname") as HTMLElement).style.paddingRight = "380px";
        (document.getElementById("personname") as HTMLElement).style.paddingBottom = "5px";

      }
      else {

        if (this.userprofile.length >= 10 && this.userprofile.length <= 20) {


          (document.getElementById("personname") as HTMLElement).style.display = "block";
          (document.getElementById("personname") as HTMLElement).style.paddingRight = "110px";
          (document.getElementById("personname") as HTMLElement).style.paddingBottom = "5px";

        }

        else if (this.userprofile.length >= 20 && this.userprofile.length <= 30) {


          (document.getElementById("personname") as HTMLElement).style.display = "block";
          (document.getElementById("personname") as HTMLElement).style.paddingRight = "160px";
          (document.getElementById("personname") as HTMLElement).style.paddingBottom = "5px";
        }

        else if (this.userprofile.length >= 30 && this.userprofile.length <= 40) {

          (document.getElementById("personname") as HTMLElement).style.display = "block";
          (document.getElementById("personname") as HTMLElement).style.paddingRight = "250px";
          (document.getElementById("personname") as HTMLElement).style.paddingBottom = "5px";
        }

        else if (this.userprofile.length >= 40 && this.userprofile.length <= 50) {

          (document.getElementById("personname") as HTMLElement).style.display = "block";
          (document.getElementById("personname") as HTMLElement).style.paddingRight = "270px";
          (document.getElementById("personname") as HTMLElement).style.paddingBottom = "5px";
        }
        else {

          (document.getElementById("personname") as HTMLElement).style.display = "block";
          (document.getElementById("personname") as HTMLElement).style.paddingRight = "50px";
          (document.getElementById("personname") as HTMLElement).style.paddingBottom = "5px";
        }




      }

      this.userprofile = this.signInNavResponse.responseContent.firstName + " " + this.signInNavResponse.responseContent.lastName;


    }




  }
  urlGet(URLNamenavigate: string, menuName: string, icon1: any, icon2: any) {
    this.changeIcon();
    this.dropdown = menuName;
    for (let i = 0; i < this.signInNavResponse.responseContent.userMenuDtos.length; i++) {
      if (this.signInNavResponse.responseContent.userMenuDtos[i].url == null) {
        if (document.getElementById(this.signInNavResponse.responseContent.userMenuDtos[i].parentMenuId)?.style.display == 'block') {
          (document.getElementById(this.signInNavResponse.responseContent.userMenuDtos[i].parentMenuId) as HTMLElement).style.display = "none";
          (document.getElementById(this.signInNavResponse.responseContent.userMenuDtos[i].iconName) as HTMLElement).style.transform = "none";
        }
        else {
          (document.getElementById(this.signInNavResponse.responseContent.userMenuDtos[i].parentMenuId) as HTMLElement).style.display = "none"
        }
      }
    }

    this.route.navigate(['Admin/' + URLNamenavigate]);
    this.Anniyam = menuName;
    localStorage.setItem("headerName", menuName)
    if (window.matchMedia('(max-width: 991px)').matches) {
      if (document.querySelector('.mdc-drawer.mdc-drawer--dismissible')?.classList.contains('mdc-drawer--open')) {
        document.querySelector('.mdc-drawer.mdc-drawer--dismissible')?.classList.remove('mdc-drawer--open');
      }
    }
  }
  urlGet1(URLNamenavigate: string, masterSubMenuName: string, id: any, iconName: any) {
    iconName = iconName + "_transform";
    var menuParents = document.querySelectorAll(".mdc-expansion-panel");
    menuParents.forEach(menuParent => {
      menuParent.addEventListener("click",
        function (event) {
          // if (document.getElementById(id)?.style.display == "none") {
          //   (document.getElementById(id) as HTMLElement).style.display = "block";
          //   (document.getElementById(iconName) as HTMLElement).style.transform = "rotate(90deg)";
          // }
        }
      )
    })
    this.dropdown = masterSubMenuName;

    this.route.navigate(['Admin/' + URLNamenavigate]);
    this.Anniyam = masterSubMenuName;
    localStorage.setItem("headerName", masterSubMenuName)
    if (window.matchMedia('(max-width: 991px)').matches) {
      if (document.querySelector('.mdc-drawer.mdc-drawer--dismissible')?.classList.contains('mdc-drawer--open')) {
        document.querySelector('.mdc-drawer.mdc-drawer--dismissible')?.classList.remove('mdc-drawer--open');
      }
    }
  }
  arrowdropdown(pname: string) {
    if (this.opennum == 0) {
      this.pnameopen = pname;
      this.opennum = this.opennum + 1;
    }
    else {
      if (document.getElementById(pname)?.style.display == "block") {
        (document.getElementById(this.pnameopen) as HTMLElement).style.display = "none";
        this.pnameopen = pname;
        this.opennum = this.opennum + 1;
      }
    }
  }
  colur1(dashboard: any) {
    if (this.privious == null || this.privious == "") {
      this.current = dashboard;
      this.method1(dashboard);
    }
    else {
      if (this.privious == dashboard) {
        (document.getElementById(dashboard) as HTMLElement).style.background = "rgb(232, 240, 254)";
      }
      else {
        (document.getElementById(this.privious) as HTMLElement).style.background = "none";
        (document.getElementById(dashboard) as HTMLElement).style.background = "rgb(232, 240, 254)";
        this.privious = dashboard;
      }
    }
  }
  hide() {
    if (window.matchMedia('(max-width: 991px)').matches) {
      if (document.querySelector('.mdc-drawer.mdc-drawer--dismissible')?.classList.contains('mdc-drawer--open')) {
        document.querySelector('.mdc-drawer.mdc-drawer--dismissible')?.classList.remove('mdc-drawer--open');
      }
    }
  }
  arrow(iconName: any) {
    if ((document.getElementById(iconName)?.style.transform == 'none')) {
      (document.getElementById(iconName) as HTMLElement).style.display = "none";
      (document.getElementById(iconName) as HTMLElement).style.transform = "rotate(90deg)";
    }
    else {
      (document.getElementById(iconName) as HTMLElement).style.transform = "none";
    }
  }
  prevIcon: any
  colur3(dashboard: any, iconname: any) {
    iconname = iconname + "_transform";
    this.prevIcon = iconname;
    var a = localStorage.getItem('arrowGet') as any;


    if (a != null) {
      if (iconname != a) {
        (document.getElementById(a) as HTMLElement).style.transform = "none";
      }
    }



    if (this.arrowpre == null || this.arrowpre == "") {
      if (document.getElementById(dashboard)?.style.display == "none") {
        this.method2(dashboard, iconname);
        (document.getElementById(iconname) as HTMLElement).style.transform = "rotate(90deg)";
        (document.getElementById(dashboard) as HTMLElement).style.display = "block";
      } else {
        (document.getElementById(dashboard) as HTMLElement).style.display = "none";
        (document.getElementById(iconname) as HTMLElement).style.transform = "none";
      }
      this.method2(dashboard, iconname);

    }
    else {
      if (this.arrowpre == dashboard) {
        if (document.getElementById(dashboard)?.style.display == "none") {
          (document.getElementById(iconname) as HTMLElement).style.transform = "rotate(90deg)";
          (document.getElementById(dashboard) as HTMLElement).style.display = "block";
        }
        else {
          (document.getElementById(iconname) as HTMLElement).style.transform = "none";
          (document.getElementById(dashboard) as HTMLElement).style.display = "none";
        }
      }
      else {
        (document.getElementById(this.arrowpre) as HTMLElement).style.display = "none";
        (document.getElementById(this.prevIcon) as HTMLElement).style.transform = "none";
        if (document.getElementById(dashboard)?.style.display == "none") {
          (document.getElementById(iconname) as HTMLElement).style.transform = "rotate(90deg)";
          (document.getElementById(dashboard) as HTMLElement).style.display = "block";
        }
        this.arrowpre = dashboard;
        this.prevIcon = iconname;
      }
    }
    localStorage.setItem('arrowGet', iconname)
  }
  method2(cc: any, icon: any) {
    this.arrowpre = cc;
    this.prevIcon = icon;
  }
  profile() {
  }
  ProfileLogOut() {

    this.dialog.closeAll();

    this.spinnerService.show();
    ///////.log(this.signInNavResponse.responseContent.id)
    const encryptData = this.encryptAndDecrypt.encryptfinal(this.signInNavResponse.responseContent.id, this.encryptandDecryptkey);
    const encodeValue = encodeURIComponent(encryptData);
    this.service.userLogOut(encodeValue).subscribe(resposne => {

      /////.log("user log out ");
      /////.log(resposne);
      const decryptData = this.encryptAndDecrypt.decryptfinal(resposne.data, this.encryptandDecryptkey);
      this.encryptAndDecryptResponse = JSON.parse(decryptData);

      /////.log(decryptData);
      this.spinnerService.hide();
      if (this.encryptAndDecryptResponse.statusCode == 200) {
        // this.snackBar.open("User logged out successfully", '',
        //   {
        //     horizontalPosition: 'center',
        //     verticalPosition: 'top',
        //     duration: 3000,
        //     panelClass: 'center',


        //   });
        if (this.env.isExpired == false) {
          this.snackBar.open("User logged out successfully", '',
            {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000,
              panelClass: 'center',
            });
        }
        sessionStorage.clear();
        localStorage.clear();
        this._ngZone.run(() => {
          this.route.navigate(['/']);
        });
      }
      else {
        this.snackBar.open(this.encryptAndDecryptResponse.message, '',
          {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000,
            panelClass: 'center',
          });
      }
    })
  }
  openConfirmDialog() {
    const dialogRef = this.dialog.open(LogoutpopupComponent, {
      width: '400px',
      autoFocus: false,
      data: {
        message: 'Are you sure want to logout ?'
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.ProfileLogOut();
      }
    });
  }
  changePassword() {
    this.route.navigateByUrl("/change_password")
  }
  edit(firstName: string, lastName: string, username: string, mobileNo: string, email: string) {
    const dialogRef = this.dialog.open(ProfileEditComponent,
      {
        width: '335px',
        height: '480px',
        data: { firstName: firstName, lastName: lastName, username: username, mobileNo: mobileNo, email: email }
      })
  }
  noti() {
    if (window.matchMedia('(max-width: 991px)').matches) {
      if (document.querySelector('.mdc-menu mdc-menu-surface')?.classList.contains('mdc-menu-surface--open')) {
        document.querySelector('.mdc-menu mdc-menu-surface')?.classList.remove('mdc-menu-surface--open');
      }
    }
  }
  sur() {
    (document.getElementById("surfa") as HTMLElement).style.display = "block";
  }
  write() {
  }


  userLogedIn() {


    // if (window.matchMedia('(max-width:400px)').matches) {



    // }
    // else {

    if (window.matchMedia('(min-width:850px)').matches) {


      const snackMessage = sessionStorage.getItem('Q@123$></');
      if (snackMessage == "<>/{QWERGTSV#}") {
        const userN = this.signInNavResponse.responseContent.username.split("@");
        const name = userN[0].replace(".", "  ");
        const userNameResponse = name.replace(/\b\w/g, (x: string) => x.toUpperCase());
        sessionStorage.setItem('Q@123$></', "<>/!@#dmnUd");
        this.snackBarService.open("Hi,"+"  "+userNameResponse);
        
      }
      else {


        // const userN = this.signInNavResponse.responseContent.username.split("@");
        // const name = userN[0].replace(".", "  ");
        // const userNameResponse = name.replace(/\b\w/g, (x: string) => x.toUpperCase());

        // this.snackBarService.open("Hi.,"+"  "+userNameResponse);


      }

    }







    //  this.snackBar.open("Hii Gokulakrishnan ", '',
    //       {
    //         horizontalPosition: 'center',
    //         verticalPosition: 'top',
    //         duration: 3000,
    //         panelClass: 'center',
    //       });

    // 

    // if (first == '1') {


    //   /////////.log("user root " + first);

    //   // const dialogRef = this.dialog.open(AnniyamUserInterfaceComponent, {
    //   //   width: '400px',
    //   //   autoFocus: false,
    //   //   data: {
    //   //     message: 'Money Purse '
    //   //   }
    //   // });



    // 
    // }


    // 





    // if(this.userCount == 0)
    // {


    //   /////////.log(this.userCount)

    //   this.userCount=this.userCount+1;
    // this.snackBar.open("log in", '',
    //       {
    //         horizontalPosition: 'center',
    //         verticalPosition: 'top',
    //         duration: 3000,
    //         panelClass: 'center',
    //       });
    // }

  }

  reset() {
    this.idle.watch();
    this.timedOut = false;
  }

  showSendTimerDialog(): void {
    (document.getElementById('myModal') as HTMLElement).style.display = 'block'
  }


  hideSessionModal() {
    (document.getElementById('myModal') as HTMLElement).style.display = 'none'
  }


  checkuserProfile() {



    // this.service.fetchUserDetails(this.signInNavResponse.responseContent.id).subscribe(res => {






    //   // const resposne  = this.encryptAndDecrypt.decryptfinal(res.data,"fdff");

    //   // const jsonResposne = JSON.parse(resposne);


    //   this.signInNavResponse.responseContent.firstName = res.responseContent.firstName;
    //   this.signInNavResponse.responseContent.lastName = res.responseContent.lastName


    //   this.signInNavResponse.responseContent.mobileNo = res.responseContent.mobile
    //  


    // })
    // {

    // }


  }



}