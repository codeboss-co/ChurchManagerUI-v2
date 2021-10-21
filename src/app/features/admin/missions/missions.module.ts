import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { missionsRoutes } from '@features/admin/missions/missions.routing';
import { MissionsDataService } from '@features/admin/missions/_services/missions-data.service';
import { MissionsResolvers } from '@features/admin/missions/_services/missions.resolvers';
import { MissionsComponent } from '@features/admin/missions/missions.component';
import { MissionsService } from '@features/admin/missions/_services/missions.service';

@NgModule({
    declarations: [
        MissionsComponent
    ],
    imports:[
        RouterModule.forChild(missionsRoutes),
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