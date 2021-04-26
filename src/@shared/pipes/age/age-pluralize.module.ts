import { NgModule } from '@angular/core';
import { AgePluralizePipe } from '@shared/pipes/age/age-pluralize.pipe';

@NgModule({
    declarations: [
        AgePluralizePipe
    ],
    exports     : [
        AgePluralizePipe
    ]
})
export class AgePluralizeModule
{
}
