import { Route } from '@angular/router';
import { CanDeactivateContactsDetails } from './_services/contacts.guards';
import { ContactsCountriesResolver, ContactsResolver, ContactsTagsResolver } from './_services/contacts.resolvers';
import { ContactsComponent } from './contacts.component';
import { ContactsListComponent } from './list/list.component';
import { ContactsDetailsComponent } from './details/details.component';
import { NewFamilyFormComponent } from '@features/admin/people/new-family-form/new-family-form.component';
import { PeopleResolver } from '@features/admin/people/_services/people.resolvers';

export const contactsRoutes: Route[] = [
    {
        path     : 'new-family', pathMatch : 'full',
        component: NewFamilyFormComponent
    },
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
                            task     : PeopleResolver,
                            countries: ContactsCountriesResolver
                        },
                        canDeactivate: [CanDeactivateContactsDetails]
                    }
                ]
            }
        ]
    }
];
