import { Component, ElementRef, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ChurchGroupsSelectControlDataService } from './church-groups-select-control-data.service';
import { SelectItem } from '@shared/shared.models';

/*
 *  https://www.truecodex.com/course/angular-6/cascading-or-dependent-dropdown-list-country-state-city-in-angular-6-7
 */
@Component( {
    selector: 'cm-church-groups-control',
    templateUrl: './church-groups-select-control.component.html',
    styleUrls: ['./church-groups-select-control.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef( () => ChurchGroupsSelectControlComponent ),
            multi: true
        }
    ]
} )
export class ChurchGroupsSelectControlComponent implements ControlValueAccessor, OnInit, OnDestroy {

    @Input() allowAllGroupsSelect = true;
    @Input() noSelectionLabel = '-- All Groups --';
    @Input() required = true;

    public form = new FormGroup( {
        churchId: new FormControl( null, [Validators.required] ),
        groupId: new FormControl( null),
    } );

    churches$: Observable<SelectItem[]> = this._data.getChurches$();
    groups$: Observable<SelectItem[]>;
    groups: SelectItem[] = [];

    private readonly _destroyed$: Subject<void> = new Subject();

    constructor( private _elementRef: ElementRef, private _data: ChurchGroupsSelectControlDataService ) { }

    ngOnInit(): void
    {
        // Responds to changes in the church select and loads the groups
        this.groups$ = this.form.get('churchId')
            .valueChanges
            .pipe(takeUntil(this._destroyed$))
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                switchMap( (churchId: number) => this._data.getGroups$(churchId))
            );

        this.form.get('churchId')
            .valueChanges
            .pipe(takeUntil(this._destroyed$))
            .pipe(
                switchMap( (churchId: number) => this._data.getGroups$(churchId))
            ).subscribe(groups =>  this.groups = groups);
    }

    writeValue( churchAndGroup: {churchId: number; groupId: number} ): void
    {
        if ( churchAndGroup ) {
            console.log('churchAndGroup', churchAndGroup);
            this.form.get('churchId').setValue(churchAndGroup.churchId);
            this.form.get('groupId').setValue(churchAndGroup.groupId);

            //this.form.patchValue( churchAndGroup );
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
