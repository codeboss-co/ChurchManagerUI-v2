import { Route } from '@angular/router';
import { AuthUnlockSessionComponent } from 'app/features/auth/unlock-session/unlock-session.component';

export const authUnlockSessionRoutes: Route[] = [
    {
        path     : '',
        component: AuthUnlockSessionComponent
    }
];
