import { FTBeneficiaryDetailsDTO } from "./FTBeneficiaryDetailsDTO";

export class NotifyResponse 
{



    statusCode!:BigInteger;

    message!:string;

   responseContent!:FTBeneficiaryDetailsDTO[];
}