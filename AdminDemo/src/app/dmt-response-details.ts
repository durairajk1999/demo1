import { DmtResponseDataList } from "./dmt-response-data-list";

export class DmtResponseDetails {




    status!:string;
    responseCode!:number;
    data!:DmtResponseDataList[];
    message!:string;
}
