import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { groupsRoutes } from '@features/admin/groups/groups.routing';
import { GroupsComponent } from '@features/admin/groups/groups.component';
import { GroupsManageResolver } from '@features/admin/groups/_services/groups.resolvers';
import { GroupsManageService } from '@features/admin/groups/_services/groups-manage.service';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from '@shared/shared.module';
import {
    GroupMembersComponent,
    GroupDetailsComponent,
    GroupsViewerComponent,
    GroupsManageComponent
} from '@features/admin/groups/manage';
import { GroupsDataService } from '@features/admin/groups/_services/groups-data.service';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    declarations: [
        GroupsComponent,
        GroupsManageComponent,
        GroupsViewerComponent,
        GroupDetailsComponent,
        GroupMembersComponent
    ],
    imports: [
        RouterModule.forChild(groupsRoutes),

        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressBarModule,
        MatSidenavModule,
        MatTableModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,

        SharedModule
    ],
    providers: [GroupsManageResolver, GroupsManageService, GroupsDataService]
})
export class GroupsModule
{
}