import { ParentMenu } from "./parent-menu";
import { RoleGroupClass } from "./role-group-class";

export class Rolebasedongroup 
{


    roleGroupId!:number;

roleGroupName!:string;
masterMenuId!:number;
masterMenuName!:string; // "Dashboard",
roleId!:number;
roleName!:string;




active!: boolean;
createdBy!: string;
createdDate!: string;
modifiedBy!: string;
modifiedDate!: string;
iconClassName!: string;
iconName!: string;
parentMenuId!: number;
parentMenuName!: string;

roleGroup!:RoleGroupClass;
parentMenu!:ParentMenu;


    
  
  
   
 
  









}
