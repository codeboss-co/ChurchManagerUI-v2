import { Route } from '@angular/router';
import { CanDeactivateContactsDetails } from './contacts.guards';
import { ContactsContactResolver, ContactsCountriesResolver, ContactsResolver, ContactsTagsResolver } from './contacts.resolvers';
import { ContactsComponent } from './contacts.component';
import { ContactsListComponent } from './list/list.component';
import { ContactsDetailsComponent } from './details/details.component';

export const contactsRoutes: Route[] = [
    {
        path     : '',
        component: ContactsComponent,
        resolve  : {
            tags: ContactsTagsResolver
        },
        children : [
            {
                path     : '',
                component: ContactsListComponent,
                resolve  : {
                    tasks    : ContactsResolver,
                    countries: ContactsCountriesResolver
                },
                children : [
                    {
                        path         : ':id',
                        component    : ContactsDetailsComponent,
                        resolve      : {
                            task     : ContactsContactResolver,
                            countries: ContactsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            }
        ]
    }
];
