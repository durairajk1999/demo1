
import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree
} from "@angular/router";
import { ServicesService } from '../services.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: ServicesService,
        private router: Router) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | Promise<boolean> {

        var isAuthenticated2 = this.authService.authGuardValue;

        var isAuthenticated = this.authService.isLoggedIn;

        this.authService.userMenuUrl = JSON.parse(sessionStorage.getItem('userMenuUrl')  || '[]');
        //User navigate urls
        var menuUrls = this.authService.userMenuUrl;

        if (isAuthenticated2 || isAuthenticated) {
            //current routing url
            
            if (menuUrls.some(e => state.url.includes(e)) || state.url === "/Admin") {
              
                return true;
            }
            else {
                return false;
            }
        }
        else {
           
            this.router.navigate(['/admin']);
            return false;
        }
    }
}
