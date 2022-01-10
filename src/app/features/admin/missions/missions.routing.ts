import { Route } from '@angular/router';
import { MissionsComponent } from '@features/admin/missions/missions.component';
import { CanDeactivateMissionDetail } from '@features/admin/missions/_services/missions.guards';
import { MissionDetailComponent } from '@features/admin/missions/_components/detail/mission-detail.component';
import { MissionsListComponent } from '@features/admin/missions/_components/list/missions-list.component';
import { MissionResolver } from '@features/admin/missions/_services/missions.resolvers';

export const missionsRoutes: Route[] = [
    // Default Missions home page
    {
        path: '',
        component: MissionsComponent
    },
    {
        path     : 'list',
        component: MissionsListComponent,
        // Detail view
        children : [
            {
                path         : ':id',
                component    : MissionDetailComponent, // Drawer component
                canDeactivate: [CanDeactivateMissionDetail],
                resolve: {
                    mission: MissionResolver
                }
            }
        ]
    }
];
