import { NgModule } from '@angular/core';
import { AddressEditorComponent } from './address-editor.component';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@NgModule( {
    declarations: [AddressEditorComponent],
    exports: [AddressEditorComponent],
    imports: [
        MatInputModule,
        MatIconModule,
        MatSelectModule,

        SharedModule
    ]
} )
export class AddressEditorControlModule {
}
