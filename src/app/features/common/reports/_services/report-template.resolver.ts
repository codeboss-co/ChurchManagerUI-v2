import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ReportTemplatesDataService } from '@features/common/reports/_services/report-templates-data.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
    export class ReportTemplateResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _data: ReportTemplatesDataService)
    {
    }

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Flexmonster.Report>
    {
        /**
         * @summary this is specified on the route i.e. 'cell-ministry.module.ts'
         */
        const reportName = route.data['report'];
        
        if (!reportName) throw new Error('report name is required');

        return this._data.getReport$(reportName);
    }
}