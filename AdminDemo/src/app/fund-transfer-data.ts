import { Meta } from "@angular/platform-browser";
import { Initiation } from "./initiation";
import { Risk } from "./risk";

export class FundTransferData {





    ConsentId!:string;
    CreationDateTime!:String;
    Status!:string;
    StatusUpdateDateTime!:string;
    TransactionIdentification!:string;
    Initiation!:Initiation;
    Risk!:Risk;
    Meta!:Meta;

}
