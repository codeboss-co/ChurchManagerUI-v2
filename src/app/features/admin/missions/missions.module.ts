import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { missionsRoutes } from '@features/admin/missions/missions.routing';
import { MissionsDataService } from '@features/admin/missions/_services/missions-data.service';
import { MissionsResolvers } from '@features/admin/missions/_services/missions.resolvers';
import { MissionsComponent } from '@features/admin/missions/missions.component';
import { MissionsService } from '@features/admin/missions/_services/missions.service';
import { SharedModule } from '@shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseAutogrowModule } from '@fuse/directives/autogrow';

@NgModule({
    declarations: [
        MissionsComponent
    ],
    imports:[
        RouterModule.forChild(missionsRoutes),
        SharedModule,

        MatButtonModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatInputModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatSelectModule,
        MatSidenavModule,
        MatSortModule,
        MatSlideToggleModule,
        MatTabsModule,
        MatTableModule,
        MatTooltipModule,

        // Fuse
        FuseAutogrowModule,
    ],
    providers: [
        MissionsDataService,
        MissionsResolvers,
        MissionsService
    ]
})
export class MissionsModule
{
}