import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SharedModule } from '@shared/shared.module';
import { PersonAutocompleteControl } from './person-autocomplete-control';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PersonSearchService } from '@ui/controls/person-autocomplete-control/person-search.service';

const COMPONENTS = [
    PersonAutocompleteControl
];

@NgModule({
    declarations: [COMPONENTS],
    imports: [
        MatAutocompleteModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,

        SharedModule
    ],
    exports: [COMPONENTS],
    providers: [PersonSearchService]
})
export class PersonAutocompleteControlModule
{
}
