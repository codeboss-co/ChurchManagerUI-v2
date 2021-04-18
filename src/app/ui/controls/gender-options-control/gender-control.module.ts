import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '@shared/shared.module';
import { GenderOptionsControl } from './gender-options.control';

const COMPONENTS = [
    GenderOptionsControl
];

@NgModule({
    declarations: [COMPONENTS],
    imports: [
        MatFormFieldModule,
        MatSelectModule,

        SharedModule
    ],
    exports: [COMPONENTS]
})
export class GenderControlModule
{
}
