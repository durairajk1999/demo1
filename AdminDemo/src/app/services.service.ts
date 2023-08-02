import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApesMatmRequestDetails } from './apes-matm-request-details';
import { Bankbranchaddition } from './bankbranchaddition';
import { BbpsRequest } from './bbps-request';
import { AddAccountRequest } from './dashboard-module/payment-add-account-component/AddAccountRequest';
import { paymentDTO } from './dashboard-module/payment-ft/paymentDTO';
import { CurrentDateTransactionDetails } from './dashboard-module/transaction-details/CurrentDateTransactionDetails';
import { MerchantWiseUsingNGOIdRequest } from './dashboard-module/transaction-details/MerchantWiseUsingNGOIdRequest';
import { ServiceTypeTransactionRequest } from './dashboard-module/transaction-details/ServiceTypeTransactionRequest';
import { DmtRequest } from './dmt-request';
import { EditIA } from './edit-ia';
import { EncryptionDTO } from './encryption-dto';
import { Ftbalance } from './ftbalance';
import { Iacreation } from './iacreation';
import { login } from './login';
import { MerchantWalletBalance } from './merchant-wallet-balance';
import { Panchayat } from './panchayat';
import { ParentMenus } from './parent-menus';
import { RechargeRequestDetails } from './recharge-request-details';
import { ResponseContentParentMenus } from './response-content-parent-menus';
import { EnvService } from './service/env.service';
import { ShgDetailsRequest } from './shg-details-request';
import { ShgPayoutRequestDetail } from './shg-payout-request-detail';
import { StatedetailsResult } from './statedetails-result';
import { TransactionDetailsMerchant } from './transaction-details-merchant';
import { TransactionMerchantRequest } from './transaction-merchant-request';
import { TransactionRequest } from './transaction-request';
import { Transactionstatus } from './transactionstatus';
import { Unmapping } from './unmapping';
import { VillageAddition } from './village-addition';
import { WalletHistoryRequest } from './wallet-history-request';
import { Walletbalancerequest } from './walletbalancerequest';
import { Walletincentiverequest } from './walletincentiverequest';
import { Wallettopuprequest } from './wallettopuprequest';
@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  constructor(private httpClient: HttpClient, private env: EnvService) { }
  signIn: login = new login();
  isAuthenticated = false;
  // Authentication
  isLoggedIn = new BehaviorSubject<boolean>(false);
  authGuardValue = this.isLoggedIn.asObservable();
  userMenuUrl: string[] = [];
  // email 
  updateApprovalMessage(message: string) {
    this.approvalStageMessage.next(message)
  }
  private approvalStageMessage = new BehaviorSubject('Basic Approval is required!');
  currentApprovalStageMessage = this.approvalStageMessage.asObservable();
  parentMenunames: ParentMenus = new ParentMenus();
  responseService: ResponseContentParentMenus = new ResponseContentParentMenus();
  // ============================================= Java  Side URL's =================================================


  private signINURLUAT = this.env.adminPortalUrl + "/signin";  // 1
  private registerUrl = this.env.adminPortalUrl + "/signup"; // 2
  private passwordResetUrl = this.env.adminPortalUrl + "/change/password";
  private passwordURL = this.env.adminPortalUrl + "/reset/newPassword"; // 40 
  private roleNameFatchURL = this.env.adminPortalUrl + "/role/fetch/groupId"; // 24
  private fetchAllRoleURL = this.env.adminPortalUrl + "/role/fetchAllActive";  // 6
  private roleUpdateURL = this.env.adminPortalUrl + "/role/update"; // 9
  private roleDeleteURL = this.env.adminPortalUrl + "/role/delete"; // 10
  private passValueURL = this.env.adminPortalUrl + "/user/fetchPass";
  private userUpdateUrl = this.env.adminPortalUrl + "/user/update"; // 34
  private roleFetchGroupIdURL = this.env.adminPortalUrl + "/groupId/role"; // 7
  private roleUrl = this.env.adminPortalUrl + "/groupId/role"; // 27
  private menuURL = this.env.adminPortalUrl + "/roleId/Menus"; // 28
  private parentMenusURl = this.env.adminPortalUrl + "/groupId/Menus"; // 25 


  private auditURL = this.env.adminPortalUrl + "/user/user/auditrequest";
  private auditURL1 = this.env.adminPortalUrl + "/user/user/auditresponse";
  private beneficiaryAccountAddURL = this.env.adminPortalUrl + "/bene/beneficiaryAccountAdding";
  private beneAccountAdd = this.env.adminPortalUrl + "/bene/beneficiaryAccountAdding";
  private beneAccountCheck = this.env.adminPortalUrl + "/bene/beneficiaryAccountChecking";
  private beneDetailsGetURL = this.env.adminPortalUrl + "/bene/getAllAddedAccountDetails";
  private statusUpdateURL = this.env.adminPortalUrl + "/bene/beneficiaryAccountStatusUpdate";
  private makePaymentURL = this.env.adminPortalUrl + "/bene/FundTransfer";
  private paymentReportURL = this.env.adminPortalUrl + "/bene/ftTransactionReport";
  private validAccountNumberURL = this.env.adminPortalUrl + "/bene/beneficiaryDetails";
  private beneficiaryGetDetailsURL = this.env.adminPortalUrl + "/bene/beneficiaryDetails/fetchID";
  private otpgenerateURL = this.env.adminPortalUrl + "/bene/otpgenerate";
  private otpGenerateURL = this.env.adminPortalUrl + "/bene/otpgenerate";
  private otpValidateURL = this.env.adminPortalUrl + "/bene/otpValidate";
  private resendOTPURL = this.env.adminPortalUrl + "/bene/otpResend";
  private passwordResetEmailURL = this.env.adminPortalUrl + "/email/reset/password"; // 38  // login >> forgot 
  private verifyURL = this.env.adminPortalUrl + "/email/verification/url"; // 39
  private adminPasswordResetEmailURL = this.env.adminPortalUrl + "/email/admin/reset/password"; // 37  // admin  reset >> change password 
  private ftAccountNumberURL = this.env.adminPortalUrl + "/ft/fetchAccount";
  private addGroupNameURL = this.env.adminPortalUrl + "/group/add" // 3
  private fetchAllgroupname = this.env.adminPortalUrl + "/group/fetchAllActive"; // 2
  private GroupNameUpdatedURL = this.env.adminPortalUrl + "/group/update"; // 4
  private groupDeleteURL = this.env.adminPortalUrl + "/group/delete" // 5
  private iconFetchURL = this.env.adminPortalUrl + "/icon/fetchParentMenuIcon";  // 
  private masterIconURL = this.env.adminPortalUrl + "/icon/fetchMasterMenuIcon";  //
  private masterMenuAddURL = this.env.adminPortalUrl + "/masterMenu/add"; // 18
  private mastermenuNameURL = this.env.adminPortalUrl + "/masterMenu/fetch/groupId";
  private fetchallparentmenusURL = this.env.adminPortalUrl + "/masterMenu/fetch/groupIdAndParentMenuId"; // 17
  private masterMenuUpdateURL = this.env.adminPortalUrl + "/masterMenu/update"; // 19
  private masterMenuDeleteURL = this.env.adminPortalUrl + "/masterMenu/delete"; // 20
  private roleMenuUpdateURL = this.env.adminPortalUrl + "/masterMenu/roleMenu/update";  // 26
  private masterMenuURL = this.env.adminPortalUrl + "/masterMenu/fetchAllActive"; // 16
  private roleNameAddingURL = this.env.adminPortalUrl + "/parentMenu/add"; // 13
  private ParentMenuNameURL = this.env.adminPortalUrl + "/parentMenu/fetch/groupId"; // 12   k
  private parentMenusURL = this.env.adminPortalUrl + "/parentMenu/fetchAllActive"; // 11
  private parentMenuUpdateURL = this.env.adminPortalUrl + "/parentMenu/update"; // 14
  private parentMenuDeleteURL = this.env.adminPortalUrl + "/parentMenu/delete"; // 15
  private roleAddURL = this.env.adminPortalUrl + "/role/add"; // 8
  private passwordChangeStatusUrl = this.env.adminPortalUrl + "/user/passwordChange/status"
  // status checking 15 sec once 
  private passwordChangeUpdUrl = this.env.adminPortalUrl + "/user/passwordChange/update"
  private passwordChangeReqUrl = this.env.adminPortalUrl + "/user/passwordChange/request"
  private userLogOutURL = this.env.adminPortalUrl + "/user/logout"; // 35
  private balanceURL = this.env.ftJriUrl + "/fundtransfer-service/v2/fundtransfer/checkBalance";
  private statementURL = this.env.ftJriUrl + "/fundtransfer-service/v2/fundtransfer/adhocStatement";
  private fundTransferURL = this.env.ftJriUrl + "/fundtransfer-service/v2/fundtransfer/fundTransfer";
  private baseUrl = this.env.adminPortalUrl + "/ticket";
  private walletBalanceURL = this.env.ftJriUrl + "/jrirc-service/v2/jrirc/GetCorporateBalance";
  private providersAndLocationURL = this.env.ftJriUrl + "/jrirc-service/v2/jrirc/RechargeProviders";
  private mobileRechargeURL = this.env.ftJriUrl + "/jrirc-service/v2/jrirc/MobileInstantRecharge";
  private paymentDetailsURL = this.env.adminPortalUrl + "/bene/paymentReport";
  private tfBalanceURl = this.env.ftJriUrl + "/fundtransfer-service/v1/fundtransfer/checkBalance"


  //============================== API service ==========================
  signInCalling(signIn: EncryptionDTO): Observable<any> {
    localStorage.removeItem('signIn');
    // return this.httpClient.post<any>(`${this.signINURLUAT}`, signIn);
    return this.httpClient.post<any>(this.signINURLUAT, signIn);
  }
  userRegister(user: EncryptionDTO): Observable<any> {
    return this.httpClient.post<any>(this.registerUrl, user);
  }
  passwordReset(password: EncryptionDTO): Observable<any> {
    return this.httpClient.post(this.passwordResetUrl, password);
  }
  updatePassword(updatePassword: string): Observable<any> {
    return this.httpClient.get<any>(`${this.passwordURL}/?passwordUpdate=${updatePassword}`);
  }
  getPassword(emailAddress: string, password: string): Observable<any> {
    return this.httpClient.get<any>(`${this.passwordURL}/?email=${emailAddress}&newPassword=${password}`);
  }
  roleBasedGroupId(groupid: string): Observable<any> {
    return this.httpClient.get<any>(`${this.roleFetchGroupIdURL}/?groupId=${groupid}`);
  }
  getRoleList(group: string): Observable<any> {
    return this.httpClient.get(`${this.roleUrl}/?groupId=${group}`);
  }
  getMenus(roleName: string): Observable<any> {
    return this.httpClient.get<any>(`${this.menuURL}/?roleId=${roleName}`);
  }
  fetchParentMenuList(groupid: string): Observable<any> {
    return this.httpClient.get<any>(`${this.parentMenusURl}/?groupId=${groupid}`);
  }
  auditRequest(auditRequest: EncryptionDTO): Observable<any> {
    return this.httpClient.post<any>(this.auditURL, auditRequest);
  }
  auditRequestResponse(auditRequest: EncryptionDTO): Observable<any> {
    return this.httpClient.post<any>(this.auditURL1, auditRequest);
  }
  RoleAddForGroup(roleRquest: string): Observable<any> {
    const header = { 'content-type': 'application/json' }
    const body = null;
    const params = new HttpParams()
      .set('addRoleRequest', roleRquest)
    // .set('roleName', RoleName)
    // .set('userName', " ")
    return this.httpClient.post(this.roleAddURL, null, { headers: header, 'params': params })
  }
  selectRoleName(groupId: String) {
    return this.httpClient.get<any>(`${this.roleNameFatchURL}/?groupId=${groupId}`);
  }
  fetchAllGroupRoleName(): Observable<any> {
    return this.httpClient.get(this.fetchAllRoleURL);
  }
  roleUpdate(roleUpdateRequest: string): Observable<any> {
    const header = { 'content-type': 'application/json' }
    const body = JSON.stringify('');
    const params = new HttpParams()
      .set('roleUpdate', roleUpdateRequest)
    // .set('oldRoleId', data.roleId)
    // .set('newRoleName', data.oldRoleName)
    // .set('userName', username)
    return this.httpClient.put(this.roleUpdateURL, body, { headers: header, "params": params })
  }
  deleteRole(deletedId: string): Observable<any> {
    const params = new HttpParams()
      .set('deleteRole', deletedId)
    //.set('userName', username)
    return this.httpClient.delete(this.roleDeleteURL, { 'params': params });
  }
  checkPass(): Observable<any> {
    return this.httpClient.get<any>(`${this.passValueURL}`);
  }
  userUpdate(userId: EncryptionDTO): Observable<any> {
    const header = new HttpHeaders();
    header.set('Content-Type', 'application/json')
    // { 'content-type': 'appliaction/json' }
    const body = JSON.stringify('');
    const params = new HttpParams()
    //.set('userId', userId)
    return this.httpClient.post<any>(this.userUpdateUrl, userId, { headers: header, 'params': params });
  }
  passwordChangeRequestStatus(email: any): Observable<any> {
    return this.httpClient.get<any>(`${this.passwordChangeStatusUrl}?email=${email}`);
  }
  passwordChangeRequestUpdate(email: any): Observable<any> {
    const header = { 'content-type': 'application/json' }
    return this.httpClient.post<any>(`${this.passwordChangeUpdUrl}/?email=${email}`, { headers: header });
  }  // unwanted but used later
  passwordChangeRequest(email: any): Observable<any> {
    const header = { 'content-type': 'application/json' }
    return this.httpClient.post<any>(`${this.passwordChangeReqUrl}/?email=${email}`, { headers: header });
  } // unwanted but use later
  userLogOut(userId: string): Observable<any> {
    localStorage.setItem('signIn', 'true'); //trigger flag
    return this.httpClient.get<any>(`${this.userLogOutURL}/?userId=${userId}`);
  }
  getBalance(balance: EncryptionDTO): Observable<any> {
    return this.httpClient.post<any>(this.balanceURL, balance);
  }
  getStatement(statement: EncryptionDTO): Observable<any> {
    return this.httpClient.post(this.statementURL, statement);
  }
  getFundTransfer(request: EncryptionDTO): Observable<any> {
    // const header = {
    //   'content-type': 'application/json',
    //   'x-ibm-client-id': XIBMClientId, 'x-ibm-client-secret': XIBMClientSecret
    // }
    // const body = JSON.stringify(request);
    // const params = new HttpParams()
    return this.httpClient.post(this.fundTransferURL, request)
  }
  viewTickets(viewTicketReq: EncryptionDTO): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/viewTicket/ticketHistory`, viewTicketReq); // 31
  }
  getServiceList(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/getServiceType`); // 30
  }
  urlCalling(router: String): boolean {
    return true;
  }
  addComment(ticketId: string): Observable<any> {
    let params = new HttpParams();
    params = params.append("ticketUpdateRequest", ticketId);
    // params = params.append("comment", comment);
    return this.httpClient.get(`${this.baseUrl}/raiseTicket/ticketUpdate`, { params }); // 32
  }
  closeTicket(ticketId: string): Observable<any> {
    let params = new HttpParams();
    params = params.append("ticketId", ticketId);
    // alert("TicketId " + ticketId + " closed");
    return this.httpClient.get(`${this.baseUrl}/raiseTicket/statusUpdate`, { params }); // 33
  }
  getRechargeBalance(): Observable<any> {
    return this.httpClient.post(this.walletBalanceURL, null);
  }
  getProvidersAndLocations(rechargeRequest: EncryptionDTO): Observable<any> {
    return this.httpClient.post(this.providersAndLocationURL, rechargeRequest);
  }
  sampleRecharge(rechargeRequest: EncryptionDTO): Observable<any> {
    return this.httpClient.post(this.mobileRechargeURL, rechargeRequest);
  }
  postPaymentDetails(payment: paymentDTO): Observable<any> {
    return this.httpClient.post<any>(this.paymentDetailsURL, payment);
  }
  checkBalance(ftbl: Ftbalance): Observable<any> {
    return this.httpClient.post<any>(this.tfBalanceURl, ftbl);
  }
  beneficiaryAddMethod(request: EncryptionDTO): Observable<any> {
    return this.httpClient.post<any>(this.beneficiaryAccountAddURL, request);
  }
  beneficiaryAccountAdd(request: AddAccountRequest): Observable<any> {
    return this.httpClient.post<any>(this.beneAccountAdd, request);
  }
  beneficiaryAccountCheck(request: EncryptionDTO): Observable<any> {
    return this.httpClient.post<any>(this.beneAccountCheck, request);
  }
  beneficiaryGet(): Observable<any> {
    return this.httpClient.get<any>(this.beneDetailsGetURL);
  }
  statusUpdate(request: EncryptionDTO) {
    return this.httpClient.post<any>(this.statusUpdateURL, request);
  }
  makePayment(makePaymentRequest: any): Observable<any> {
    return this.httpClient.post(this.makePaymentURL, makePaymentRequest)
  }
  getPaymentReport(statement: EncryptionDTO): Observable<any> {
    return this.httpClient.post(this.paymentReportURL, statement);
  }
  getAccountDetails(): Observable<any> {
    return this.httpClient.get(this.validAccountNumberURL);
  }
  beneficiaryDetailsFetch(userId: any): Observable<any> {
    return this.httpClient.get<any>(`${this.beneficiaryGetDetailsURL}?userId=${userId}`);
  }
  getotpGenerate(request: any): Observable<any> {
    // const header = { 'content-type': 'appliaction/json' }
    // const body = JSON.stringify('');
    // const params = new HttpParams()
    //   .set('beneAccountnumber', request)
    //   .set('beneName', benename)
    //   .set('beneMobile', beneMobile)
    //   .set('userIdentification', userID)
    //   .set('userName', username)
    return this.httpClient.post(this.otpgenerateURL, request)
  }
  otpGeneration(request: EncryptionDTO): Observable<any> {
    //const header = { 'content-type': 'appliaction/json' }
    // const body = JSON.stringify('');
    //   const params = new HttpParams()
    //   .set('beneAccountnumber',accountNumber)
    //   .set('beneName',beneName)
    //   .set('beneMobile',mobileNumber)
    //   .set('userIdentification',userId)
    //   .set('userName',userName);
    return this.httpClient.post<any>(this.otpGenerateURL, request)
  }
  otpValidation(request: EncryptionDTO): Observable<any> {
    // const header = { 'content-type': 'appliaction/json' }
    // const body = JSON.stringify('');
    // const params = new HttpParams()
    //   .set('beneAccountnumber', request)
    //   .set('otp', benename)
    //   .set('userIdentification', userID)
    //   .set('username', username)
    return this.httpClient.post(this.otpValidateURL, request)
  }
  otpResend(request: EncryptionDTO): Observable<any> {
    // const header = { 'content-type': 'appliaction/json' }
    // const body = JSON.stringify('');
    // const params = new HttpParams()
    //   .set('beneAccountnumber', request)
    //   .set('beneName', benename)
    //   .set('beneMobile', beneMobile)
    //   .set('userIdentification', userID)
    //   .set('username', username)
    return this.httpClient.post(this.resendOTPURL, request)
  }
  sendPasswordResetEmail(emailAddress: string): Observable<any> {
    return this.httpClient.get<any>(`${this.passwordResetEmailURL}/?email=${emailAddress}`);
  }
  getURLVerification(url: string): Observable<any> {
    return this.httpClient.get<any>(`${this.verifyURL}/?url=${url}`);
  }
  sendPasswordResetEmailByAdmin(emailAddress: string): Observable<any> {
    return this.httpClient.get<any>(`${this.adminPasswordResetEmailURL}/?email=${emailAddress}`);
  }
  fetchAccountNumber(): Observable<any> {
    return this.httpClient.get(this.ftAccountNumberURL);
  }
  addGroupName(groupnameValue: string): Observable<any> {
    const header = { 'content-type': 'application/json' }
    const body = JSON.stringify('');
    const params = new HttpParams()
      .set('addGroupName', groupnameValue)
    // .set('userName', " ")
    return this.httpClient.post(this.addGroupNameURL, body, { headers: header, 'params': params })
  }
  fetchAllGroupName(): Observable<any> {
    return this.httpClient.get(this.fetchAllgroupname);
  }
  GroupNameUpdate(groupUpdated: EncryptionDTO): Observable<any> {
    const header = { 'content-type': 'application/json' }
    const body = JSON.stringify('');
    const params = new HttpParams()
      .set('groupUpdate', groupUpdated.data)
    //.set('newGroupName', groupUpdated.roleGroupName)
    //.set('userName', groupUpdated.userName)
    return this.httpClient.put(this.GroupNameUpdatedURL, body, { headers: header, "params": params })
  }
  deleteIssue(userDetails: string): Observable<any> {
    const params = new HttpParams()
      .set('deleteGroup', userDetails)
    // .set('userName', username)
    return this.httpClient.delete(this.groupDeleteURL, { 'params': params });
  }
  IconFetch() {
    return this.httpClient.get<any>(`${this.iconFetchURL}`);
  }
  masterIcon() {
    return this.httpClient.get<any>(`${this.masterIconURL}`);
  }
  masterManuAdd(responseValue: EncryptionDTO): Observable<any> {
    const header = { 'content-type': 'application/json' }
    const body = JSON.stringify(responseValue);
    // const params = new HttpParams()
    //   .set('groupId', groupId)
    //   .set('parentMenuId', parentmenuId)
    return this.httpClient.post(this.masterMenuAddURL, responseValue);//, { headers: header, 'params': params })
  }
  getAllMasterMenuName(grp: string): Observable<any> {
    return this.httpClient.get<any>(`${this.mastermenuNameURL}/?groupId=${grp}`);
  }
  fetchAllMasterMenus(parentmenuid: string): Observable<any> {
    return this.httpClient.get<any>(`${this.fetchallparentmenusURL}/?groupIdAndParentmenuID=${parentmenuid}`);
  }
  masterMenuUpdate(data: string): Observable<any> {
    const header = { 'content-type': 'application/json' }
    const body = JSON.stringify('');
    const params = new HttpParams()
      .set('masterMenuUpdate', data)
    // .set('parentId', data.parentMenuId)
    // .set('masterMenuId', data.masterMenuId)
    // .set('newMasterMenuName', data.masterMenuName)
    // .set('navigateUrl', data.navigationUrl)
    // .set('iconName', data.iconName)
    // .set('newGroupId', rolerequest)
    // .set('newparentMenuId', parentrequest)
    // .set('modifiedBy', data.modifiedBy)
    return this.httpClient.put(this.masterMenuUpdateURL, body, { headers: header, "params": params })
  }
  masterMenuDelete(deletedId: string): Observable<any> {
    const params = new HttpParams()
      .set('masterMenuDelete', deletedId)
    // .set('userName', username)
    return this.httpClient.delete(this.masterMenuDeleteURL, { 'params': params });
  }
  roleMenuUpdate(roleUpdatemenu: EncryptionDTO): Observable<any> {
    return this.httpClient.post<any>(this.roleMenuUpdateURL, roleUpdatemenu)
  }
  fetchMasterMenuList(): Observable<any> {
    return this.httpClient.get(this.masterMenuURL);
  }
  parentMenuAdding(parentMenuRequest: EncryptionDTO): Observable<any> {
    const header = { 'content-type': 'application/json' }
    //const body = JSON.stringify(parentMenuNames);
    const params = new HttpParams()
    //.set('groupId', GroupNameId)
    return this.httpClient.post(this.roleNameAddingURL, parentMenuRequest, { headers: header, 'params': params })
  }
  fetchParentMenuname(groupid: string): Observable<any> {
    return this.httpClient.get<any>(`${this.ParentMenuNameURL}/?groupId=${groupid}`);
  }
  fetchAllParent(): Observable<any> {
    return this.httpClient.get(this.parentMenusURL);
  }
  parentMenuNameUpdate(encryptRequest: EncryptionDTO): Observable<any> {
    const header = { 'content-type': 'application/json' }
    //const body = JSON.stringify(parentMenuNames);
    const params = new HttpParams()
    // .set('groupId', dataResponse.roleGroupId)
    //.set('parentMenuId', dataResponse.parentMenuId)
    return this.httpClient.put(this.parentMenuUpdateURL, encryptRequest, { headers: header, 'params': params })
  }
  parentMenuDelete(deletedId: string): Observable<any> {
    const params = new HttpParams()
      .set('parentMenuId', deletedId)
    //.set('userName', username)
    return this.httpClient.delete(this.parentMenuDeleteURL, { 'params': params });
  }
  // auth guard
  getAuthStatus() {
    return this.isAuthenticated;
  }
  //===========================================API service End ================================
  //Reset
  // passwordReset(userId: any, password: any, newPassword: any): Observable<any> {
  //   const params = new HttpParams()
  //     .set('userId', userId)
  //     .set('password', password)
  //     .set('newPassword', newPassword)
  //   //return this.httpClient.get<any>(this.passwordResetUrl, { 'params': params });
  //   return this.httpClient.get<any>(`${this.passwordResetUrl}/?userId=${userId}&password=${password}&newPassword=${newPassword}`);
  // }


  //================================================= .NET URL AND API's ===============================================
  private userLevelURL = this.env.shgUrl + "/Admin/MasterGetUserLevel" //bank branch details get user level api
  private searchUserNameURL = this.env.shgUrl + "/Admin/StakeholderDetails"// Search UserName URl(B-B-D)
  private bankBranchReportURL = this.env.shgUrl + "/Admin/GetBranchDetails" //  Bank Branch details  Table Report URl
  private merchantDetailsURL = this.env.shgUrl + "/Admin/GetMerchantID"; // drop down  Merchant Name Details GET URL 
  private merchantbalanceURl = this.env.shgUrl + "/Admin/GetMerchantBalance"; // merchant details Table Record Get URL
  private serviceTypeURL = this.env.shgUrl + "/Admin/GetServiceType"; //  GET Service Type  URL (Transaction-status)
  private userTypeURL = this.env.shgUrl + "/Admin/GetUserType";// Get user type url (Bank branch details)
  private getBankTypeURL = this.env.shgUrl + "/Admin/GetBankType" // Fetch bank Type URL
  private getBankNameURL = this.env.shgUrl + "/Admin/GetBankName" // Fetch Bank Name URL
  private createBankBranchURL = this.env.shgUrl + "/Admin/AddBankBranch" // Create Bank Branch URL
  private blockListURL = this.env.shgUrl + "/Admin/GetBlockList" // Fetch Block name Details URL
  private addPanchayatURL = this.env.shgUrl + "/Admin/AddPanchayat" // Create  panchayat URL
  private panchayatListURL = this.env.shgUrl + "/Admin/GetPanchayatList" // Get Panchayat name URL
  private addVillageURL = this.env.shgUrl + "/Admin/AddVillage" //  create Villege  URL
  private merchantDetailsReport2URL = this.env.shgUrl + "/Admin/DeviceUnmappingDetails"; // Unmapping  merchant details table report2
  private AddUnmappingRequestURL = this.env.shgUrl + "/Admin/AddUnmapRequest" // merchant device unmapping request url
  private merchantrequestStatusURL = this.env.shgUrl + "/Admin/UnmapRequestStatus" // merchant device unmapping request status url
  private merchantPlanDetailsURL = this.env.shgUrl + "/Admin/GetPlanDetails" // model change Table Report url
  private merchantmodelRequest = this.env.shgUrl + "/Admin/AddPlanRequest"; // change model Request URL
  private CategoryListURL = this.env.shgUrl + "/Admin/MasterGetCategory" // getCategory URL
  private createIAURL = this.env.shgUrl + "/Admin/CreateIA"//Ia create URL
  private merchantmodelChangeURL = this.env.shgUrl + "/Admin/PlanRequestStatus" // change model request status url
  //get merchant Details report using state and district
  private getCurrentDateTransactionDetailsURL = this.env.payurl + "/api/MonthlyStatements/overallStatement"  //transaction details table report for current date service type only
  private getCurrentDateTransactionDetailsMerchantURL = this.env.payurl + "/api/TransHistoryBasedOnNGO/v2/zonal_ngostatement"  //transaction details table report for current date merchant wise only
  private getMerchantStateDistrictURL = this.env.payurl + "/api/TransHistoryBasedOnNGO/v2/zonal_ngostatement" // transaction details Table Report for merchant wise state and district select
  private getServiceTypestateDistrictURL = this.env.payurl + "/api/MonthlyStatements/v2/overallStatement"; // Transaction Details GET Table Report URL 1. service type state district select
  private getServiceTypeNgoIdURL = this.env.payurl + "/api/MonthlyStatements/overallStatement" // transaction details table report for service type  state district and ia
  private getMerchantNgoIdURL = this.env.payurl + "/api/TransHistoryBasedOnNGO/v2/HistoryByNgoId" // transaction details table report for merchant wise state , district , ia 
  private getServiceMerchantIdURL = this.env.payurl + "/api/MonthlyStatements/v2/overallStatement" // transaction details table report for service type state , district, ia , marchant 
  private getServiceMerchantIdURL1 = this.env.payurl + "/api/MonthlyStatements/v2/overallStatement" // transaction details table for service type only merchant code 
  private transctionURL = this.env.payurl + "/api/TransactionHistory/v2/Ngo/transactions"; // transaction status Table Report URL
  private transactionStatementURL = this.env.payurl + "/api/TransactionHistory/v2/TransactionStatement" //transaction status referenceId Table Report URL
  private editIAViewURL = this.env.shgUrl + "/Admin/EditIA" // IA Edit URL
  private merchantModelChangeApprovedURL = this.env.shgUrl + "/Admin/UpdatePlan"
  private merchantModelChangeRejectedURL = this.env.shgUrl + "/Admin/CancelUpdatePlan"
  private getAnimaterNameURL = this.env.shgUrl + "/Admin/MasterAnimatorDetails"; // Get Animator name details
  private shgDetailsURL = this.env.shgUrl + "/Admin/GetSHGDetails"; // SHG group  Table details using  1)state, district , ia
  // 2. state , district ,and all 
  private shgGroupDeleteURL = this.env.shgUrl + "/Admin/DeleteSHGGroup"; // SHG Group Delete URL
  private getShgGroupMembersURL = this.env.shgUrl + "/Admin/MemberLoanDetails"; // GET SHG Group Member Details 
  private shgMemberDeleteURL = this.env.shgUrl + "/Admin/DeleteMember"; // SHG Group Member Delete
  private deviceunmapURL = this.env.shgUrl + "/Admin/DeviceUnmappingDetails";
  private unmappingApprovedURL = this.env.shgUrl + "/Admin/Unmapping";
  private unmappingrejectURL = this.env.shgUrl + "/Admin/CancelUnmapRequest";
  // 1
  private statelistURL = this.env.shgUrl + "/Admin/GetStateList" // Drop Down state name URL  1
  private districtNameURL = this.env.shgUrl + "/Admin/GetDistrictList"; // drop down district name URL
  private getMerchantWalletBalance = this.env.payurl + "/api/ReconciliationStatement/v3/transaction/get/merchantwallethistory";
  private iaDetailsURL = this.env.shgUrl + "/Admin/GetIAList"  // IA view page >> Table Record fetch url
  private iaListURL = this.env.shgUrl + "/Admin/GetIADetails"; // IA-Details GET Table  Report URL
  private getIANameListURL = this.env.shgUrl + "/Admin/MasterGetIAName" //  drop down IA Name URL
  private merchantTopUpURL = this.env.payurl + "/api/WalletTopupRefund/v3/wallet/topup";
  private shgPayoutTableURL = this.env.payurl + "/api/ReconciliationStatement/v3/transaction/get/shg_payout"
  // Wallet topup
  private walletTopup = this.env.payurl + "/api/ReconciliationStatement/v3/transaction/get/wallet_topup"
  // Wallet incentive
  private walletincentive = this.env.payurl + "/api/ReconciliationStatement/v3/transaction/get/wallet_incentive"
  private aepsMatmTableURL = this.env.payurl + "/api/ReconciliationStatement/v3/transaction/get/aeps_matm"
  // WALLET BALANCE
  private walletBalance = this.env.payurl + "/api/ReconciliationStatement/v3/transaction/get/wallet_balance"
  private rechargeTableDetailsURL = this.env.payurl + "/api/ReconciliationStatement/v3/transaction/get/recharge"
  private Panurl = this.env.payurl + "/api/ReconciliationStatement/v3/transaction/get/pan_transaction"
  private Digiurl = this.env.payurl + "/api/ReconciliationStatement/v3/transaction/get/digi_transaction"
  private walletHistoryTableURL = this.env.payurl + "/api/ReconciliationStatement/v3/transaction/get/wallet_history"
  private bbpsTableDetailsURL = this.env.payurl + "/api/ReconciliationStatement/v3/transaction/get/bbps"
  private merchantwalletbalanceURL = this.env.payurl + "/api/Walletbalance/WalletBalance"
  private dmtTableDetailsURL = this.env.payurl + "/api/ReconciliationStatement/v3/transaction/get/dmt"
  private shgsavingsListUrl = this.env.shgUrl + "/Admin/GetSHGSavings"
  private shgCountListUrl = this.env.shgUrl + "/Admin/GetSHGCount" // Fetch shg count




  //====================================== .NET API Service start ==================



  //  drop downn Get State Details   
  getStateService(): Observable<any> {
    return this.httpClient.get(this.statelistURL);
  }
  // 2

  //drop down  GET District details 
  districtNameFetch(selectedStateName: string): Observable<any> {
    return this.httpClient.get<any>(`${this.districtNameURL}/?state_name=${selectedStateName}`);
  }
  //3 

  getMerchantWalletBalanceReport(merchantWalletBalance: MerchantWalletBalance): Observable<any> {
    const header = { 'content-type': 'application/json' }
    return this.httpClient.post<any>(`${this.getMerchantWalletBalance}`, merchantWalletBalance, { headers: header });
  }
  // 4

  //IA VIEW page >> Table Record
  iaList(statenameSelected: string, districtnameSelected: string): Observable<any> {
    return this.httpClient.get<any>(`${this.iaDetailsURL}/?State_Name=${statenameSelected}&District_Name=${districtnameSelected}`)
  }
  // 5 

  //  drop downn  ia details >> GET IA Name 
  getIaNameList(statenameSelected: string, districtnameSelected: string): Observable<any> {
    return this.httpClient.get<any>(`${this.getIANameListURL}/?State=${statenameSelected}&District=${districtnameSelected}`)
  }

  //ia details Table Report
  iaTableList(statenameSelected: string, districtnameSelected: string, selectedIaName: string): Observable<any> {
    return this.httpClient.get<any>(`${this.iaListURL}/?State_Name=${statenameSelected}&District_Name=${districtnameSelected}&Name_of_SHPI=${selectedIaName}`)
  }
  //Get User Level 
  getUserLevel(userType: string): Observable<any> {
    // return this.httpClient.get(this.userLevelURL);
    return this.httpClient.get<any>(`${this.userLevelURL}/?User_Type=${userType}`)
  }
  //bank branch details search  User Name
  serachUserName(Username: string): Observable<any> {
    const header = { 'content-type': 'application/json' }
    const body = JSON.stringify("");
    const params = new HttpParams()
      .set('Username', Username)
    return this.httpClient.post(this.searchUserNameURL, null, { headers: header, 'params': params })
  }
  // B-B-D Table Report 
  getBankBranchTableReport(UserType: string, UserLevel: string) {
    const header = { 'content-type': 'application/json' }
    const body = JSON.stringify("");
    const params = new HttpParams()
      .set('UserType', UserType)
      .set('UserLevel', UserLevel)
    return this.httpClient.post(this.bankBranchReportURL, null, { headers: header, 'params': params })
  }
  // drop down Get Merchant Name 
  merchantDetails(iaId: number): Observable<any> {
    return this.httpClient.get<any>(`${this.merchantDetailsURL}/?Ngo_id=${iaId}`)
  }
  // merchant details table Report using only merchant code  
  fetchmerchantBalance(merchantid: string, whose: string): Observable<any> {
    if (whose == "mobile") {
      return this.httpClient.get(`${this.merchantbalanceURl}/?Username=${merchantid}`);
    }
    else {
      return this.httpClient.get(`${this.merchantbalanceURl}/?MerchantId=${merchantid}`);
    }
  }
  // Get Service  type in Transaction status
  getServiceType() {
    return this.httpClient.get<any>(this.serviceTypeURL);
  }
  // Get Transaction status Table Report
  getTransactionRequest(transaction: TransactionRequest): Observable<any> {
    return this.httpClient.post<any>(this.transctionURL, transaction);
  }
  // Transaction status Table Report 
  getTransaction(transaction: Transactionstatus): Observable<any> {
    return this.httpClient.post<any>(this.transctionURL, transaction);
  }
  //bank branch creation get bank type api
  getBankType(stateName: string, districtName: string): Observable<any> {
    return this.httpClient.get<any>(`${this.getBankTypeURL}/?state=${stateName}&district=${districtName}`);
  }
  //bank branch creation get banks names api
  getBankName(stateName: string, districtName: string, type: number): Observable<any> {
    return this.httpClient.get<any>(`${this.getBankNameURL}/?Type=${type}&state=${stateName}&district=${districtName}`);
  }
  //Bankbranch creation api
  createBankBranch(bankBranch: Bankbranchaddition) {
    return this.httpClient.post<any>(this.createBankBranchURL, bankBranch);
  }
  // drop down Get Block details 
  blockFetch(selectedStateName: string, selectedDistrictName: string): Observable<any> {
    return this.httpClient.get<any>(`${this.blockListURL}/?state_name=${selectedStateName}&district_name=${selectedDistrictName}`);
  }
  // Panchayat creation 
  panchayatAddition(panchayat: Panchayat): Observable<any> {
    return this.httpClient.post(`${this.addPanchayatURL}`, panchayat);
  }
  //Panchayat details Method
  FetchPanchayat(selectedStateName: string, selectedDistrictName: string, selectedBlockName: string): Observable<any> {
    return this.httpClient.get<any>(`${this.panchayatListURL}/?state_name=${selectedStateName}&district_name=${selectedDistrictName}&block_name=${selectedBlockName}`);
  }
  // Village creation 
  villageAddition(village: VillageAddition): Observable<any> {
    return this.httpClient.post(`${this.addVillageURL}`, village);
  }
  // unmapping Merchant details 1
  merchantDetailsReport(merchaniId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.merchantDetailsReport2URL}/?MerchantID=${merchaniId}`)
  }
  // unmapping Merchant details 2
  merchantDetailsReport1(merchaniId: StatedetailsResult): Observable<any> {
    return this.httpClient.get<any>(`${this.merchantDetailsReport2URL}/?State=${merchaniId.state_name}&District=${merchaniId.district_name}&Ngo_id=${merchaniId.name_of_SHPI}&MerchantID=${merchaniId.merchantID}`)
  }
  // Unmapping Request 
  RequestedToUnmapping(merchantid: string, userId: any): Observable<any> {
    const header = { 'content-type': 'application/json' }
    const body = JSON.stringify("");
    const params = new HttpParams()
      .set('UserId', userId)
      .set('MerchantId', merchantid)
    return this.httpClient.post(this.AddUnmappingRequestURL, body, { headers: header, 'params': params })
  }
  // Unmapping approved
  unmappringApproved(merchantid: string, userId: any): Observable<any> {
    const header = { 'content-type': 'application/json' }
    const body = JSON.stringify("");
    const params = new HttpParams()
      .set('MerchantId', merchantid)
      .set('Id', userId)
    return this.httpClient.post(this.unmappingApprovedURL, body, { headers: header, 'params': params })
  }
  // Unmapping Rejected
  unmappringRejected(merchantid: string, userId: any): Observable<any> {
    const header = { 'content-type': 'application/json' }
    const body = JSON.stringify("");
    const params = new HttpParams()
      .set('MerchantId', merchantid)
      .set('Id', userId)
    return this.httpClient.post(this.unmappingrejectURL, body, { headers: header, 'params': params })
  }
  
  shgCountList(statenameSelected: string, districtnameSelected: string, selectedIaName: string): Observable<any> {
    return this.httpClient.get<any>(`${this.shgCountListUrl}/?State_Name=${statenameSelected}&District_Name=${districtnameSelected}&IAName=${selectedIaName}`)
  }
  // Device unmapping request status  
  merchantRequestStatus(merchantiD: string): Observable<any> {
    const header = { 'content-type': 'application/json' }
    const body = JSON.stringify("");
    const params = new HttpParams()
      .set('MerchantId', merchantiD)
    return this.httpClient.post(this.merchantrequestStatusURL, null, { headers: header, 'params': params })
  }
  // Merchant details model change table Report 2
  merchantPlan1(merchantId: Unmapping): Observable<any> {
    return this.httpClient.get(`${this.merchantPlanDetailsURL}/?State=${merchantId.state}&District=${merchantId.district}&Ngo_id=${merchantId.ia}&MerchantID=${merchantId.merchant}`)
  }
  // Merchant details model change table Report 1
  merchantPlan(merchantId: string): Observable<any> {
    return this.httpClient.get(`${this.merchantPlanDetailsURL}/?MerchantId=${merchantId}`)
  }
  // Model change >> Plan change request
  modelChangeRequest(merchantid: string, modelName: string, userId: any): Observable<any> {
    const body = JSON.stringify('');
    const param = new HttpParams().set('MerchantId', merchantid).set('NewModel', modelName).set('UserId', userId);
    return this.httpClient.post(this.merchantmodelRequest, body, { 'params': param })
  }
  //ia creation get category 
  getCategoryList(): Observable<any> {
    return this.httpClient.get(this.CategoryListURL);
  }
  //ia creation api
  iaCreation(iacreation: Iacreation) {
    return this.httpClient.post<any>(this.createIAURL, iacreation);
  }
  //iaViewEdit
  editIAViewDeails(iaEdit: EditIA) {
    return this.httpClient.post<any>(this.editIAViewURL, iaEdit);
  }
  // Transaction details state and district fetch service type only
  getServiceTypeStateDistrict(transaction: ServiceTypeTransactionRequest) {
    return this.httpClient.post<any>(this.getServiceTypestateDistrictURL, transaction);
  }
  // Transaction details state and district fetch Merchant wise only
  getMerchantStateDistrict(merchant: TransactionMerchantRequest) {
    const header = { 'content-type': 'application/json' }
    const body = JSON.stringify(merchant);
    const params = new HttpParams()
      .set('merchantID', "")
    return this.httpClient.post(this.getMerchantStateDistrictURL, body, { headers: header, 'params': params })
  }
  // Transaction details state and district , ia fetch service type
  getServiceTypeNgoId(service: ServiceTypeTransactionRequest) {
    return this.httpClient.post<any>(this.getServiceTypeNgoIdURL, service);
  }
  // Transaction details state and district , ia fetch merchant wise
  getMerchantByNgoId(merchantNgoId: MerchantWiseUsingNGOIdRequest) {
    return this.httpClient.post<any>(this.getMerchantNgoIdURL, merchantNgoId)
  }
  // Transaction details state and district , ia  , merchant fetch service type
  getServiceByMerchantId(merchantDetails: ServiceTypeTransactionRequest) {
    return this.httpClient.post<any>(this.getServiceMerchantIdURL, merchantDetails)
  }
  // Transaction details table report only using merchant code service type
  getServiceGetMerchantId(merchantDetails: TransactionDetailsMerchant) {
    return this.httpClient.post<any>(this.getServiceMerchantIdURL1, merchantDetails)
  }
  //Transaction Details current date record service type only
  getCurrentDateTransactionDetails(transaction: CurrentDateTransactionDetails) {
    return this.httpClient.post<any>(this.getCurrentDateTransactionDetailsURL, transaction);
  }
  //Transaction Details current date record merchant Wise only
  getCurrentDateTransactionMerchantWise(transaction: TransactionMerchantRequest) {
    return this.httpClient.post<any>(this.getCurrentDateTransactionDetailsMerchantURL, transaction);
  }
  //getAnimaterName
  getAnimaterName(stateName: string, districtName: string, ngoId: string): Observable<any> {
    return this.httpClient.get(`${this.getAnimaterNameURL}/?State=${stateName}&District=${districtName}&Ngo_id=${ngoId}`);
  }
  // SHG Group Table Report 
  getShgDetails(shgDetailsRequest: ShgDetailsRequest): Observable<any> {
    return this.httpClient.post(this.shgDetailsURL, shgDetailsRequest);
  }
  // SHG Group Delete 
  shgGroupDelete(listOfGroupId: any): Observable<any> {
    return this.httpClient.post(this.shgGroupDeleteURL, listOfGroupId);
  }
  // SHG member individual Group Member Table Report 
  shgGroupMembers(ngoId: String, groupId: string): Observable<any> {
    return this.httpClient.post(`${this.getShgGroupMembersURL}?ngoid=${ngoId}&Group_id=${groupId}`, null);
  }
  // SHG member Delete  
  shgMemberDelete(listOfMemberId: any): Observable<any> {
    return this.httpClient.post(this.shgMemberDeleteURL, listOfMemberId);
  }
  // Model change >> Plan change request status 
  merchantPlanRequestStatus(merchantCode: string): Observable<any> {
    const body = JSON.stringify('');
    const params = new HttpParams()
      .set('MerchantId', merchantCode)
    return this.httpClient.post(this.merchantmodelChangeURL, body, { 'params': params })
  }
  getBankBranchTableState(UserType: string, UserLevel: string, State: string) {
    const header = { 'content-type': 'application/json' }
    const body = JSON.stringify("");
    const params = new HttpParams()
      .set('UserType', UserType)
      .set('UserLevel', UserLevel)
      .set('State', State)
    return this.httpClient.post(this.bankBranchReportURL, body, { headers: header, 'params': params })
  }
  modelchangeApproved(merchantid: string, approvedid: any): Observable<any> {
    const body = JSON.stringify('');
    const param = new HttpParams().set('MerchantID', merchantid).set('ApprovalId', approvedid);
    return this.httpClient.post(this.merchantModelChangeApprovedURL, null, { 'params': param })
  }
  modelchangeRejected(merchantid: string, approvedid: any): Observable<any> {
    const body = JSON.stringify('');
    const param = new HttpParams().set('MerchantID', merchantid).set('ApprovalId', approvedid);
    return this.httpClient.post(this.merchantModelChangeRejectedURL, null, { 'params': param })
  }
  deviceUnmapping(merchnatid: string): Observable<any> {
    return this.httpClient.get<any>(`${this.deviceunmapURL}/?MerchantID=${merchnatid}`);
  }
  //district details Method for model change
  districtNameFetchModelChange(selectedStateName: string): Observable<any> {
    return this.httpClient.get<any>(`${this.districtNameURL}/?state_name=${selectedStateName}`);
  }
  //get user type
  getUserType(): Observable<any> {
    return this.httpClient.get(this.userTypeURL);
  }
  // Transaction status using reference number URL
  getStatus(transaction: TransactionRequest): Observable<any> {
    return this.httpClient.post(this.transactionStatementURL, transaction)
  }
  //PAN
  getPan(pan: Wallettopuprequest): Observable<any> {
    return this.httpClient.post<any>(this.Panurl, pan);
  }



  //DIGI GOLD
  getDigi(digi: Wallettopuprequest): Observable<any> {
    return this.httpClient.post<any>(this.Digiurl, digi);
  }

  //get bbps table report
  getWalletHistoryReport(walletRequest: WalletHistoryRequest): Observable<any> {
    return this.httpClient.post(this.walletHistoryTableURL, walletRequest)
  }

  //get bbps table report
  getRechargeReport(rechargeRequest: RechargeRequestDetails): Observable<any> {
    return this.httpClient.post(this.rechargeTableDetailsURL, rechargeRequest)
  }

  //get shgpayout table report
  getaepsMatmReport(apesMatmRequest: ApesMatmRequestDetails): Observable<any> {
    return this.httpClient.post(this.aepsMatmTableURL, apesMatmRequest)
  }

  getwalletBalance(balance: Walletbalancerequest): Observable<any> {
    return this.httpClient.post<any>(this.walletBalance, balance);
  }
  // WALLET TOPUP
  getwalletTopup(topup: Walletbalancerequest): Observable<any> {
    return this.httpClient.post<any>(this.walletTopup, topup);
  }

  // wallet incentive 
  getwalletIncentive(incentive: Walletincentiverequest): Observable<any> {
    return this.httpClient.post<any>(this.walletincentive, incentive);
  }
  //get shgpayout table report
  getSHGPayoutReport(shgPayoutRequest: ShgPayoutRequestDetail): Observable<any> {
    return this.httpClient.post(this.shgPayoutTableURL, shgPayoutRequest)
  }

  //get dmt table details
  getDmtReport(dmtRequest: DmtRequest): Observable<any> {
    return this.httpClient.post(this.dmtTableDetailsURL, dmtRequest)
  }

  //get bbps table report
  getBbpsReport(bbpsRequest: BbpsRequest): Observable<any> {
    return this.httpClient.post(this.bbpsTableDetailsURL, bbpsRequest)
  }

  merchantWalletbalancefetch(merchantid: string): Observable<any> {
    return this.httpClient.get<any>(`${this.merchantwalletbalanceURL}/?MerchantID=${merchantid}`)
  }

  savingsList(statenameSelected: string, districtnameSelected: string, selectedIaName: string): Observable<any> {
    return this.httpClient.get<any>(`${this.shgsavingsListUrl}/?State_Name=${statenameSelected}&District_Name=${districtnameSelected}&IAName=${selectedIaName}`)
  }

 // private merchantTopUpURLf ="https://pay.anniyam.in/api/WalletTopupRefund/v3/wallet/topup";

  

  merchantTopUpCalling(merchantRequest: EncryptionDTO): Observable<any> {
    const header = { 'content-type': 'application/json' }
    const body = JSON.stringify('');
    const params = new HttpParams()
      .set('API_Call', "Manual")
    return this.httpClient.post(this.merchantTopUpURL, merchantRequest, { headers: header, 'params': params })
  }
  // ================================= JAVA unused service =======================
  // private userProfileURL = "https://uatapi.anniyam.in/adminportal-service/user/fetch/userID";
  // checkUserProfile(userId: any): Observable<any> {
  //   return this.httpClient.get<any>(`${this.userProfileURL}/?userID=${userId}`);
  // }
  // private otpURL = "https://uatapi.anniyam.in/adminportal-service/email/send/otp";
  // getOTP(emailAddress: string): Observable<any> {
  //   return this.httpClient.get<any>(`${this.otpURL}/?email=${emailAddress}`);
  // } 
  // private verifyOTPURL = "https://uatapi.anniyam.in/adminportal-service/email/verification/otp";
  // getOTPVerification(emailAddress: string, otp: string): Observable<any> {
  //   return this.httpClient.get<any>(`${this.verifyOTPURL}/?email=${emailAddress}&otp=${otp}`);
  // } 
  // private userDetailsURl = "https://uatapi.anniyam.in/adminportal-service/user/fetch/userID"
  // fetchUserDetails(userID: any): Observable<any> {
  //   return this.httpClient.get<any>(`${this.userDetailsURl}/?userID=${userID}`);
  // }
}
