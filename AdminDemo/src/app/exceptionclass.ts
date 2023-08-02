import { ErrorHandler, Injectable } from "@angular/core";

@Injectable()
export class Exceptionclass implements ErrorHandler {

    constructor()
    {

    }

    handleError(error: any){
        // throw new Error("Method not implemented.");

       

        alert(error.message);
    }
}
