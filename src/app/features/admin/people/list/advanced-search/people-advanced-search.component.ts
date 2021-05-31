import { ChangeDetectionStrategy, Component, OnInit, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PersonAdvancedSearchQuery } from '@features/admin/people/contacts.types';

@Component({
    selector: 'people-advanced-search',
    templateUrl: './people-advanced-search.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleAdvancedSearchComponent implements OnInit {

    searchForm: FormGroup;

    @Output() searchChanged = new EventEmitter<PersonAdvancedSearchQuery>();

    connectionStatusMap = new Map<string, string>([
        ['member', 'Member'],
        ['firstTimer', 'First Timer'],
        ['newConvert', 'New Convert']
    ]);

    ageClassificationMap = new Map<string, string>([
        ['adult', 'Adult'],
        ['children', 'Children']
    ]);

    genderMap = new Map<string, string>([
        ['male', 'Male'],
        ['female', 'Female'],
        ['unknown', 'Unknown']
    ]);

    constructor(private _formBuilder: FormBuilder)
    {
    }

    ngOnInit(): void
    {
        this.searchForm = this._createForm();
    }

    updateSearch()
    {
        this.searchChanged.emit(this.searchForm.getRawValue())
        console.log('updateSearch');
    }

    private _createForm(): FormGroup
    {
        return this._formBuilder.group({
            connectionStatus : this._formBuilder.group({
                member  : [false],
                firstTimer      : [false],
                newConvert: [false]
            }),

            ageClassification : this._formBuilder.group({
                adult  : [false],
                children      : [false]
            }),

            gender : this._formBuilder.group({
                male  : [false],
                female      : [false],
                unknown: [false]
            })

        });
    }
}
