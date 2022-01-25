import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FamiliesDataService } from '@features/admin/people/families';

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

    constructor(private _data: FamiliesDataService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get family by id
     */
    getById$(missionId: number) {
        return this._data.getFamilyById$(missionId)
            .pipe(
                tap(family => this._family.next(family))
            );
    }
}

