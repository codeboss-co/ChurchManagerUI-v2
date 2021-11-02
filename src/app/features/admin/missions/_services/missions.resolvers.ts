import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { MissionsService } from '@features/admin/missions/_services/missions.service';
import { GroupAttendanceRecord } from '@features/admin/groups/cell-ministry/cell-ministry.model';

/**
 * Missions Resolvers
 */
@Injectable()
export class MissionsResolver implements Resolve<any>
{

    constructor(private _service: MissionsService)
    {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._service.getMissions$(1);
    }
}

/**
 * Single Mission by id Resolvers
 */
@Injectable()
export class MissionResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _service: MissionsService)
    {
    }

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<GroupAttendanceRecord>
    {
        return this._service.getMissionById$(+route.paramMap.get('id'));
    }
}