import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { GroupAttendanceRecord } from '@features/admin/groups/cell-ministry/cell-ministry.model';
import { CellMinistryDataService } from '@features/admin/groups/cell-ministry/_services/cell-ministry-data.service';
import { Injectable } from '@angular/core';
import { CellGroupPerformanceDataService } from '@features/admin/groups/cell-ministry/_services/cell-group-performance-data.service';
import { PeriodTypes } from '@shared/shared.models';

@Injectable()
export class CellMinistryAttendanceReportResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _data: CellMinistryDataService)
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
        return this._data.getAttendanceRecordById$(+route.paramMap.get('id'));
    }
}

@Injectable()
export class CellMinistryDashboardResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _data: CellMinistryDataService)
    {
    }

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._data.getDashboardData$();
    }
}


@Injectable()
export class CellGroupPerformanceResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _data: CellGroupPerformanceDataService)
    {
    }

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        // Try extract groupId from route
        const { groupId } = route.params;

        return this._data.getGroupPerformanceRecord$(+groupId, PeriodTypes.ThisMonth);
    }
}