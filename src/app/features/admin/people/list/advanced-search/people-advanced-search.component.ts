import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Output,
    ViewEncapsulation,
    EventEmitter,
    ViewChild, ElementRef
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterItem, PeopleAdvancedSearchQuery, SearchItem } from '@features/admin/people';
import { SelectionModel } from '@angular/cdk/collections';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'people-advanced-search',
    templateUrl: './people-advanced-search.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleAdvancedSearchComponent implements OnInit {

    @Output() searchChanged = new EventEmitter<PeopleAdvancedSearchQuery>();

    readonly separatorKeysCodes = [ENTER, COMMA] as const;

    selection = new SelectionModel<SearchItem>(true, []);

    // Chip filters
    chipFiltersCtrl = new FormControl();
    filteredChips: Observable<string[]>;
    selectedChipFilters: string[] = [];
    // Chip map with tool tip description
    chipFilterItems: FilterItem[] =  [
        {key: 'baptised', label: 'Baptised', description:  'Is Baptised', color: 'primary'},
        {key: 'notBaptised', label: 'Not Baptised', description:  'Not Baptised', color: 'accent'},
        {key: 'holySpirit', label: 'Holy Spirit', description:  'Received Holy Spirit', color: 'primary'},
        {key: 'noHolySpirit', label: 'No Holy Spirit', description:  'Not Received Holy Spirit', color: 'accent'},
        {key: 'noPhoto', label: 'No Photo', description:  'No Photo', color: 'warn'},
    ]

    chipFilterLabels: string[] = this.chipFilterItems.map( x => x.label);

    @ViewChild('chipInput') fruitInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

    readonly connectionStatusMap = ['Member',  'First Timer',  'New Convert'];
    readonly ageClassificationMap = ['Adult', 'Child'];
    readonly genderMap = ['Male', 'Female', 'Unknown'];
    readonly recordStatusMap = ['Active', 'Pending', 'Inactive'];

    constructor()
    {
        this.filteredChips = this.chipFiltersCtrl.valueChanges
            .pipe(
                startWith(<string>null),
                map((fruit: string | null) => fruit ? this._filter(fruit) : this.chipFilterLabels.slice()
            ));
    }

    ngOnInit(): void
    {
    }

    updateSearch()
    {
        const model: PeopleAdvancedSearchQuery = {
            connectionStatus: this._selectedItemsByGroup('connectionStatus'),
            ageClassification: this._selectedItemsByGroup('ageClassification'),
            gender: this._selectedItemsByGroup('gender'),
            recordStatus: this._selectedItemsByGroup('recordStatus'),
            filters: this.selectedChipFilters
                .map(x => this.chipFilterItems.find( f => f.label === x))
                .map(x => x.key)
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
    }

    add(event: MatChipInputEvent): void
    {
        const value = (event.value || '').trim();

        // Add our fruit
        if (value) {
            this.selectedChipFilters.push(value);
        }

        // Clear the input value
        event.chipInput!.clear();

        this.chipFiltersCtrl.setValue(null);
    }

    remove(fruit: string): void
    {
        const index = this.selectedChipFilters.indexOf(fruit);

        if (index >= 0) {
            this.selectedChipFilters.splice(index, 1);
        }
    }

    selected(event: MatAutocompleteSelectedEvent): void
    {
        this.selectedChipFilters.push(event.option.viewValue);
        this.fruitInput.nativeElement.value = '';
        this.chipFiltersCtrl.setValue(null);
    }

    private _selectedItemsByGroup(group: string): string[]
    {
        return  this.selection.selected
            .filter(x => x.group === group)
            .map(x => x.key)
    }

    private _filter(value: string): string[]
    {
        const filterValue = value.toLowerCase();

        return this.chipFilterLabels.filter( fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
    }
}
