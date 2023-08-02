import { MenuOrderingTableResponseParentMenu } from "./menu-ordering-table-response-parent-menu";
import { MenuOrderingTableResponseRoleGroup } from "./menu-ordering-table-response-role-group";

export class MenuOrderingTableResponseContent {

    sno!:any;
    createdDate!:string;
    createdBy!:any;
    modifiedDate!:string;
    modifiedBy!:any;
    masterMenuId!:any
    masterMenuName!:string;
    orderId!:any;
    roleGroup!:MenuOrderingTableResponseRoleGroup
    parentMenu!:MenuOrderingTableResponseParentMenu
}




