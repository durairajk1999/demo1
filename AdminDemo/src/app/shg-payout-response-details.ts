import { ShgPayoutResponseDataList } from "./shg-payout-response-data-list";

export class ShgPayoutResponseDetails {



    status!:string;
    responseCode!:number;
    data!:ShgPayoutResponseDataList[];
    message!:string;
}
