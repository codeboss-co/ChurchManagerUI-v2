import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { Observable } from 'rxjs';
import { GroupMemberSimple } from '../../groups/group.model';
import { ApiResponse } from '@shared/shared.models';
import { NewFamilyForm } from '../new-family-form/person-form/person-form.model';
import { HttpBaseService } from '@shared/api/http-base.service';

@Injectable()
export class PeopleDataService extends HttpBaseService
{
    private _apiUrl = this._environment.baseUrls.apiUrl;

    constructor(
        private http: HttpClient,
        @Inject(ENV) private _environment: Environment )
    {
        super(http);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    /**
     * Get group members and their simple information
     *
     * @returns {Observable<GroupMemberSimple[]>}
     */
    addNewFamily$(model: NewFamilyForm): Observable<ApiResponse>
    {
        return super.post<ApiResponse>(`${this._apiUrl}/v1/people/family/new`, model);
    }
}
