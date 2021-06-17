import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ReportTemplatesDataService
{
    // All report templates loaded
    private _reportTemplates = new ReplaySubject<Flexmonster.Report[]>(1);
    // Single report loaded
    private _reportTemplate = new BehaviorSubject<Flexmonster.Report>(null);

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
    get templates$(): Observable<Flexmonster.Report[]>
    {
        return this._reportTemplates.asObservable();
    }

    /**
     * Getter for reports
     */
    get template$(): Observable<Flexmonster.Report>
    {
        return this._reportTemplate.asObservable();
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
                tap(reports => this._reportTemplates.next(reports))
            );
    }

    /**
     * Get the report
     *
     * @param name
     */
    getReport$(name: string): Observable<Flexmonster.Report>
    {
        return this._httpClient.get<Flexmonster.Report>('api/common/reports', {params: {name}})
            .pipe(
                tap(report => this._reportTemplate.next(report))
            );;
    }
}