export class ResponseMerchantReport {

    Id!: number
    Merchant_Code!: string
    Merchant_Name!: string
    Ngo_Id!: string
    Ngo_Name!: string
    City!: string
    State!: string
    Total_Transactions!: number
    Total_Value!: any
    Total_SuccessTrans!: number
    Success_Value!: any;
    Success_Percent!: number
    Total_FailureTrans!: number
    Failure_Value!: number
    Failure_Percent!: number
    Incentive!: any
}
