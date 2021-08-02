import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Profile } from '../../../../profile.model';
import { FormAction } from '@shared/shared.models';
import { FileUploadService } from '@shared/api/file-upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
    selector     : 'profile-photo-form-dialog',
    templateUrl  : './photo-form-dialog.component.html',
    styleUrls    : ['./photo-form-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfilePhotoFormDialogComponent implements OnInit
{
    action: FormAction;
    profile: Profile;
    dialogTitle: string;

    uploadedFiles: FileList;
    progressInfos: { value?: number; fileName?: string };
    messages: string[] = [];

    /**
     * Constructor
     *
     */
    constructor(
        public matDialogRef: MatDialogRef<ProfilePhotoFormDialogComponent>,
        private  _uploader: FileUploadService,
        @Inject(MAT_DIALOG_DATA) private _data: { action: FormAction; profile: Profile }
    )
    {
        // Set the defaults
        this.action = _data.action;
        this.profile = _data.profile;
        // We might support more actions in future
        if ( this.action === 'edit' )
        {
            this.dialogTitle = `Editing: ${this.profile.fullName.firstName} ${this.profile.fullName.lastName}`;
        }
    }

    ngOnInit(): void
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    onUploadedFiles( files: FileList )
    {
        this.uploadedFiles = files;
        this.upload(files[0]);
    }

    upload(file: File): void
    {
        this.progressInfos = { value: 0, fileName: file.name };

        if (file) {
            this._uploader.upload(file, `people/edit/${this.profile.personId}/photo`)
                .subscribe(
                (event: any) => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.progressInfos.value = Math.round(
                            (90 * event.loaded) / event.total // 90% as we need  to wait for Cloudinary storage call also
                        );
                    } else if (event instanceof HttpResponse) {
                        const msg = 'Uploaded the file successfully: ' + file.name;
                        this.messages.push(msg);
                        this.progressInfos.value = 100; // Complete 100% upload to Cloudinary
                    }
                },
                (err: any) => {
                    this.progressInfos.value = 0;
                    const msg = 'Could not upload the file: ' + file.name;
                    this.messages.push(msg);
                }
            );
        }
    }
}