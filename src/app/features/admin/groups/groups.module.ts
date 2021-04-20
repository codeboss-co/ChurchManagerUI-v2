import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { groupsRoutes } from '@features/admin/groups/groups.routing';
import { GroupsComponent } from '@features/admin/groups/groups.component';

@NgModule({
    declarations:[GroupsComponent],
    imports: [
        RouterModule.forChild(groupsRoutes)
    ]
})
export class GroupsModule
{
}