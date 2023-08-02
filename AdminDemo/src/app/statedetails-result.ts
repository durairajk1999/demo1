import { ShgMemberResult } from "./shg-member-result";

export class StatedetailsResult 
{

 
// state details    
state_code!:any;
state_name!:string;

// district details
district_Code!:string;
district_name!:string;

// Ia Details
conNo_CEO!:string;
district_Name !:string;
id!:number;
name_of_CEO!:string;
name_of_SHPI!:string;
state_Name!:string;




requestedDate!:any;
updatedDate!:any;
// Merchant Details 


merchantID!:string;                   
ngo_id!:string;
trainers_Name!:string;
serialId!:string;

updatedBy!:any;

// Merchant table report

merchantId!:string;
merchantName!:string;
requestedBy!:string;
status!:string;
district!:string;
state!:string;


// shg counts variables
    ia!:string
    no_Of_SHGs!:string
    onlyTransaction!:string
    onlyBookKeeping!:string
    bothTransactionBookKeeping!:string


//Ia creation

category!: string;
reg_No!: string;
reg_Date!: string;
name_of_MIS_Operator!:string;
conNo_MIS_Operator!: string;
name_of_Secretary!: string;
email_ID1_SHPI!: string;
email_ID2_SHPI!: string;
user_Id!: string;
active!: string;
user_Level!: string;
ngO_Name_Flag!: string;
ngO_Logo_Flag!: string;
ngO_Member_Flag!: string;
shG_Trans_Com!: string;
ngO_Payout_Flag!: string;



//bank branch Details search username 
Username!:string;
userLevel!: string;
user_Type!: string;


// bank Branch creation
type!:string;
bank_agency!:string;
bank!:string;
brancH_NAME!: string;
ifsC_CODE!: string;
contact!: string

// block details
block_code!:string;
block_name!:string;

//panchayat details
village_panchayat_code!:string;
village_panchayat_name!:string;


// Animator details

animatorId!:string;
animatorName!:string;
animatorUsername!:string;




group_id!:string;
shgCode!:string;
shgName!:string;
username !: string;
password !: string;

  


  

  // merchant balance

incentivewalletamount!:string;
masterwalletamount!:string;
pin!:string;
tpin!:string;


//merchant plan 



  
    
  
    
    model!:string;
    plan_Type!:string;

// 

currentModel!:string;



newModel!:string;








 

  //shg Members response
  // ngo_id !:any;

  mem_Id !: string;
  member_name !: string;
  husband_Father_Name !: string;
  designation !: string;
  savings !: string;
  savings_Disburse !: string;
  loanDetails !: string;
  totLoanAmount !: string;
  loan_OS !: string;
  loan_Type !: string;
  internal_Loan!: any;
  cash_Credit!: any;
  term_Loan!: any;
  mfI_LOAN!: any;
  bulK_LOAN!: any;
  isSelected!:any


  // Merchat TopUp credentials
  utr!:string;
  amount!:string;
  //merchantID!:string;
  requestType!:string;
  transactionType!:string;
  initiationType!:string;

}

// "mem_Id": "13722",
// "member_name": "EZHILARASI",
// "husband_Father_Name": "RAVIKUMAR",
// "designation": "Member",
// "savings": "3616.00",
// "savings_Disburse": "100.00",
// "totLoanAmount": null,



  





