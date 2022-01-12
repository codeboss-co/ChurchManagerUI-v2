import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { MissionDetailComponent } from '@features/admin/missions/_components/detail/mission-detail.component';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CanDeactivateMissionDetail implements CanDeactivate<MissionDetailComponent>
{
    canDeactivate(
        component: MissionDetailComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return undefined;
    }
}
