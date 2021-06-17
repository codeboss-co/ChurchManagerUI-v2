import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { WebdatarocksComponent } from '@shared/webdatarocks/webdatarocks.component';
import { GroupAttendanceReportGridRow } from '@features/admin/groups/cell-ministry/cell-ministry.model';
import { FlexmonsterPivot } from 'ng-flexmonster';

@Component( {
    selector: 'groups-attendance-report-grid',
    templateUrl: './attendance-report-grid.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
} )
export class AttendanceReportGridComponent implements OnChanges {
    //@Input() data: GroupAttendanceReportGridRow[] = [];
    @Input() report:  Flexmonster.Report;

    @ViewChild( 'pivot1' ) child: WebdatarocksComponent;
    @ViewChild( 'pivot2' ) pivot: FlexmonsterPivot;

    ngOnChanges(changes: SimpleChanges): void
    {
        // Grid is not ready when initial empty data is passed
        // this checks that there are actual records
        // which gives the grid time to be initialized
       /* if (changes['data']?.currentValue?.length) {
            this.pivot.flexmonster.updateData({ data: changes['data'].currentValue });
        }*/

        if (changes['report']?.currentValue) {
            this.pivot.flexmonster.setReport(changes['report'].currentValue);
        }
    }

    onPivotReady( pivot: any ): void {
        console.log( '[ready] WebdatarocksComponent', this.child );
    }

    onCustomizeCell(cell: Flexmonster.CellBuilder, data: Flexmonster.CellData): void {
        if (data.isClassicTotalRow) {
            cell.addClass('fm-total-classic-r');
        }
        if (data.isGrandTotalRow) {
            cell.addClass('fm-grand-total-r');
        }
        if (data.isGrandTotalColumn) {
            cell.addClass('fm-grand-total-c');
        }
    }

    onReportComplete(): void {
        //this.child.webDataRocks.off('reportcomplete');
        /* this.child.webDataRocks.setReport({
             dataSource: {
                 filename: 'https://cdn.webdatarocks.com/data/data.json',
             },
         });*/

        this.pivot.flexmonster.off( 'reportcomplete' );
        this.pivot.flexmonster.setReport( {
            dataSource: {
                data: []
            }
        } );
    }
}
