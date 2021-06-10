import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FuseCardModule } from '@fuse/components/card';
import { ProfileComponent } from './profile.component';
import { profileRoutes } from './_services/profile.routing';
import { SharedModule } from '@shared/shared.module';
import { ProfileDiscipleshipResolver, ProfileResolver } from './_services/profile.resolvers';
import { ProfileService } from './_services/profile.service';
import { ProfileAboutComponent } from './tabs/about/profile-about.component';
import { ProfileGroupsComponent } from './tabs/groups/groups.component';
import { GroupAttendanceFormDialogComponent } from './tabs/groups/components/group-attendance-form/group-attendance-form-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { GenderControlModule } from '@ui/controls/gender-options-control/gender-control.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { GroupsDataService } from '@features/admin/groups';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FuseAutogrowModule } from '@fuse/directives/autogrow';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import {
    ProfileConnectionInfoFormDialogComponent,
    ProfileGeneralInfoFormDialogComponent,
    ProfilePersonalInfoFormDialogComponent
} from './tabs/about/components';
import { BirthDateEditorModule } from '@ui/controls/birthdate-editor-control/birthdate-editor.module';
import { ChurchesSelectControlModule } from '@ui/controls/churches-select-control/churches-select-control.module';
import { AgePluralizeModule } from '@shared/pipes/age/age-pluralize.module';
import { ProfileDiscipleshipService } from './tabs/discipleship/profile-discipleship.service';
import { ProfileDiscipleshipComponent } from './tabs/discipleship/profile-discipleship.component';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { ProfileMyDashboardComponent } from './components/my-dashboard/my-dashboard.component';


@NgModule({
    declarations: [
        ProfileComponent,
        // Tabs
        ProfileAboutComponent,
        ProfileGroupsComponent,
        ProfileDiscipleshipComponent,
        // Dialogs
        GroupAttendanceFormDialogComponent,
        // Edit Dialogs
        ProfileGeneralInfoFormDialogComponent,
        ProfileConnectionInfoFormDialogComponent,
        ProfilePersonalInfoFormDialogComponent,
        ProfileMyDashboardComponent
    ],
    imports     : [
        RouterModule.forChild(profileRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatSelectModule,
        MatTableModule,
        MatTooltipModule,
        MatToolbarModule,

        // Fuse
        FuseCardModule,
        FuseAutogrowModule,
        FuseScrollbarModule,
        FuseFindByKeyPipeModule,
        SharedModule,

        // UI Controls
        GenderControlModule,
        BirthDateEditorModule,
        ChurchesSelectControlModule,

        // Extensions
        AgePluralizeModule
    ],
    providers: [
        ProfileResolver, ProfileDiscipleshipResolver,
        ProfileService, GroupsDataService, ProfileDiscipleshipService]
})
export class ProfileModule
{
}
