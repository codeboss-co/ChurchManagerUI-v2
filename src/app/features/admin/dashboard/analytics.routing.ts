import { Route } from '@angular/router';
import { AnalyticsComponent } from './analytics.component';
import { AnalyticsResolver } from './analytics.resolvers';

export const analyticsRoutes: Route[] = [
    {
        path     : '',
        component: AnalyticsComponent,
        resolve  : {
            data: AnalyticsResolver
        }
    }
];
