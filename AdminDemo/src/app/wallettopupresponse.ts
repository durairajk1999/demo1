
import { Wallettopupdata } from "./wallettopupdata"
export class Wallettopupresponse {
    status!: string
    responseCode!: number
    data!: Wallettopupdata[];
    message!: string
}
