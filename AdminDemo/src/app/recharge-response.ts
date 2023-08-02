import { RechargeResponseContent } from "./recharge-response-content";

export class RechargeResponse {


  statusCode !: number;
  message !: string;
  responseContent !: RechargeResponseContent;
}

