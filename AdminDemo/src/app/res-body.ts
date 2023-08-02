import { StatementList } from "./statement-list";

export class ResBody {

    customer_id!: string;
    cod_acct_no !: string;
    cust_name!: string;
    txn_start_date!: string;
    txn_end_date!: string;
    opening_balance!: string;
    closing_balance!: string;
    error_msg!: string;
    error_reason!: string;
    statement!: StatementList[];
}
