import { Result } from "./result";

export class ServiceTypeResponse {



    id!:number
    serviceType!:string
    status!:string;
    message!:string;
    result: Result[]=[];
}
