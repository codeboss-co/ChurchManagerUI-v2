import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_FORMATS, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as moment from 'moment';
import { FuseAutogrowModule } from '@fuse/directives/autogrow';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { SharedModule } from '@shared/shared.module';
import { contactsRoutes } from './contacts.routing';
import { ContactsComponent } from './contacts.component';
import { ContactsDetailsComponent } from './details/details.component';
import { ContactsListComponent } from './list/list.component';
import { PersonFormDialogComponent } from '@features/admin/people/new-family-form/person-form/person-form-dialog.component';
import { NewFamilyFormComponent } from '@features/admin/people/new-family-form/new-family-form.component';
import { FamilyMembersListComponent } from '@features/admin/people/new-family-form/family-members-list/family-members-list.component';
import { PeopleDataService } from '@features/admin/people/_services/people-data.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatStepperModule } from '@angular/material/stepper';
import { AddressEditorControlModule } from '@ui/controls/address-editor-control/address-editor-control.module';
import { PersonEditorControlModule } from '@ui/controls/person-editor-control/person-editor-control.module';
import { MatDialogModule } from '@angular/material/dialog';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FullNamePipeModule } from '@shared/pipes/fullname/full-name-pipe.module';
import { PeopleResolver } from '@features/admin/people/_services/people.resolvers';
import { AgePluralizeModule } from '@shared/pipes/age/age-pluralize.module';

@NgModule({
    declarations: [
        ContactsComponent,
        ContactsListComponent,
        ContactsDetailsComponent,

        // People
        NewFamilyFormComponent,
        PersonFormDialogComponent,
        FamilyMembersListComponent
    ],
    imports     : [
        RouterModule.forChild(contactsRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatMomentDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatStepperModule,
        MatTableModule,
        MatToolbarModule,
        MatTooltipModule,

        // Fuse
        FuseAutogrowModule,
        FuseScrollbarModule,
        FuseFindByKeyPipeModule,
        SharedModule,

        // Controls
        AddressEditorControlModule,
        PersonEditorControlModule,

        // Extensions
        FullNamePipeModule,
        AgePluralizeModule
    ],
    providers   : [
        {
            provide : MAT_DATE_FORMATS,
            useValue: {
                parse  : {
                    dateInput: moment.ISO_8601
                },
                display: {
                    dateInput         : 'LL',
                    monthYearLabel    : 'MMM YYYY',
                    dateA11yLabel     : 'LL',
                    monthYearA11yLabel: 'MMMM YYYY'
                }
            }
        },
        PeopleDataService, PeopleResolver
    ]
})
export class ContactsModule
{
}
