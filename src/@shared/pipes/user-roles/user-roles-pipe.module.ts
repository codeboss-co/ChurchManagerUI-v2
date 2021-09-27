import { NgModule } from '@angular/core';
import { UserRolesPipe } from '@shared/pipes/user-roles/user-roles.pipe';

@NgModule({
    declarations: [
        UserRolesPipe
    ],
    exports     : [
        UserRolesPipe
    ]
})
export class UserRolesPipeModule
{
}
