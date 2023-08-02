import { ResponseContentGroup } from "./response-content-group";

export class RoleList {

    createdDate!:string;
    createdBy!:string;
    modifiedDate!:string;
    modifiedBy!:string;
    roleId!:number;
    roleName!:string;
    active!:boolean;
    roleGroup!:ResponseContentGroup;
}