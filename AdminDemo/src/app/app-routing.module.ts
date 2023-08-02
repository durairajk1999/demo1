import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminResetPasswordComponent } from './dashboard-module/admin-reset-password/admin-reset-password.component';


import { AepsAndMATMComponent } from './dashboard-module/aeps-and-matm/aeps-and-matm.component';

import { AssignMenusComponent } from './dashboard-module/assign-menus/assign-menus.component';


import { BalanceFtComponent } from './dashboard-module/balance-ft/balance-ft.component';
import { BalanceRechargeComponent } from './dashboard-module/balance-recharge/balance-recharge.component';
import { BankBranchAdditionComponent } from './dashboard-module/bank-branch-addition/bank-branch-addition.component';
import { BankBranchDetailComponent } from './dashboard-module/bank-branch-detail/bank-branch-detail.component';
import { BBPSComponent } from './dashboard-module/bbps/bbps.component';
import { CreateIaComponent } from './dashboard-module/create-ia/create-ia.component';
import { DigitalGoldComponent } from './dashboard-module/digital-gold/digital-gold.component';

import { DMTComponent } from './dashboard-module/dmt/dmt.component';
import { GroupComponent } from './dashboard-module/group/group.component';
import { IaDetailComponent } from './dashboard-module/ia-detail/ia-detail.component';
import { MasterMenusComponent } from './dashboard-module/master-menus/master-menus.component';
import { MenusorderingComponent } from './dashboard-module/menusordering/menusordering.component';
import { MerchantDetailsComponent } from './dashboard-module/merchant-details/merchant-details.component';
import { ModelChangeComponent } from './dashboard-module/model-change/model-change.component';
import { NotificationComponentComponent } from './dashboard-module/notification-component/notification-component.component';
import { PanComponent } from './dashboard-module/pan/pan.component';
import { PanchayatAdditionComponent } from './dashboard-module/panchayat-addition/panchayat-addition.component';
import { ParentMenusComponent } from './dashboard-module/parent-menus/parent-menus.component';
import { PaymentAddAccountComponentComponent } from './dashboard-module/payment-add-account-component/payment-add-account-component.component';
import { PaymentFTComponent } from './dashboard-module/payment-ft/payment-ft.component';
import { PaymentReportComponent } from './dashboard-module/payment-report/payment-report.component';
import { PennyComponent } from './dashboard-module/pennydrop-ft/pennydrop-ft.component';
import { RechargeComponent } from './dashboard-module/recharge/recharge.component';

import { RegisterComponent } from './dashboard-module/register/register.component';
import { RoleComponent } from './dashboard-module/role/role.component';
import { RootComponent } from './dashboard-module/root/root.component';
import { SampleRechargeComponent } from './dashboard-module/sample-recharge/sample-recharge.component';
import { ShgAndPayoutComponent } from './dashboard-module/shg-and-payout/shg-and-payout.component';
import { ShgDeleteMemberComponent } from './dashboard-module/shg-delete-member/shg-delete-member.component';
import { ShgDeleteComponent } from './dashboard-module/shg-delete/shg-delete.component';
import { StatementFtComponent } from './dashboard-module/statement-ft/statement-ft.component';
import { TransactionDetailsComponent } from './dashboard-module/transaction-details/transaction-details.component';
import { TransactionStatusComponent } from './dashboard-module/transaction-status/transaction-status.component';
import { UnmappingComponent } from './dashboard-module/unmapping/unmapping.component';
import { ViewIaComponent } from './dashboard-module/view-ia/view-ia.component';
import { ViewTicketsComponent } from './dashboard-module/view-tickets/view-tickets.component';
import { VillageAdditionComponent } from './dashboard-module/village-addition/village-addition.component';
import { WalletBalanceComponent } from './dashboard-module/wallet-balance/wallet-balance.component';
import { WalletHistoryComponent } from './dashboard-module/wallet-history/wallet-history.component';
import { WalletTopupComponent } from './dashboard-module/wallet-topup/wallet-topup.component';
import { WalletincentiveComponent } from './dashboard-module/walletincentive/walletincentive.component';

import { EmailComponent } from './email-module/email/email.component';

import { NewPasswordComponent } from './email-module/new-password/new-password.component';
import { LinkExpiredComponent } from './link-expired/link-expired.component';
import { LoginComponent } from './login/login.component';
import { PageNoteFoundComponent } from './page-note-found/page-note-found.component';
import { ResetPasswordComponentComponent } from './reset-password-component/reset-password-component.component';
import { AuthGuard } from './service/auth.guard';
import { BeneficiaryAccountDetailsComponent } from './dashboard-module/beneficiary-account-details/beneficiary-account-details.component';
import { StatementWalletBalanceComponent } from './dashboard-module/statement-wallet-balance/statement-wallet-balance.component';
import { ShgsCountComponent } from './dashboard-module/shgs-count/shgs-count.component';
import { SavingsLoanComponent } from './dashboard-module/savings-loan/savings-loan.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { AnniyamUserInterfaceComponent } from './dashboard-module/anniyam-user-interface/anniyam-user-interface.component';
import { MerchantTopUpComponent } from './dashboard-module/merchant-top-up/merchant-top-up.component';


const routes: Routes = [
  { path: "", redirectTo: 'admin', pathMatch: 'full' },
  { path: "admin", component: LoginComponent },

  {
    path: "change_password", component: ResetPasswordComponentComponent
  },

  {
    path: "password_reset", component: EmailComponent
  },
  {
    path: "password_reset/:id", component: NewPasswordComponent

  },

  {
    path: "welcome", component: WelcomePageComponent

  },

  {
    path: "Anniyam", component: AnniyamUserInterfaceComponent

  },




  {
    path: "Admin", component: RootComponent, canActivate: [AuthGuard],
    children: [
      {
        path: "ia/view", component: ViewIaComponent, canActivate: [AuthGuard],
      },
      {
        path: "ia/creation", component: CreateIaComponent, canActivate: [AuthGuard],
      },
      {
        path: "ia/details", component: IaDetailComponent, canActivate: [AuthGuard],
      },
      {
        path: "bankBranchDetails", component: BankBranchDetailComponent, canActivate: [AuthGuard],
      },
      {
        path: "ft/balance", component: BalanceFtComponent, canActivate: [AuthGuard],
      },
      {
        path: "ft/statement", component: StatementFtComponent, canActivate: [AuthGuard],
      },
      {
        path: "ft/pennyDrop", component: PennyComponent, canActivate: [AuthGuard],
      },
      {
        path: "sampleRecharge", component: SampleRechargeComponent, canActivate: [AuthGuard],
      },
      {
        path: "rechargeBalance", component: BalanceRechargeComponent, canActivate: [AuthGuard],
      },
      {
        path: "deleteShg", component: ShgDeleteComponent, canActivate: [AuthGuard],
      },
      {
        path: "deleteShgMember", component: ShgDeleteMemberComponent, canActivate: [AuthGuard],
      },
      {
        path: "Registration", component: RegisterComponent, canActivate: [AuthGuard],
      },
      {
        path: "transactionStatus", component: TransactionStatusComponent, canActivate: [AuthGuard],
      },

      ////////

      {
        path: "bankBranch", component: BankBranchAdditionComponent, canActivate: [AuthGuard],
      },

      {
        path: "merchantDetails", component: MerchantDetailsComponent, canActivate: [AuthGuard],
      },

      {
        path: "modelChange", component: ModelChangeComponent, canActivate: [AuthGuard],
      },

      {
        path: "panchayat", component: PanchayatAdditionComponent, canActivate: [AuthGuard],
      },

      {
        path: "transactionDetails", component: TransactionDetailsComponent, canActivate: [AuthGuard],
      },

      {
        path: "unmapping", component: UnmappingComponent, canActivate: [AuthGuard],
      },

      {
        path: "viewTickets", component: ViewTicketsComponent, canActivate: [AuthGuard],
      },

      {
        path: "village", component: VillageAdditionComponent, canActivate: [AuthGuard],
      },
      {
        path: "group", component: GroupComponent, canActivate: [AuthGuard],
      },
      {
        path: "role", component: RoleComponent, canActivate: [AuthGuard],
      },
      {
        path: "parentmenus", component: ParentMenusComponent, canActivate: [AuthGuard],
      },
      {
        path: "menus", component: MasterMenusComponent, canActivate: [AuthGuard],
      },
      {
        path: "assignmenus", component: AssignMenusComponent, canActivate: [AuthGuard],
      },
      {
        path: "menusordering", component: MenusorderingComponent, canActivate: [AuthGuard],
      },


      // new page   ShgAndPayoutComponent, 

      {
        path: "ShgAndPayout", component: ShgAndPayoutComponent, canActivate: [AuthGuard],
      },
      {
        path: "DMT", component: DMTComponent, canActivate: [AuthGuard],
      },
      {
        path: "BBPS", component: BBPSComponent, canActivate: [AuthGuard],
      },
      {
        path: "Statement/Recharge", component: RechargeComponent, canActivate: [AuthGuard],
      },
      {
        path: "AePSAndMATM", component: AepsAndMATMComponent, canActivate: [AuthGuard],
      },

      {
        path: "WalletHistory", component: WalletHistoryComponent, canActivate: [AuthGuard],
      },
      {
        path: "WalletBalance", component: WalletBalanceComponent, canActivate: [AuthGuard],
      },
      {
        path: "WalletTopup", component: WalletTopupComponent, canActivate: [AuthGuard],
      },
      {
        path: "WalletIncentive", component: WalletincentiveComponent, canActivate: [AuthGuard],
      },
      {
        path: "AdminPasswordReset", component: AdminResetPasswordComponent, canActivate: [AuthGuard],
      },
      {
        path: "payment", component: PaymentFTComponent, canActivate: [AuthGuard],
      },
      {
        path: "addaccount", component: PaymentAddAccountComponentComponent, canActivate: [AuthGuard],
      },
      {
        path: "notification", component: NotificationComponentComponent, canActivate: [AuthGuard],
      }
      ,
      {
        path: "Pan", component: PanComponent, canActivate: [AuthGuard],
      },
      {
        path: "DigitalGold", component: DigitalGoldComponent, canActivate: [AuthGuard],
      },
      {

        path: "Payment/Report", component: PaymentReportComponent, canActivate: [AuthGuard],

      },
      {

        path: "Payment/accountDetails", component: BeneficiaryAccountDetailsComponent, canActivate: [AuthGuard],

      },
      {

        path: "Statement/walletBalance", component: StatementWalletBalanceComponent, canActivate: [AuthGuard],

      },
      {

        path: "shgcounts", component: ShgsCountComponent, canActivate: [AuthGuard],

      },
      {

        path: "savingsloan", component: SavingsLoanComponent, canActivate: [AuthGuard],

      }
      ,
      {

        path: "merchantTopUp", component: MerchantTopUpComponent, canActivate: [AuthGuard],

      }








    ]
  },


  {
    path: "linkExpired", component: LinkExpiredComponent
  },

  {
    path: "**", component: PageNoteFoundComponent
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
