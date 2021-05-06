import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { GroupsManageService } from '@features/admin/groups/_services/groups-manage.service';

@Injectable()
export class GroupsManageResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _service: GroupsManageService)
    {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._service.getGroupsTree$();
    }
}