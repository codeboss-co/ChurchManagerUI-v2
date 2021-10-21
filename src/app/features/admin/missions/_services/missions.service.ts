import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MissionsDataService } from '@features/admin/missions';
import { tap } from 'rxjs/operators';

@Injectable()
export class MissionsService
{
    private _missions: BehaviorSubject<any[]> = new BehaviorSubject( [] );

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for groups
     */
    get missions$(): Observable<any[]>
    {
        return this._missions.asObservable();
    }

    constructor( private _data: MissionsDataService )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get missions
     */
    getMissions$(groupId: number): Observable<any[]>
    {
        return this._data.getMissions$(groupId)
            .pipe(
                tap(missions => this._missions.next(missions))
            );
    }
}

