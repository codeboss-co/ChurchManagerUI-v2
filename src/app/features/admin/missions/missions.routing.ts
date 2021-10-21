import { Route } from '@angular/router';
import { MissionsComponent } from '@features/admin/missions/missions.component';

export const missionsRoutes: Route[] = [

    // Default Missions home page
    {
        path: '',
        component: MissionsComponent
    }
];