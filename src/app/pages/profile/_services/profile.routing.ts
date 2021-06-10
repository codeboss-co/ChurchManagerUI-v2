import { Route } from '@angular/router';
import { ProfileComponent } from 'app/pages/profile/profile.component';
import { ProfileDiscipleshipResolver, ProfileResolver } from './profile.resolvers';
import { ProfileAboutComponent } from '../tabs/about/profile-about.component';
import { ProfileGroupsComponent } from '../tabs/groups/groups.component';
import { ProfileDiscipleshipComponent } from '../tabs/discipleship/profile-discipleship.component';
import { ProfileMyDashboardComponent } from '../components/my-dashboard/my-dashboard.component';

export const profileRoutes: Route[] = [
    {path: 'dashboard', component: ProfileMyDashboardComponent, pathMatch : 'full' },
    {
        path     : '',
        component: ProfileComponent,
        resolve: {
            profile: ProfileResolver
        },
        children: [
            {path: '', component: ProfileAboutComponent },
            {path: 'groups', component: ProfileGroupsComponent },
            {path: 'discipleship', component: ProfileDiscipleshipComponent,
                resolve: {
                    programs: ProfileDiscipleshipResolver
                }
            }
        ]
    },
    {
        path     : ':personId',
        component: ProfileComponent,
        resolve: {
            profile: ProfileResolver
        },
        children: [
            {path: '', component: ProfileAboutComponent },
            {path: 'groups', component: ProfileGroupsComponent },
            {path: 'discipleship', component: ProfileDiscipleshipComponent,
                resolve: {
                    programs: ProfileDiscipleshipResolver
                }
            },
        ]
    },

];
