import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MyAlertService } from './myAlert.service';
import { ApiService } from './api.service';
import { Sonuc } from '../models/Sonuc';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private apiServis: ApiService,
        private alert: MyAlertService,
        private router: Router

    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        var yetkiler = route.data["yetkiler"] as Array<string>;
        var giturl = route.data["gerigit"] as string;
        if (!this.apiServis.OturumKontrol() || !yetkiler.length) {
            this.router.navigate([giturl]);
            return false;
        }

        var s: boolean = false;

        s = this.apiServis.yetkiKontrol(yetkiler);
        if (!s) {
            this.router.navigate([giturl])
        }

        return s;
    }

}
