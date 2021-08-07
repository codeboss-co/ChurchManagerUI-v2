import { Route, Routes } from '@angular/router';
import { ProfileComponent } from 'app/pages/profile/profile.component';
import { ProfileDiscipleshipResolver, ProfileResolver } from './profile.resolvers';
import { ProfileAboutComponent } from '../tabs/about/profile-about.component';
import { ProfileGroupsComponent } from '../tabs/groups/groups.component';
import { ProfileDiscipleshipComponent } from '../tabs/discipleship/profile-discipleship.component';
import { ProfileMyDashboardComponent } from '../components/my-dashboard/my-dashboard.component';
import { ProfileFollowUpComponent } from '../tabs/followup/follow-up.component';

const children: Routes = [
    {path: '', component: ProfileAboutComponent },
    {path: 'groups', component: ProfileGroupsComponent },
    {path: 'discipleship', component: ProfileDiscipleshipComponent,
        resolve: {
            programs: ProfileDiscipleshipResolver
        }
    },
    {path: 'follow-up', component: ProfileFollowUpComponent }
];

export const profileRoutes: Route[] = [
    {path: 'dashboard', component: ProfileMyDashboardComponent, pathMatch : 'full' },
    {
        path     : '',
        component: ProfileComponent,
        resolve: {
            profile: ProfileResolver
        },
        children
    },
    {
        path     : ':personId',
        component: ProfileComponent,
        resolve: {
            profile: ProfileResolver
        },
        children
    },

];
