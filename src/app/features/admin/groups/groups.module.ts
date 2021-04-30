import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { groupsRoutes } from '@features/admin/groups/groups.routing';
import { GroupsComponent } from '@features/admin/groups/groups.component';
import { GroupsManageResolver } from '@features/admin/groups/_services/groups.resolvers';
import { GroupsManageService } from '@features/admin/groups/_services/groups-manage.service';
import { GroupsViewerComponent } from '@features/admin/groups/list/groups-viewer.component';

@NgModule({
    declarations: [GroupsComponent, GroupsViewerComponent],
    imports: [
        RouterModule.forChild(groupsRoutes)
    ],
    providers: [GroupsManageResolver, GroupsManageService]
})
export class GroupsModule
{
}