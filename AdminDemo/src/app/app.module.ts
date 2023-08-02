import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClient, HttpClientModule } from '@angular/common/http';



import { LoginComponent } from './login/login.component';




// import {MdcSelectModule} from '@angular-mdc/web/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MDCDataTableFoundation } from '@material/data-table/foundation';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSortModule } from '@angular/material/sort';

import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import 'hammerjs';
import { MatNativeDateModule } from '@angular/material/core';

import { MatTooltipModule } from '@angular/material/tooltip';

import { NgPreventCutCopyPasteModule } from 'ng-prevent-cut-copy-paste';







// import {AngularMaterial} from '@angular/material'
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';

import { DashboardModuleModule } from './dashboard-module/dashboard-module.module';
import { PageNoteFoundComponent } from './page-note-found/page-note-found.component';
import { HashLocationStrategy, LocationStrategy, TitleCasePipe } from '@angular/common';

import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { ResetPasswordComponentComponent } from './reset-password-component/reset-password-component.component';
import { EmailModuleModule } from './email-module/email-module.module';
import { AuthGuard } from './service/auth.guard';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LinkExpiredComponent } from './link-expired/link-expired.component';

import { CustomDatePipe } from './custom.datepipe';
import { ModelchangepopupComponent } from './modelchangepopup/modelchangepopup.component';
import { SingleSpaceDirective } from './directives/SingleSpace.directive';
import { NoSpaceDirective } from './directives/NoSpace.directive';
import { MycommonModule } from './mycommon/mycommon.module';
import { LowerCaseDirective } from './directives/lower-case.directive';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { AnniyamUserInterfaceComponent } from './dashboard-module/anniyam-user-interface/anniyam-user-interface.component';








@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNoteFoundComponent,
    ResetPasswordComponentComponent,
    LinkExpiredComponent,
    CustomDatePipe,
    ModelchangepopupComponent,
    
    WelcomePageComponent,
    AnniyamUserInterfaceComponent
   
   


  ],
  imports: [

    BrowserModule,
    NgxSpinnerModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxMatTimepickerModule,
    MatTooltipModule,
    NgPreventCutCopyPasteModule,

    MatSnackBarModule,
    // NoopAnimationsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatOptionModule,
    MatInputModule,
    // AngularMaterialModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatIconModule,
    MatSliderModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatMenuModule,
    DashboardModuleModule,
    MycommonModule,
    EmailModuleModule,
     
    // MDCDataTableFoundation
    // MdcSelectModule

  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },AuthGuard, TitleCasePipe],
   
  bootstrap: [AppComponent]
})
export class AppModule { }
//providers: [{provide:LocationStrategy,useClass:HashLocationStrategy}],