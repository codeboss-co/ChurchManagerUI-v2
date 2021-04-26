import { NgModule } from '@angular/core';
import { FullNamePipe } from '@shared/pipes/fullname/full-name.pipe';

@NgModule({
    declarations: [
        FullNamePipe
    ],
    exports     : [
        FullNamePipe
    ]
})
export class FullNamePipeModule
{
}
