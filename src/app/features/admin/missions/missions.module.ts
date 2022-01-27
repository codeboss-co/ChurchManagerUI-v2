import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { missionsRoutes } from '@features/admin/missions/missions.routing';
import { MissionResolver } from '@features/admin/missions/_services/missions.resolvers';
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
import { MissionDetailComponent } from '@features/admin/missions/_components/detail/mission-detail.component';
import { MissionsListComponent } from '@features/admin/missions/_components/list/missions-list.component';
import { MissionsListQueryComponent } from '@features/admin/missions/_components/list-query/missions-list-query.component';
import { GeneralTableModule } from '@ui/components/general-table/general-table.module';
import { MissionsCreateDialogComponent } from '@features/admin/missions/_components/create/missions-create-dialog.component';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
    declarations: [
        MissionsComponent,
        MissionsListComponent,
        MissionsListQueryComponent,
        MissionDetailComponent,
        MissionsCreateDialogComponent
    ],
    imports:[
        RouterModule.forChild(missionsRoutes),
        SharedModule,

        MatButtonModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
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
        FuseScrollbarModule,

        // UI Controls
        GeneralTableModule
    ],
    providers: [
        MissionResolver,
        MissionsService
    ]
})
export class MissionsModule
{
}