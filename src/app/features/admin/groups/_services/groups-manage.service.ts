import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GroupsDataService, GroupWithChildren } from '@features/admin/groups';
import { tap } from 'rxjs/operators';

@Injectable()
export class GroupsManageService
{
    private _groups: BehaviorSubject<GroupWithChildren[]> = new BehaviorSubject([]);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for groups
     */
    get groups$(): Observable<GroupWithChildren[]>
    {
        return this._groups.asObservable();
    }

    constructor( private _data: GroupsDataService )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get groups with their children in the form of a tree
     */
    getGroupsTree$(): Observable<GroupWithChildren[]>
    {
        return this._data.getGroupsTree$()
            .pipe(
                tap(groups => this._groups.next(groups))
            );
    }

    /**
     * Get group by id with their children in the form of a tree
     */
    getGroupTree$(groupId: number): Observable<GroupWithChildren[]>
    {
        return this._data.getGroupTree$(groupId)
            .pipe(
                tap(groups => this._groups.next(groups))
            );
    }
}