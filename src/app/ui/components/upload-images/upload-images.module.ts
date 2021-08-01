import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { UploadImagesComponent } from '@ui/components/upload-images/upload-images.component';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule( {
    declarations: [UploadImagesComponent],
    exports: [UploadImagesComponent],
    imports: [
        MatCardModule,
        MatToolbarModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatProgressBarModule,
        MatListModule,

        SharedModule
    ]
} )
export class UploadImagesModule
{
}