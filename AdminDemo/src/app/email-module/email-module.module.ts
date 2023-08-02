

import { ErrorHandler, NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailModuleRoutingModule } from './email-module-routing.module';
import {MatTooltipModule} from '@angular/material/tooltip';

import { EmailComponent } from './email/email.component';
import { EmailverificationComponent } from './emailverification/emailverification.component';
import { NewPasswordComponent } from './new-password/new-password.component';
import { EmailRootComponent } from './email-root/email-root.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { AppRoutingModule } from '../app-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { NoSpaceDirective } from '../directives/NoSpace.directive';
import { DashboardModuleModule } from '../dashboard-module/dashboard-module.module';
import { MycommonModule } from '../mycommon/mycommon.module';



@NgModule({
  declarations: [
  
    EmailComponent,
    EmailverificationComponent,
    NewPasswordComponent,
    EmailRootComponent,
  
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    EmailModuleRoutingModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MycommonModule
    
  ],
  exports:[EmailComponent,EmailverificationComponent,NewPasswordComponent,EmailRootComponent],
  bootstrap:[EmailRootComponent]
})
export class EmailModuleModule { }
