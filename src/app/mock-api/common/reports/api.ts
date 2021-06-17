import { Injectable } from '@angular/core';
import { reportsData } from './data';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { cloneDeep } from 'lodash-es';

@Injectable({
    providedIn: 'root'
})
export class ReportsMockApi
{
    private _reports: Flexmonster.Report[] = reportsData;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ Reports - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/reports')
            .reply(() => [200, cloneDeep(this._reports)]);

        // -----------------------------------------------------------------------------------------------------
        // @ Report - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/common/reports')
            .reply(({request}) => {

                // Get the name
                const name = request.params.get('name');
                console.log('name', name, 'reports api')
                // Find the report
                const index = this._reports.findIndex((item: Flexmonster.Report) => item.dataSource.type === name);

                // Store the deleted report
                const foundReport = cloneDeep(this._reports[index]);

                // Return the response
                return [200, foundReport];
            });
    }
}