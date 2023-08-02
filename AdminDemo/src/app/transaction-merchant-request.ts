import { District } from "./District";
import { MerchantStateRequest } from "./merchant-state-request";

export class TransactionMerchantRequest {





    state!:MerchantStateRequest[];
    district!:District[];
    fromDate!:string;
    toDate!:string;
}
