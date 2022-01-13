import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MissionsDataService } from '@features/admin/missions';
import { tap } from 'rxjs/operators';

@Injectable()
export class FamiliesService
{
    private _families: BehaviorSubject<any[]> = new BehaviorSubject([]);
    private _family: BehaviorSubject<any> = new BehaviorSubject(null);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for missions
     */
    get families$(): Observable<any[]>
    {
        return this._families.asObservable();
    }

    /**
     * Getter for mission
     */
    get family$(): Observable<any>
    {
        return this._family.asObservable();
    }

    constructor(private _data: MissionsDataService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get mission by id
     */
    getById$( missionId: number) {
        return this._data.getFamilyById$(missionId)
            .pipe(
                tap(missions => this._families.next(missions))
            );
    }
}

