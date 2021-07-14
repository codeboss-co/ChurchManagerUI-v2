import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    FormControl, NG_VALIDATORS,
    NG_VALUE_ACCESSOR, ValidationErrors,
    Validator,
    ValidatorFn,
    Validators
} from '@angular/forms';
import { Appearance } from '@ui/controls/ google-maps-autocomplete-control/mat-google-maps-autocomplete.model';
import PlaceResult = google.maps.places.PlaceResult;
import MapsEventListener = google.maps.MapsEventListener;
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'mat-google-maps-autocomplete',
    exportAs: 'matGoogleMapsAutocomplete',
    templateUrl: './mat-google-maps-autocomplete.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MatGoogleMapsAutocompleteComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS, // Is an InjectionToken required by this class to be able to be used as an Validator
            useExisting: forwardRef(() => MatGoogleMapsAutocompleteComponent),
            multi: true
        }
    ]
})
export class MatGoogleMapsAutocompleteComponent implements
    OnInit, OnDestroy, AfterViewInit, ControlValueAccessor //, Validator
{
    @ViewChild('search')
    public searchElementRef: ElementRef;

    @Input()
    addressLabelText = 'Address';

    @Input()
    placeholderText = 'Please enter the address';

    @Input()
    requiredErrorText = 'The address is required';

    @Input()
    invalidErrorText = 'The address is not valid';

    @Input()
    appearance: string | Appearance = Appearance.STANDARD;

    @Output()
    changed = new EventEmitter<PlaceResult | string | null>();

    address: PlaceResult = null;

    private _mapsListener: MapsEventListener;

    addressSearchControl = new FormControl( null,
        [Validators.required, this.validate(this.address)]);


    ngOnInit(): void
    {
    }

    ngAfterViewInit()
    {
        const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);

        this._mapsListener = autocomplete.addListener('place_changed', () => {
            console.log('place_changed');

            // get the place result
            const place: PlaceResult = autocomplete.getPlace();
            console.log('place', place);

            // place result is not valid
            if (!place.place_id || place.geometry === undefined || place.geometry === null) {
                return;
            } else {
                this.address = place;
            }
        });
    }

    ngOnDestroy(): void
    {
        if(this._mapsListener)
        {
            google.maps.event.removeListener(this._mapsListener);
        }
    }

    onQuery(event: any)
    {
        this.changed.emit(this.addressSearchControl.value);
    }

    /*public validate(control: AbstractControl): ValidationErrors {
        return control.value && this.address && (this.address as PlaceResult)
            ? null
            : { validAddress: false };
    }*/

    public validate(address: PlaceResult): ValidatorFn {
        console.log('address', address);
        return (control: AbstractControl): ValidationErrors | any => {
            return address ? null : {
                validateAddress: false
            };
        };
    }

    writeValue(obj: any): void
    {
        if (obj) {
            this.addressSearchControl.patchValue(obj);
        }
    }

    registerOnChange(fn: any): void
    {
        this.addressSearchControl.valueChanges
            .subscribe( fn );
    }

    registerOnTouched(fn: any): void
    {
        throw new Error('Method not implemented.');
    }

    setDisabledState?(isDisabled: boolean): void
    {
        throw new Error('Method not implemented.');
    }


}