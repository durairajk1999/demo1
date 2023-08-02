import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MasterMenuOrderChange } from './master-menu-order-change'; 
import { EncryptionDTO } from './encryption-dto';
import { EnvService } from './service/env.service';

@Injectable({
  providedIn: 'root'
})
export class MenusOrderingServiceService {

  constructor(private httpClient:HttpClient,private router:Router,private env:EnvService) { }

  private menusOrderingGroupListURL=this.env.adminPortalUrl+"/group/fetchAllActive"; // 21
  private menusListURL=this.env.adminPortalUrl+"/masterMenu/fetch/groupId"; // 22

 // https://uatapi.anniyam.in/adminportal/group/fetchAllActive";

  private masterMenuOrderURL = this.env.adminPortalUrl+"/masterMenu/groupMenu/order/update"; // 23
  getGroupList(): Observable<any> {

    
    return this.httpClient.get(`${this.menusOrderingGroupListURL}`);
  }
  getMenu(groupId:string): Observable<any> {
   
    let params=new HttpParams()
    params=params.append("groupId",groupId)
    return this.httpClient.get(`${this.menusListURL}`,{params});
  }

  updateMasterMenuOrder(menuOrderList : EncryptionDTO) : Observable<any>{

    

    return this.httpClient.post(this.masterMenuOrderURL,menuOrderList);
  }
}