import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MissionsService } from '@features/admin/missions/_services/missions.service';

/**
 * Missions Resolvers
 */
@Injectable()
export class MissionsResolvers implements Resolve<any>
{

    constructor(private _service: MissionsService)
    {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._service.getMissions$(1);
    }
}