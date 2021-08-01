import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Profile } from '../../../../profile.model';
import { FormAction } from '@shared/shared.models';
//import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { FileUploadService } from '@shared/api/file-upload.service';

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

    /**
     * Constructor
     *
     */
    constructor(
        public matDialogRef: MatDialogRef<ProfilePhotoFormDialogComponent>,
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
    }
}