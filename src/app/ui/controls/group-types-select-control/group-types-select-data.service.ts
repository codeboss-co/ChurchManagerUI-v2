import { Inject, Injectable } from '@angular/core';
import { HttpBaseService } from '@shared/api/http-base.service';
import { HttpClient } from '@angular/common/http';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { Observable } from 'rxjs';
import { ApiResponse, SelectItem } from '@shared/shared.models';
import { map, share } from 'rxjs/operators';

@Injectable()
export class GroupTypesSelectDataService extends HttpBaseService {
    private _apiUrl = this._environment.baseUrls.apiUrl;

    constructor(
        private http: HttpClient,
        @Inject(ENV) private _environment: Environment) {
        super(http);
    }

    /**
     * Get group types select information
     *
     * @returns {Observable<SelectItem[]>}
     */
    getGroupTypes$(): Observable<SelectItem[]>
    {
        return super.get<ApiResponse>(`${this._apiUrl}/v1/groups/types`)
            .pipe(
                share(),
                map(response => response.data)
            );
    }
}