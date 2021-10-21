import { Inject, Injectable } from '@angular/core';
import { HttpBaseService } from '@shared/api/http-base.service';
import { HttpClient } from '@angular/common/http';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { Observable } from 'rxjs';
import { ApiResponse } from '@shared/shared.models';
import { map } from 'rxjs/operators';

@Injectable()
export class MissionsDataService extends HttpBaseService {
    private _apiUrl = this._environment.baseUrls.apiUrl;

    constructor(
        private http: HttpClient,
        @Inject( ENV ) private _environment: Environment )
    {
        super( http );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get missions
     */
    getMissions$(groupId: number): Observable<any[]>
    {
        return super.get<ApiResponse>(`${this._apiUrl}/v1/missions/${groupId}/members`, null)
            .pipe(
                map(response => response.data)
            );
    }
}