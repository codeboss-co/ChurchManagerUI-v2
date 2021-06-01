import { ChangeDetectionStrategy, Component, OnInit, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PeopleAdvancedSearchQuery, SearchItem } from '@features/admin/people';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'people-advanced-search',
    templateUrl: './people-advanced-search.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleAdvancedSearchComponent implements OnInit {

    @Output() searchChanged = new EventEmitter<PeopleAdvancedSearchQuery>();

    selection = new SelectionModel<SearchItem>(true, []);
    searchForm: FormGroup;

    connectionStatusMap = ['Member',  'First Timer',  'New Convert'];
    ageClassificationMap = ['Adult', 'Child'];
    genderMap = ['Male', 'Female', 'Unknown'];

    constructor(private _formBuilder: FormBuilder)
    {
    }

    ngOnInit(): void
    {
        this.searchForm = this._createForm();
    }

    updateSearch()
    {
        const model: PeopleAdvancedSearchQuery = {
            connectionStatus: this._selectedItemsByGroup('connectionStatus'),
            ageClassification: this._selectedItemsByGroup('ageClassification'),
            gender: this._selectedItemsByGroup('gender'),
        };

        this.searchChanged.emit(model)
    }

    selectSearchItem( group: string, key: string,  checked: boolean )
    {
        // SelectionModel works by checking object references
        // This code makes sure we only add an item to selected if its not already there
        // If we are changing from selected to deselected we find the selection and update
        if ( checked ) {
           if ( !this.selection.selected.find( x => x.key === key) ) {
               this.selection.select( { group, key });
           }
        }
         else {
             const selection = this.selection.selected.find( x => x.key === key)
            this.selection.deselect(selection);
        }

         console.log('selection', this.selection.selected);
    }

    private _createForm(): FormGroup
    {
        return this._formBuilder.group({


        });
    }

    private _selectedItemsByGroup(group: string): string[]
    {
        return  this.selection.selected
            .filter(x => x.group === group)
            .map(x => x.key)
    }
}
