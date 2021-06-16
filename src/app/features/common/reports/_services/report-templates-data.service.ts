import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ReportTemplatesDataService
{
    private _reports = new ReplaySubject<Flexmonster.Report[]>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for reports
     */
    get reports$(): Observable<Flexmonster.Report[]>
    {
        return this._reports.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the reports
     *
     */
    getAllReports$(): Observable<Flexmonster.Report[]>
    {
        return this._httpClient.get<Flexmonster.Report[]>('api/common/reports')
            .pipe(
                tap(reports => this._reports.next(reports))
            );
    }

    /**
     * Get the report
     *
     * @param name
     */
    getReport$(name: string): Observable<Flexmonster.Report>
    {
        return this._httpClient.get<Flexmonster.Report>('api/common/reports', {params: {name}});
    }
}