import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';

import { MatTooltipModule } from '@angular/material/tooltip';
import { DashboardModuleRoutingModule } from './dashboard-module-routing.module';
import { ViewIaComponent } from './view-ia/view-ia.component';
import { CreateIaComponent } from './create-ia/create-ia.component';
import { IaDetailComponent } from './ia-detail/ia-detail.component';
import { BankBranchDetailComponent } from './bank-branch-detail/bank-branch-detail.component';
import { BalanceFtComponent } from './balance-ft/balance-ft.component';
import { StatementFtComponent } from './statement-ft/statement-ft.component';

import { SampleRechargeComponent } from './sample-recharge/sample-recharge.component';
import { BalanceRechargeComponent } from './balance-recharge/balance-recharge.component';
import { ShgDeleteComponent } from './shg-delete/shg-delete.component';
import { ShgDeleteMemberComponent } from './shg-delete-member/shg-delete-member.component';
import { RegisterComponent } from './register/register.component';
import { RootComponent } from './root/root.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ViewTicketsComponent } from './view-tickets/view-tickets.component';
import { MerchantDetailsComponent } from './merchant-details/merchant-details.component';
import { TransactionStatusComponent } from './transaction-status/transaction-status.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { BankBranchAdditionComponent } from './bank-branch-addition/bank-branch-addition.component';
import { PanchayatAdditionComponent } from './panchayat-addition/panchayat-addition.component';
import { VillageAdditionComponent } from './village-addition/village-addition.component';
import { UnmappingComponent } from './unmapping/unmapping.component';
import { ModelChangeComponent } from './model-change/model-change.component';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { GroupComponent } from './group/group.component';
import { RoleComponent } from './role/role.component';
import { ParentMenusComponent } from './parent-menus/parent-menus.component';
import { MasterMenusComponent } from './master-menus/master-menus.component';
import { AssignMenusComponent } from './assign-menus/assign-menus.component';

import { MenusorderingComponent } from './menusordering/menusordering.component';
import { PennyComponent } from './pennydrop-ft/pennydrop-ft.component';
import { PopUpComponentComponent } from './pop-up-component/pop-up-component.component';

import { Exceptionclass } from '../exceptionclass';
import { ViewEditPopupComponent } from './view-edit-popup/view-edit-popup.component';
import { IaviewViewPopuoComponent } from './iaview-view-popuo/iaview-view-popuo.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DeletePopupComponent } from './delete-popup/delete-popup.component';
import { ConfirmDialogComponentComponent } from './confirm-dialog-component/confirm-dialog-component.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { GroupEditPopupComponent } from './group-edit-popup/group-edit-popup.component';
import { RoleEditPopupComponent } from './role-edit-popup/role-edit-popup.component';
import { ParentMenuPopupComponent } from './parent-menu-popup/parent-menu-popup.component';
import { MasterMenuEditPopupComponent } from './master-menu-edit-popup/master-menu-edit-popup.component';
import { GroupDeletePopupComponent } from './group-delete-popup/group-delete-popup.component';
import { RoleDeletePopupComponent } from './role-delete-popup/role-delete-popup.component';
import { ParentMenuDeletePopupComponent } from './parent-menu-delete-popup/parent-menu-delete-popup.component';
import { MastermenuDeletePopupComponent } from './mastermenu-delete-popup/mastermenu-delete-popup.component'
import { AuthGuard } from '../service/auth.guard';
import { NgxSpinnerModule } from 'ngx-spinner';


import { NgPreventCutCopyPasteModule } from 'ng-prevent-cut-copy-paste';
import { MatTableExporterModule } from 'mat-table-exporter';
import { OnlyNumberDirective } from '../directives/only-number.directive';
import { OnlyAlphanumericDirective } from '../directives/only-alphanumeric.directive';
import { CharacterDirective } from '../directives/character.directive';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { UnmappingRequestPopUpComponent } from './unmapping-request-pop-up/unmapping-request-pop-up.component';
import { MatSelectSearchModule } from 'mat-select-search';
import { LogoutpopupComponent } from './logoutpopup/logoutpopup.component';
import { ShgAndPayoutComponent } from './shg-and-payout/shg-and-payout.component';
import { DMTComponent } from './dmt/dmt.component';
import { BBPSComponent } from './bbps/bbps.component';
import { RechargeComponent } from './recharge/recharge.component';
import { AepsAndMATMComponent } from './aeps-and-matm/aeps-and-matm.component';
import { WalletHistoryComponent } from './wallet-history/wallet-history.component';
import { WalletBalanceComponent } from './wallet-balance/wallet-balance.component';
import { WalletTopupComponent } from './wallet-topup/wallet-topup.component';
import { WalletincentiveComponent } from './walletincentive/walletincentive.component';
import { AdminResetPasswordComponent } from './admin-reset-password/admin-reset-password.component';
import { PasswordReset } from '../password-reset';
import { PaymentFTComponent } from './payment-ft/payment-ft.component';
import { PaymentConfirmationPopupComponent } from './payment-confirmation-popup/payment-confirmation-popup.component';
import { PaymentAddAccountComponentComponent } from './payment-add-account-component/payment-add-account-component.component';
import { NotificationComponentComponent } from './notification-component/notification-component.component';
import { PaymentconfirmationFromUserComponent } from './paymentconfirmation-from-user/paymentconfirmation-from-user.component';
import { PanComponent } from './pan/pan.component';
import { DigitalGoldComponent } from './digital-gold/digital-gold.component';
import { PaymentReportComponent } from './payment-report/payment-report.component';
import { UpperCaseInputDirective } from '../directives/capital.directive';
import { TitleCaseDirective } from '../directives/TitleCase.directive';
import { EnvServiceProvider } from '../service/env.service.provider';
import { AddAccountPopUpComponentComponent } from './add-account-pop-up-component/add-account-pop-up-component.component';
import { NotifyComponentComponent } from './notify-component/notify-component.component';

import { MatBadgeModule } from '@angular/material/badge';
import { NotificationPopupComponentComponent } from './notification-popup-component/notification-popup-component.component';
import { SingleSpaceDirective } from '../directives/SingleSpace.directive';
import { NoSpaceDirective } from '../directives/NoSpace.directive';
import { MycommonModule } from '../mycommon/mycommon.module';
import { ModelChangeConfirmationPopupComponent } from './model-change-confirmation-popup/model-change-confirmation-popup.component';
import { BeneficiaryAccountDetailsComponent } from './beneficiary-account-details/beneficiary-account-details.component';
import { BeneficiaryInfoPopupComponent } from './beneficiary-info-popup/beneficiary-info-popup.component';
import { AccountDetailsViewPopupComponent } from './account-details-view-popup/account-details-view-popup.component';
import { ReportPopupComponent } from './report-popup/report-popup.component';
import { StatementWalletBalanceComponent } from './statement-wallet-balance/statement-wallet-balance.component';
import { ShgsCountComponent } from './shgs-count/shgs-count.component';
import { SavingsLoanComponent } from './savings-loan/savings-loan.component';
import { AnniyamUserInterfaceComponent } from './anniyam-user-interface/anniyam-user-interface.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { CustomSnackbarComponent } from '../directives/customSnackBar.component';
import { CustomSnackbarService } from '../directives/customsnackBarService.service';
import { MerchantTopUpComponent } from './merchant-top-up/merchant-top-up.component';
import { MerchantpopUpViewComponent } from './merchantpop-up-view/merchantpop-up-view.component';
import { MerchantTopUpConfirmationComponent } from './merchant-top-up-confirmation/merchant-top-up-confirmation.component';


// import { MatTableExporterModule } from 'mat-table-exporter';




@NgModule({
  declarations: [
    ViewIaComponent,
    CreateIaComponent,
    IaDetailComponent,
    BankBranchDetailComponent,
    BalanceFtComponent,
    StatementFtComponent,
    SampleRechargeComponent,
    PennyComponent,
    BalanceRechargeComponent,
    ShgDeleteComponent,
    ShgDeleteMemberComponent,
    RegisterComponent,
    RootComponent,
    ViewTicketsComponent,
    MerchantDetailsComponent,
    TransactionStatusComponent,
    TransactionDetailsComponent,
    BankBranchAdditionComponent,
    PanchayatAdditionComponent,
    VillageAdditionComponent,
    UnmappingComponent,
    ModelChangeComponent,
    GroupComponent,
    RoleComponent,
    ParentMenusComponent,
    MasterMenusComponent,
    AssignMenusComponent,

    CustomSnackbarComponent,

    MenusorderingComponent,
    PopUpComponentComponent,
    ViewEditPopupComponent,
    IaviewViewPopuoComponent,
    DeletePopupComponent,
    ConfirmDialogComponentComponent,
    GroupEditPopupComponent,
    RoleEditPopupComponent,
    ParentMenuPopupComponent,
    MasterMenuEditPopupComponent,
    GroupDeletePopupComponent,
    RoleDeletePopupComponent,
    ParentMenuDeletePopupComponent,
    MastermenuDeletePopupComponent,
    OnlyNumberDirective, OnlyAlphanumericDirective, CharacterDirective, UpperCaseInputDirective, TitleCaseDirective, ProfileEditComponent, UnmappingRequestPopUpComponent, LogoutpopupComponent,
    ShgAndPayoutComponent, DMTComponent, BBPSComponent, RechargeComponent, AepsAndMATMComponent, WalletHistoryComponent, WalletBalanceComponent, WalletTopupComponent, WalletincentiveComponent, AdminResetPasswordComponent, PaymentFTComponent, PaymentConfirmationPopupComponent, PaymentAddAccountComponentComponent, NotificationComponentComponent, PaymentconfirmationFromUserComponent, PanComponent, DigitalGoldComponent, PaymentReportComponent, AddAccountPopUpComponentComponent, NotifyComponentComponent, NotificationPopupComponentComponent, ModelChangeConfirmationPopupComponent, BeneficiaryAccountDetailsComponent, BeneficiaryInfoPopupComponent, AccountDetailsViewPopupComponent, ReportPopupComponent, StatementWalletBalanceComponent, ShgsCountComponent, SavingsLoanComponent, MerchantTopUpComponent, MerchantpopUpViewComponent, MerchantTopUpConfirmationComponent

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableExporterModule,
    MatBadgeModule,

    NgPreventCutCopyPasteModule,

    MatDialogModule,


    NgxSpinnerModule,
    MatSnackBarModule,

    CommonModule,

    MatSelectSearchModule,
    ReactiveFormsModule,
    NgxMatTimepickerModule,
    FormsModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatOptionModule,
    MatInputModule,
    HttpClientModule,
    DashboardModuleRoutingModule,
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
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatOptionModule,
    MatInputModule,
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
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MycommonModule,
    NgIdleKeepaliveModule.forRoot(),



  ],
  entryComponents:[CustomSnackbarComponent],

  exports: [RootComponent,
    RegisterComponent,
    ShgDeleteMemberComponent,
    ShgDeleteComponent,
    BalanceRechargeComponent,
    SampleRechargeComponent,

  

    // new page 
    ShgAndPayoutComponent,
    DMTComponent,
    BBPSComponent,
    RechargeComponent,
    AepsAndMATMComponent,
    WalletHistoryComponent,
    WalletBalanceComponent,
    WalletTopupComponent,
    WalletincentiveComponent,
    AdminResetPasswordComponent,



    StatementFtComponent,
    BalanceFtComponent,
    BankBranchDetailComponent,
    IaDetailComponent,
    CreateIaComponent,
    PennyComponent,
    ViewIaComponent,
    TransactionStatusComponent,
    BankBranchAdditionComponent,
    MerchantDetailsComponent,
    ModelChangeComponent,
    PanchayatAdditionComponent,
    TransactionDetailsComponent,
    UnmappingComponent,
    ViewTicketsComponent,
    VillageAdditionComponent,
    GroupComponent,
    RoleComponent,
    ParentMenusComponent, MasterMenusComponent, AssignMenusComponent, MenusorderingComponent, ProfileEditComponent,
    PaymentFTComponent, PaymentConfirmationPopupComponent, NotificationComponentComponent, PaymentAddAccountComponentComponent,
    PaymentconfirmationFromUserComponent, PanComponent, DigitalGoldComponent,MerchantTopUpComponent],
  bootstrap: [RootComponent],
  providers: [AuthGuard, EnvServiceProvider,CustomSnackbarService]
})
export class DashboardModuleModule { }


//providers:[{provide:ErrorHandler,useClass:GroupComponent}]