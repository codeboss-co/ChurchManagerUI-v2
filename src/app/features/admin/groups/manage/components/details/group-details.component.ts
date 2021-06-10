import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { GroupWithChildren } from '@features/admin/groups';
import { MatDialog } from '@angular/material/dialog';
import { NewGroupDialogComponent } from '@features/admin/groups/manage/components/new/new-group-dialog.component';
import { filter } from 'rxjs/operators';
import { NewGroupForm } from '@features/admin/groups/manage/components/new/new-group.model';
import { FormActions } from '@shared/shared.models';

@Component({
    selector       : 'group-details',
    templateUrl    : './group-details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupDetailsComponent
{
    @Input() group: GroupWithChildren;
    @Input() expanded = true;

    constructor(private _matDialog: MatDialog)
    {
    }

    /**
     * Open edit group dialog
     */
    openEditGroup()
    {
        // Open the dialog
        const dialogRef = this._matDialog.open(NewGroupDialogComponent, {
            data : {
                action: FormActions.Edit,
                group: this.group
            }
        });

        dialogRef.afterClosed()
            .pipe(filter(result => !!result))
            .subscribe((group: NewGroupForm) => {
                // Signal the added group details

            });
    }
}