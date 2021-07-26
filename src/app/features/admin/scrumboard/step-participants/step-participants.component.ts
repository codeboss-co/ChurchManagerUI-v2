import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ScrumboardService } from '@features/admin/scrumboard/scrumboard.service';
import { Subject } from 'rxjs';
import { DiscipleshipStep } from '@features/admin/discipleship/discipleship.models';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { takeUntil } from 'rxjs/operators';
import { PaginatedDataSource } from '@shared/data/paginated.data-source';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';

export type StepParticipants = {
    completionDate?: Date,
    status: string,
    personName?: string;
    isComplete?: boolean;
}

export interface StepParticipantsQuery {
    status?: string;
    from?: Date;
    to?: Date;
}

@Component( {
    selector: 'scrumboard-step-participants',
    templateUrl: './step-participants.component.html',
    styleUrls: ['./step-participants.component.scss'],
    animations   : fuseAnimations
} )
export class ScrumboardStepParticipantsComponent implements OnInit
{
    searchForm: FormGroup;
    searchBtnClicked = new Subject();

    displayedColumns: string[] = ['completionDate', 'status', 'personName', 'isComplete'];
    dataSource: PaginatedDataSource<StepParticipants, StepParticipantsQuery> | null;

    participants: StepParticipants[] = [];

    private _unsubscribeAll: Subject<void> = new Subject<void>();

    constructor(
        private _scrumboardService: ScrumboardService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this._scrumboardService.cards$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe( participants => {

                this.participants = participants.map(x => (
                    {
                        completionDate: x.completionDate,
                        status: x.status,
                        isComplete: x.isComplete,
                        personName: `${x.person.fullName.firstName} ${x.person.fullName.firstName}`
                    }
                ));

                this._changeDetectorRef.markForCheck();
            } );
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    drop( event: CdkDragDrop<DiscipleshipStep[]> )
    {
        console.log(event);
        // Move or transfer the item
        if ( event.previousContainer === event.container )
        {
            // Move the item
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        }
        else
        {
            // Transfer the item
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        }
    }
}
