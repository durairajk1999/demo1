import { MenuOrderingTableResponseContent } from "./menu-ordering-table-response-content";

export class MenuOrderingTableResponse {

    statusCode!: number;
    message!: string;
    responseContent!: MenuOrderingTableResponseContent[]
}
