import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';
import { MatGoogleMapsAutocompleteComponent } from '@ui/controls/ google-maps-autocomplete-control/mat-google-maps-autocomplete.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports:
        [
            FormsModule,
            SharedModule,
            MatInputModule,
            MatIconModule
        ],
    exports: [
        MatGoogleMapsAutocompleteComponent
    ],
    declarations: [
        MatGoogleMapsAutocompleteComponent
    ]
})
export class MatGoogleMapsAutocompleteModule {}