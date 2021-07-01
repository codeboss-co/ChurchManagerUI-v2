import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '@shared/shared.module';
import { GroupTypeGroupsSelectControlComponent } from '@ui/controls/group-types-groups-select-control/group-type-groups-select-control.component';
import { GroupTypeGroupsSelectControlDataService } from '@ui/controls/group-types-groups-select-control/group-type-groups-select-control-data.service';

@NgModule( {
    declarations: [GroupTypeGroupsSelectControlComponent],
    exports: [GroupTypeGroupsSelectControlComponent],
    imports: [
        MatCardModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,

        SharedModule
    ],
    providers: [GroupTypeGroupsSelectControlDataService]
} )
export class GroupTypeGroupsSelectControlModule
{
}