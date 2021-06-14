import { Component, ElementRef, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs/operators';
import { GroupTypeGroupsSelectControlDataService } from './group-type-groups-select-control-data.service';
import { SelectItem } from '@shared/shared.models';

/*
 *  https://www.truecodex.com/course/angular-6/cascading-or-dependent-dropdown-list-country-state-city-in-angular-6-7
 */
@Component( {
    selector: 'cm-group-type-groups-control',
    templateUrl: './group-type-groups-select-control.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef( () => GroupTypeGroupsSelectControlComponent ),
            multi: true
        }
    ]
} )
export class GroupTypeGroupsSelectControlComponent implements ControlValueAccessor, OnInit, OnDestroy {

    public form = new FormGroup( {
        groupTypeId: new FormControl( null, [Validators.required] ),
        groupId: new FormControl( null),
    } );

    groupTypes$: Observable<SelectItem[]> = this._data.getGroupTypes$();
    groups$: Observable<SelectItem[]>;

    private readonly _destroyed$: Subject<void> = new Subject();

    constructor( private _elementRef: ElementRef, private _data: GroupTypeGroupsSelectControlDataService ) { }

    ngOnInit(): void
    {
        // Responds to changes in the church select and loads the groups
        this.groups$ = this.form.get('groupTypeId')
            .valueChanges
            .pipe(takeUntil(this._destroyed$))
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                switchMap( (groupTypeId: number) => this._data.getGroups$(groupTypeId))
            );
    }

    writeValue( groupTypeAndGroup: any ): void
    {
        if ( groupTypeAndGroup ) {
            this.form.patchValue( groupTypeAndGroup );
        }
    }

    registerOnChange(fn: any): void
    {
        this.form.valueChanges
            .pipe(takeUntil( this._destroyed$ ))
            .subscribe( fn );
    }

    registerOnTouched(fn: any): void
    {
        this._elementRef.nativeElement.querySelectorAll( '*' ).forEach(
            ( element: HTMLElement ) => {
                fromEvent( element, 'blur' )
                    .pipe(
                        takeUntil( this._destroyed$ ),
                        tap( x => fn() )
                    ).subscribe();
            }
        );
    }

    setDisabledState?(isDisabled: boolean): void
    {
        isDisabled ? this.form.disable() : this.form.enable();
    }

    ngOnDestroy(): void
    {
        this._destroyed$.next();
        this._destroyed$.complete();
    }
}
