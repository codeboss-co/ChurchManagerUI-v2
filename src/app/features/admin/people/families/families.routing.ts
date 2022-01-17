import { Route } from '@angular/router';
import { FamiliesListComponent } from '@features/admin/people/families/_components/list/families-list.component';
import { FamilyDetailComponent } from '@features/admin/people/families/_components/detail/family-detail.component';
import { CanDeactivateFamilyDetail } from '@features/admin/people/families/_services/families.guards';
import { FamilyResolver } from '@features/admin/people/families/_services/families.resolvers';

export const familiesRoutes: Route[] = [
    {
        path     : 'list',
        component: FamiliesListComponent,
        // Detail view
        children : [
            {
                path         : ':id',
                component    : FamilyDetailComponent, // Drawer component
                canDeactivate: [CanDeactivateFamilyDetail],
                resolve: {
                    mission: FamilyResolver
                }
            }
        ]
    }
];
