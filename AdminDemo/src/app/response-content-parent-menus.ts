import { ParentMenu } from "./parent-menu";
import { RoleGroupClass } from "./role-group-class";
import { Rolebasedongroup } from "./rolebasedongroup";

export class ResponseContentParentMenus {

    roleGroupId!:any;

    roleGroupName!:string;
    masterMenuId!:number;
    masterMenuName!:string; // "Dashboard",
    roleId!:number;
    roleName!:string;
    
     
    
    // new one 
    
    groupID!:string;
        
    parentMenuID!:string;
    
    //master menu update
    
    groupId!:any;
    parentMenuId!:any;
    oldMasterMenuId !:any;
    newMasterMenuName!:any;
    navigateUrl!:any;
    iconName!:any;
    iconClassName!:any;
    //modifiedBy!:string;
    newGroupId!:any;
    newParentMenuId!:any;
    
        //
    
    
    
    
    active!: any;
    createdBy!: string;
    createdDate!: string;
    modifiedBy!: any;
    modifiedDate!: string;
    //iconClassName!: string;
    //iconName!: string;
    //parentMenuId!: number;
    parentMenuName!: string;
    
    roleGroup!:RoleGroupClass;
    parentMenu!:ParentMenu;
    
    //navigateUrl!:string;
    orderId!:number;
    
    
    
    
        accNo!:string;
        customerId!:string;
        
      
    // role fetch based on group id
    roles!:Rolebasedongroup[];
       
        
    // Account details for FundTransfer 
    
    
    userId:any;
    addressLine!:string;
    appID!:string;
    beneficiaryAccountNumber!:string;
    beneficiaryIFSC!:string;
    beneficiaryName!:string;
    country!:string
    countrySubDivision!:string
    customerIdOfDebitAccount!:string;
    customerRequestReferenceNumber!:string;
    debitAccountNumber:any;
    maxlimit!:string;
    remarks!:string;
    status!:string;
    transactionId!:string;
    transferAmount!:string;
    transferCurrencyCode!:string;
    transferType!:string;
    shortName!:string;
    bankName!:string;
    branchName:any;
    ifin:any;
    navigationUrl:any;

    
    }
    