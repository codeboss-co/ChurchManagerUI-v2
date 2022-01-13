import { Route } from '@angular/router';
import { CanDeactivateMissionDetail } from '@features/admin/missions/_services/missions.guards';
import { MissionDetailComponent } from '@features/admin/missions/_components/detail/mission-detail.component';
import { MissionResolver } from '@features/admin/missions/_services/missions.resolvers';
import { FamiliesListComponent } from '@features/admin/people/families/_components/list/families-list.component';

export const familiesRoutes: Route[] = [
    {
        path     : 'list',
        component: FamiliesListComponent,
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
