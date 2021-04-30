import { Route } from '@angular/router';
import { GroupsComponent } from '@features/admin/groups/groups.component';
import { GroupsManageResolver } from '@features/admin/groups/_services/groups.resolvers';
import { GroupsManageComponent } from '@features/admin/groups/manage/groups-manage.component';

export const groupsRoutes: Route[] = [
    // Cell Ministry
    {path: 'cell-ministry', loadChildren: () => import('./cell-ministry/cell-ministry.module').then( m => m.CellMinistryModule)},

    // Default Groups home page
    {
        path     : '',
        component: GroupsComponent,
        children: [
            {
                path     : '',
                component: GroupsManageComponent,
                resolve  : {
                    groups: GroupsManageResolver
                }
            }
        ]
    }
];