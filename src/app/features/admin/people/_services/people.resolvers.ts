import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { PeopleDataService } from '@features/admin/people/_services/people-data.service';
import { ApiResponse } from '@shared/shared.models';


@Injectable()
export class PeopleResolver implements Resolve<any>
{
    constructor(private _data: PeopleDataService)
    {
    }

    /**
     * Resolver for person detail page
     *
     */
    resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<ApiResponse>
    {
        return this._data.getPersonById$(+route.paramMap.get('id'));
    }

}