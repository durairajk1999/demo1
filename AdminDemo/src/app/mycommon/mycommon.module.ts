import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoSpaceDirective } from '../directives/NoSpace.directive';
import { SingleSpaceDirective } from '../directives/SingleSpace.directive';
import { NumberAndDotDirective } from '../directives/NumberAndDot.directive';
import { FormatAmountPipe } from '../directives/format-amount.pipe';
import { FormatTimePipe } from '../directives/format-time.pipe';
import { IaAddressDirective } from '../directives/address.directive';
import { PaymentAddressDirective } from '../directives/paymentaddress.directive';
import { RemarksDirective } from '../directives/remarks.directive';
import { LowerCaseDirective } from '../directives/lower-case.directive';



@NgModule({
  declarations: [NoSpaceDirective,SingleSpaceDirective,NumberAndDotDirective,FormatAmountPipe,FormatTimePipe,IaAddressDirective,PaymentAddressDirective,RemarksDirective,LowerCaseDirective],
  imports: [
    CommonModule
  ],
  exports: [NoSpaceDirective,SingleSpaceDirective,NumberAndDotDirective,FormatAmountPipe,FormatTimePipe,IaAddressDirective,PaymentAddressDirective,RemarksDirective,LowerCaseDirective]
})
export class MycommonModule { }
