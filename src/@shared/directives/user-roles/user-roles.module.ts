import { NgModule } from '@angular/core';
import { UserRolesDirective } from '@shared/directives/user-roles/user-roles.directive';

@NgModule({
    declarations: [
        UserRolesDirective
    ],
    exports     : [
        UserRolesDirective
    ]
})
export class UserRolesModule
{
}
