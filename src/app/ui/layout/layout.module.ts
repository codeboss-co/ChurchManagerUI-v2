import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { LayoutComponent } from '@ui/layout/layout.component';
import { EmptyLayoutModule } from '@ui/layout/layouts/empty/empty.module';
import { CenteredLayoutModule } from '@ui/layout/layouts/horizontal/centered/centered.module';
import { EnterpriseLayoutModule } from '@ui/layout/layouts/horizontal/enterprise/enterprise.module';
import { MaterialLayoutModule } from '@ui/layout/layouts/horizontal/material/material.module';
import { ModernLayoutModule } from '@ui/layout/layouts/horizontal/modern/modern.module';
import { ClassicLayoutModule } from '@ui/layout/layouts/vertical/classic/classic.module';
import { ClassyLayoutModule } from '@ui/layout/layouts/vertical/classy/classy.module';
import { CompactLayoutModule } from '@ui/layout/layouts/vertical/compact/compact.module';
import { DenseLayoutModule } from '@ui/layout/layouts/vertical/dense/dense.module';
import { FuturisticLayoutModule } from '@ui/layout/layouts/vertical/futuristic/futuristic.module';
import { ThinLayoutModule } from '@ui/layout/layouts/vertical/thin/thin.module';
import { SharedModule } from '@shared/shared.module';
import { AdminLayoutComponent } from '@ui/layout/layouts/admin-layout/admin-layout.component';

const layoutModules = [
    // Empty
    EmptyLayoutModule,

    // Horizontal navigation
    CenteredLayoutModule,
    EnterpriseLayoutModule,
    MaterialLayoutModule,
    ModernLayoutModule,

    // Vertical navigation
    ClassicLayoutModule,
    ClassyLayoutModule,
    CompactLayoutModule,
    DenseLayoutModule,
    FuturisticLayoutModule,
    ThinLayoutModule
];

@NgModule({
    declarations: [
        LayoutComponent,
        // Added so that NotificationsSignalRService can run when logged in
        AdminLayoutComponent
    ],
    imports     : [
        MatIconModule,
        MatTooltipModule,
        FuseDrawerModule,
        SharedModule,
        ...layoutModules
    ],
    exports     : [
        LayoutComponent,
        ...layoutModules
    ]
})
export class LayoutModule
{
}
