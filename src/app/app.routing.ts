import { Route } from '@angular/router';
import { AuthGuard } from '@core/auth/guards/auth.guard';
import { NoAuthGuard } from '@core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/ui/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboard'
    {path: '', pathMatch : 'full', redirectTo: 'dashboard'},

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'dashboard'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/features/auth/confirmation-required/confirmation-required.module').then( m => m.AuthConfirmationRequiredModule)},
            {path: 'forgot-password', loadChildren: () => import('app/features/auth/forgot-password/forgot-password.module').then( m => m.AuthForgotPasswordModule)},
            {path: 'reset-password', loadChildren: () => import('app/features/auth/reset-password/reset-password.module').then( m => m.AuthResetPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/features/auth/sign-in/sign-in.module').then( m => m.AuthSignInModule)},
            {path: 'sign-up', loadChildren: () => import('app/features/auth/sign-up/sign-up.module').then( m => m.AuthSignUpModule)}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/features/auth/sign-out/sign-out.module').then( m => m.AuthSignOutModule)},
            {path: 'unlock-session', loadChildren: () => import('app/features/auth/unlock-session/unlock-session.module').then( m => m.AuthUnlockSessionModule)}
        ]
    },

    // Landing routes
    {
        path: '',
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        children   : [
            {path: 'home', loadChildren: () => import('app/features/landing/home/home.module').then( m => m.LandingHomeModule)},
        ]
    },

    // Admin routes
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [

            // Dashboards
            {path: 'dashboard', loadChildren: () => import('app/features/admin/dashboard/analytics.module').then(m => m.AnalyticsModule)},

            // Example
            {path: 'example', loadChildren: () => import('app/features/admin/example/example.module').then( m => m.ExampleModule)},

            // Apps
            {path: 'apps', children: [
                {path: 'people', loadChildren: () => import('app/features/admin/people/contacts.module').then( m => m.ContactsModule)},
                {path: 'groups', loadChildren: () => import('app/features/admin/groups/groups.module').then( m => m.GroupsModule)},
            ]},

            // Pages
            {path: 'pages', children: [

                    // Profile
                {path: 'profile', loadChildren: () => import('app/pages/profile/profile.module').then( m => m.ProfileModule)},

            ]},
        ]
    }
];
