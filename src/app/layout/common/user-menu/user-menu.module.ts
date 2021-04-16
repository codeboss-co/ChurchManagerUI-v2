import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { UserMenuComponent } from 'app/layout/common/user-menu/user-menu.component';
import { SharedModule } from '@shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        UserMenuComponent
    ],
    imports     : [
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        SharedModule
    ],
    exports     : [
        UserMenuComponent
    ]
})
export class UserMenuModule
{
}
