import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector       : 'add-group-member-dialog',
    templateUrl    : './add-group-member-form-dialog.component.html',
    styleUrls    : ['./add-group-member-form-dialog.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddGroupMemberFormDialogComponent
{

}