import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
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
import { GeneralTableModule } from '@ui/components/general-table/general-table.module';
import { familiesRoutes } from '@features/admin/people/families/families.routing';
import { FamiliesListComponent } from '@features/admin/people/families/_components/list/families-list.component';
import { FamiliesListQueryComponent } from '@features/admin/people/families/_components/list-query/families-list-query.component';
import { FamilyDetailComponent } from '@features/admin/people/families/_components/detail/family-detail.component';
import { FamilyResolver } from '@features/admin/people/families/_services/families.resolvers';
import { FamiliesService } from '@features/admin/people/families/_services/families.service';
import { FamiliesDataService } from '@features/admin/people/families/_services/families-data.service';

@NgModule({
    declarations: [
        FamiliesListComponent,
        FamiliesListQueryComponent,
        FamilyDetailComponent
    ],
    imports:[
        RouterModule.forChild(familiesRoutes),
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

        // UI Controls
        GeneralTableModule
    ],
    providers: [
        FamilyResolver,
        FamiliesService,
        FamiliesDataService
    ]
})
export class FamiliesModule
{
}