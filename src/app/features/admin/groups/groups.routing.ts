import { Route } from '@angular/router';
import { GroupsComponent } from '@features/admin/groups/groups.component';

export const groupsRoutes: Route[] = [
    // Cell Ministry
    {path: 'cell-ministry', loadChildren: () => import('./cell-ministry/cell-ministry.module').then( m => m.CellMinistryModule)},

    // Default Groups home page
    {
        path     : '**',
        component: GroupsComponent
    }
];