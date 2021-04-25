import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '@shared/shared.module';
import { ChurchesSelectControlComponent } from './churches-select-control';
import { ChurchGroupsSelectControlDataService } from '../church-groups-select-control/church-groups-select-control-data.service';

const COMPONENTS = [
    ChurchesSelectControlComponent
];

@NgModule({
    declarations: [COMPONENTS],
    imports: [
        MatFormFieldModule,
        MatSelectModule,

        SharedModule
    ],
    exports: [COMPONENTS],
    providers: [ChurchGroupsSelectControlDataService]
})
export class ChurchesSelectControlModule
{
}
