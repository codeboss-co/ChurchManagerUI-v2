import { Route } from '@angular/router';
import { ProfileComponent } from 'app/modules/admin/pages/profile/profile.component';
import { ProfileResolver } from './profile.resolvers';
import { ProfileAboutComponent } from './tabs/about/profile-about.component';

export const profileRoutes: Route[] = [
    {
        path     : '',
        component: ProfileComponent,
        resolve: {
            profile: ProfileResolver
        },
        children: [
            {path: '', component: ProfileAboutComponent }
        ]
    },
    {
        path     : ':personId',
        component: ProfileComponent,
        resolve: {
            profile: ProfileResolver
        }
    }
];
