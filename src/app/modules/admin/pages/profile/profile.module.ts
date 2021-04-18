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
import { profileRoutes } from './profile.routing';
import { SharedModule } from '@shared/shared.module';
import { ProfileResolver } from './profile.resolvers';
import { ProfileService } from './profile.service';
import { ProfileAboutComponent } from './tabs/about/profile-about.component';
import { ProfileGroupsComponent } from './tabs/groups/groups.component';
import { GroupAttendanceFormDialogComponent } from './tabs/groups/components/group-attendance-form/group-attendance-form-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';


@NgModule({
    declarations: [
        ProfileComponent,
        // Tabs
        ProfileAboutComponent,
        ProfileGroupsComponent,
        GroupAttendanceFormDialogComponent,
    ],
    imports     : [
        RouterModule.forChild(profileRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDividerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatTooltipModule,
        MatToolbarModule,

        // Fuse
        FuseCardModule,
        SharedModule
    ],
    providers: [ProfileResolver, ProfileService]
})
export class ProfileModule
{
}
