import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '@shared/shared.module';
import { ChurchGroupsSelectControlComponent } from './church-groups-select-control.component';
import { ChurchGroupsSelectControlDataService } from './church-groups-select-control-data.service';

@NgModule( {
    declarations: [ChurchGroupsSelectControlComponent],
    exports: [ChurchGroupsSelectControlComponent],
    imports: [
        MatCardModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,

        SharedModule
    ],
    providers: [ChurchGroupsSelectControlDataService]
} )
export class ChurchGroupsSelectControlModule
{
}