import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { ProfileFollowUpComponent } from './follow-up.component';
import { FollowUpListComponent } from './components/follow-up-list/follow-up-list.component';
import { FollowUpListQueryComponent } from './components/follow-up-list-query/follow-up-list-query.component';
import { FollowUpFormComponent } from './components/follow-up-form/follow-up-form.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAutogrowModule } from '@fuse/directives/autogrow';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { FuseFindByKeyPipeModule } from '@fuse/pipes/find-by-key';
import { GeneralTableModule } from '@ui/components/general-table/general-table.module';

const routes: Routes = [
    {path: '', component: ProfileFollowUpComponent }
];

@NgModule({
  declarations: [
      ProfileFollowUpComponent,
      FollowUpListComponent,
      FollowUpListQueryComponent,
      FollowUpFormComponent
  ],
  imports: [
      RouterModule.forChild(routes),

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
      MatProgressBarModule,
      MatSelectModule,
      MatSlideToggleModule,
      MatTableModule,
      MatTooltipModule,
      MatToolbarModule,

      // Fuse
      FuseCardModule,
      FuseAutogrowModule,
      FuseAlertModule,
      FuseScrollbarModule,
      FuseFindByKeyPipeModule,
      SharedModule,

      // UI Controls
      GeneralTableModule,
  ]
})
export class FollowUpModule { }
