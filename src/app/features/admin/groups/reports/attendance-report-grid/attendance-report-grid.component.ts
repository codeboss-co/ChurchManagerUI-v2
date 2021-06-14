import { Component, ViewChild } from '@angular/core';
import { WebdatarocksComponent } from '@shared/webdatarocks/webdatarocks.component';

@Component({
  selector: 'groups-attendance-report-grid',
  templateUrl: './attendance-report-grid.component.html'
})
export class AttendanceReportGridComponent {

    @ViewChild('pivot1') child: WebdatarocksComponent;

    onPivotReady(pivot: WebDataRocks.Pivot): void {
        console.log('[ready] WebdatarocksComponent', this.child);
    }

    onCustomizeCell(
        cell: WebDataRocks.CellBuilder,
        data: WebDataRocks.CellData
    ): void {
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
        this.child.webDataRocks.off('reportcomplete');
        this.child.webDataRocks.setReport({
            dataSource: {
                filename: 'https://cdn.webdatarocks.com/data/data.json',
            },
        });
    }

}
