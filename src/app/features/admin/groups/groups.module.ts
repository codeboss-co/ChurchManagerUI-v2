import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { groupsRoutes } from '@features/admin/groups/groups.routing';
import { GroupsComponent } from '@features/admin/groups/groups.component';
import { GroupManageResolver, GroupsManageResolver } from '@features/admin/groups/_services/groups.resolvers';
import { GroupsManageService } from '@features/admin/groups/_services/groups-manage.service';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from '@shared/shared.module';
import {
    GroupDetailsComponent,
    GroupMembersComponent,
    GroupsManageComponent,
    GroupsViewerComponent
} from '@features/admin/groups/manage';
import { GroupsDataService } from '@features/admin/groups/_services/groups-data.service';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { AddGroupMemberFormDialogComponent } from '@features/admin/groups/manage/components/members/add/add-group-member-form-dialog.component';
import { PersonAutocompleteControlModule } from '@ui/controls/person-autocomplete-control/person-autocomplete-control.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSortModule } from '@angular/material/sort';
import { NewGroupDialogComponent } from '@features/admin/groups/manage/components/new/new-group-dialog.component';
import { GroupTypesSelectControlModule } from '@ui/controls/group-types-select-control/group-types-select-control.module';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { CalendarModule } from '../../../pages/calendar/calendar.module';
import { NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { ChurchesSelectControlModule } from '@ui/controls/churches-select-control/churches-select-control.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RecordStatusSelectControlModule } from '@ui/controls/record-status-select-control/record-status-select-control.module';

@NgModule({
    declarations: [
        GroupsComponent,
        GroupsManageComponent,
        GroupsViewerComponent,
        GroupDetailsComponent,
        GroupMembersComponent,
        // Dialogs
        AddGroupMemberFormDialogComponent,
        NewGroupDialogComponent
    ],
    imports: [
        RouterModule.forChild(groupsRoutes),

        MatButtonModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatSidenavModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatSortModule,
        MatTableModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,

        SharedModule,
        CalendarModule,

        // Controls
        PersonAutocompleteControlModule,
        GroupTypesSelectControlModule,
        ChurchesSelectControlModule,
        RecordStatusSelectControlModule,

        // 3rd Party
        NgxMatNativeDateModule,
        NgxMatTimepickerModule
    ],
    providers: [
        GroupsManageResolver,
        GroupManageResolver,
        GroupsManageService,
        GroupsDataService
    ]
})
export class GroupsModule
{
}