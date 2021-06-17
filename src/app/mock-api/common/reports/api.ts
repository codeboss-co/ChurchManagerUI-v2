import { Injectable } from '@angular/core';
import { reportsData } from './data';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { cloneDeep } from 'lodash-es';
import * as WebDataRocks from 'webdatarocks';

@Injectable({
    providedIn: 'root'
})
export class ReportsMockApi
{
    private _reports: Map<string, WebDataRocks.Report> = reportsData;

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
                // Find the report
                const foundReport = cloneDeep(this._reports.get(name));
                // Return the response
                return [200, foundReport];
            });
    }
}