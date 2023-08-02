import { Locations } from "./locations";
import { Operaters } from "./operaters";

export class RechargeResponseContent {


balance !: string;
status !: string;
Balance!:string;
Status!:string;


operators !: Operaters[];
locations !: Locations[];

//sampleRechargeResponse
Amount !: string;
IsPostPaid !: string;
CommissionAmount !: string;
date !: string;
failureReason !: string;
IsSpecial !: string;
Location !: string;
Message !: string;
provider !: string;
RechargeNumber !: string;
RechargeRequestDateTime !: string;
ServiceType !: string;
SystemReference !: string;
TransactionReference !: string;

FailureReason!:string;

NickName!:string;


OperatorTransactionId!:string;

Provider!:string;








// Amount
// : 
// "10"
// CommissionAmount
// : 
// "0.1500"
// FailureReason
// : 
// ""
// IsPostPaid
// : 
// "N"
// IsSpecial
// : 
// "N"
// Location
// : 
// "Tamilnadu"
// Message
// : 
// "Recharge Successful"
// NickName
// : 
// ""
// OperatorTransactionId
// : 
// "LJ244925188"
// Provider
// : 
// "Jio"
// RechargeNumber
// : 
// "9884300283"
// RechargeRequestDateTime
// : 
// "19/06/2023 03:26 PM"
// ServiceType
// : 
// "M"
// Status
// : 
// "0"
// SystemReference
// : 
// "AE33000136202306191526130767"
// TransactionReference
// : 
// "LWRNBE242035897"
// date
// : 
// "19/06/2023 03:26 PM"

}
