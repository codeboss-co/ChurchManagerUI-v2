import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'cm-upload-images',
    templateUrl: './upload-images.component.html',
    styleUrls: ['./upload-images.component.scss']
})
export class UploadImagesComponent
{
    @Input() multiple = false;
    @Output() readonly uploadedFiles = new EventEmitter<FileList>();

    selectedFiles?: FileList;
    selectedFileNames: string[] = [];

    previews: string[] = [];

    selectFiles(event: any): void
    {
        this.selectedFileNames = [];
        this.selectedFiles = event.target.files;

        this.previews = [];
        if (this.selectedFiles && this.selectedFiles[0])
        {
            const numberOfFiles = this.selectedFiles.length;
            for (let i = 0; i < numberOfFiles; i++)
            {
                const reader = new FileReader();

                reader.onload = (e: any) => {
                    this.previews.push(e.target.result);
                };

                reader.readAsDataURL(this.selectedFiles[i]);

                this.selectedFileNames.push(this.selectedFiles[i].name);
            }
        }
    }

    uploadFiles()
    {
        this.uploadedFiles.emit(this.selectedFiles);
        this.selectedFiles = null;
    }
}