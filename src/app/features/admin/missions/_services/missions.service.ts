import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MissionsDataService } from '@features/admin/missions';
import { tap } from 'rxjs/operators';

@Injectable()
export class MissionsService
{
    private _missions: BehaviorSubject<any[]> = new BehaviorSubject([]);
    private _mission: BehaviorSubject<any> = new BehaviorSubject(null);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for missions
     */
    get missions$(): Observable<any[]>
    {
        return this._missions.asObservable();
    }

    /**
     * Getter for mission
     */
    get mission$(): Observable<any>
    {
        return this._mission.asObservable();
    }

    constructor(private _data: MissionsDataService)
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

    /**
     * Get mission by id
     */
    getMissionById$(missionId: number) {
        return this._data.getMissionById$(missionId)
            .pipe(
                tap(missions => this._missions.next(missions))
            );
    }
}

