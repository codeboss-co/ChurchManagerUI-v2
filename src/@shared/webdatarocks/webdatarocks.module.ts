import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebdatarocksComponent } from '@shared/webdatarocks/webdatarocks.component';

@NgModule( {
    declarations: [WebdatarocksComponent],
    imports: [
        CommonModule
    ],
    exports: [WebdatarocksComponent]
} )
export class WebdatarocksModule
{
}
