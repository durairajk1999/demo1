import { CreditorAccount } from "./creditor-account";
import { DebtorAccount } from "./debtor-account";
import { InstructedAmount } from "./instructed-amount";
import { RemittanceInformation } from "./remittance-information";

export class Initiation {


    clearingSystemIdentification!:String;

    endToEndIdentification!:string;

    instructionIdentification!:string;

    CreditorAccount!:CreditorAccount;

    DebtorAccount!:DebtorAccount;

    InstructedAmount!: InstructedAmount;

    RemittanceInformation!:RemittanceInformation;

    


}
