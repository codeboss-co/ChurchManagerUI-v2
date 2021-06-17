import { Route } from '@angular/router';
import { GroupsComponent } from '@features/admin/groups/groups.component';
import { GroupManageResolver, GroupsManageResolver } from '@features/admin/groups/_services/groups.resolvers';
import { GroupsManageComponent } from '@features/admin/groups/manage/groups-manage.component';

export const groupsRoutes: Route[] = [
    // Cell Ministry
    {path: 'cell-ministry', loadChildren: () => import('./cell-ministry/cell-ministry.module').then( m => m.CellMinistryModule)},

    // Reporting
    {path: 'reports', loadChildren: () => import('./reporting/groups-reporting.module').then( m => m.GroupsReportingModule)},

    // Default Groups home page
    {
        path     : '',
        component: GroupsComponent,
        children: [
            /* manage all groups */
            {
                path     : '',
                component: GroupsManageComponent,
                resolve  : {
                    groups: GroupsManageResolver
                }
            },
            /* manage single group */
            {
                path     : ':groupId',
                component: GroupsManageComponent,
                data: {
                    from: 'profile' // Where we came from, needed for some processing
                },
                resolve  : {
                    groups: GroupManageResolver
                }
            }
        ]
    }
];