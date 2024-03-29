import { Inject, Injectable } from '@angular/core';
import { HttpBaseService } from '@shared/api/http-base.service';
import { HttpClient } from '@angular/common/http';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiResponse } from '@shared/shared.models';
import { map, tap } from 'rxjs/operators';
import {
    DiscipleshipProgramDetailModel,
    DiscipleshipProgramsForPerson
} from '@features/admin/discipleship/discipleship.models';

@Injectable()
export class ProfileDiscipleshipService extends  HttpBaseService
{
    private _programs: BehaviorSubject<DiscipleshipProgramsForPerson> = new BehaviorSubject(null);

    private _apiUrl = this._environment.baseUrls.apiUrl;

    constructor(
        private http: HttpClient,
        @Inject(ENV) private _environment: Environment )
    {
        super(http);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for categories
     */
    get programs$(): Observable<DiscipleshipProgramsForPerson>
    {
        return this._programs.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get Discipleship info for person
     *
     */
    getDiscipleshipStepsForPerson$(personId: number | undefined): Observable<DiscipleshipProgramsForPerson>
    {
        const body = { personId };

        return super.post<ApiResponse>(`${this._apiUrl}/v1/discipleship/person/programs`, body)
            .pipe(
                map(response => response.data),
                tap(programs => this._programs.next(programs.map(x => new DiscipleshipProgramDetailModel(x))))
            );
    }
}