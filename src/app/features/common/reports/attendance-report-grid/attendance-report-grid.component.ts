import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { WebdatarocksComponent } from '@shared/webdatarocks/webdatarocks.component';
import * as WebDataRocks from 'webdatarocks';

@Component( {
    selector: 'groups-attendance-report-grid',
    templateUrl: './attendance-report-grid.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
} )
export class AttendanceReportGridComponent implements OnChanges {
    //@Input() data: GroupAttendanceReportGridRow[] = [];
    @Input() report:  WebDataRocks.Report;

    @ViewChild( 'pivot1' ) pivot: WebdatarocksComponent;

    ngOnChanges(changes: SimpleChanges): void
    {
        // Grid is not ready when initial empty data is passed
        // this checks that there are actual records
        // which gives the grid time to be initialized
       /* if (changes['data']?.currentValue?.length) {
            this.pivot.flexmonster.updateData({ data: changes['data'].currentValue });
        }*/

        if (changes['report']?.currentValue) {
            this.pivot.webDataRocks.setReport(changes['report'].currentValue);
        }
    }

    onPivotReady( pivot: any ): void {
        console.log( '[ready] WebdatarocksComponent', this.pivot );
    }

    onCustomizeCell(cell: WebDataRocks.CellBuilder, data: WebDataRocks.CellData): void {
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
        this.pivot.webDataRocks.off( 'reportcomplete' );
        this.pivot.webDataRocks.setReport( {
            dataSource: {
                data: []
            }
        } );
    }
}
