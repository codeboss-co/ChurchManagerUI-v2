import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '@shared/shared.module';
import { RecordStatusSelectControlComponent } from './record-status-select-control';
import { MatIconModule } from '@angular/material/icon';

const COMPONENTS = [
    RecordStatusSelectControlComponent
];

@NgModule({
    declarations: [COMPONENTS],
    imports: [
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,

        SharedModule
    ],
    exports: [COMPONENTS],
})
export class RecordStatusSelectControlModule
{
}
