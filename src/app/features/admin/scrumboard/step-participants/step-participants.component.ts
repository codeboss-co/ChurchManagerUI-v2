import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ScrumboardService } from '@features/admin/scrumboard/scrumboard.service';
import { Subject } from 'rxjs';
import { DiscipleshipStep, DiscipleshipStepStatusEnum } from '@features/admin/discipleship/discipleship.models';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { takeUntil } from 'rxjs/operators';

@Component( {
    selector: 'scrumboard-step-participants',
    templateUrl: './step-participants.component.html',
    styleUrls: ['./step-participants.component.scss']
} )
export class ScrumboardStepParticipantsComponent implements OnInit {

    public notStarted: DiscipleshipStep[] = [];
    public inProgress: DiscipleshipStep[] = [];
    public completed: DiscipleshipStep[] = [];

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
                this.notStarted = participants.filter( x => x.status === DiscipleshipStepStatusEnum.notStarted );
                this.inProgress = participants.filter( x => x.status === DiscipleshipStepStatusEnum.inProgress );
                this.completed = participants.filter( x => x.status === DiscipleshipStepStatusEnum.completed );

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
