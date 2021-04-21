import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { shareReplay, tap } from 'rxjs/operators';
import { ChurchAttendanceAnnualBreakdown } from './analytics.models';

const CACHE_SIZE = 1;

/**
 * https://blog.thoughtram.io/angular/2018/03/05/advanced-caching-with-rxjs.html
 */
@Injectable()
export class DashboardDataService {

    /**
    * All subsequent consumers will receive the shared instance without re-creating the cache every time
     */
    private _cache$: Observable<ChurchAttendanceAnnualBreakdown[]>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     * @param {Environment} environment
     */
    constructor(
        private _httpClient: HttpClient,
        @Inject(ENV) private environment: Environment
    ) {}

   /**
    * The next time we request the data for the list component,
    * our cache will replay the most recent value and send that to the consumer.
    *  There’s no additional HTTP call involved.
    */
    public getChurchAttendance$(): Observable<ChurchAttendanceAnnualBreakdown[]> {
        if (!this._cache$) {
            this._cache$ = this._getChurchAttendance$()
                .pipe(
                    //  effectively there’s just one subscription to the underlying cold Observable.
                    shareReplay(CACHE_SIZE)
                );
        }

        return this._cache$;
    }

    private _getChurchAttendance$(): Observable<ChurchAttendanceAnnualBreakdown[]> {
        return this._httpClient.get<ChurchAttendanceAnnualBreakdown[]>(
            `${this.environment.baseUrls.apiUrl}/v1/dashboard/church-attendance?from=2019-01-01&to=2022-01-01`)
            .pipe(
                tap(x => console.log('fetch church-attendance', x))
            );
    }
}