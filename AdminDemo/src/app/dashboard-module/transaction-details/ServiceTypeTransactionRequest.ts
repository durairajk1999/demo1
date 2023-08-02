import { ZonalFilterListRequest } from "./ZonalFilterListRequest";

export class ServiceTypeTransactionRequest {
    zonalFilter!:ZonalFilterListRequest[]
    merchantID!:string
    fromDate!: string
    toDate!: string
    type!:string
    ngoID!:string
}