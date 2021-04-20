import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { PersonEditorComponent } from './person-editor.component';
import { BirthDateEditorModule } from '../birthdate-editor-control/birthdate-editor.module';
import { GenderControlModule } from '../gender-options-control/gender-control.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule( {
    declarations: [PersonEditorComponent],
    exports: [PersonEditorComponent],
    imports: [
        MatCheckboxModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,

        SharedModule,

        BirthDateEditorModule,
        GenderControlModule
    ]
} )
export class PersonEditorControlModule {
}
