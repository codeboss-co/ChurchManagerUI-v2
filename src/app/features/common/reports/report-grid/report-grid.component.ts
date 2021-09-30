import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { WebdatarocksComponent } from '@shared/webdatarocks/webdatarocks.component';
import * as WebDataRocks from 'webdatarocks';
import * as Highcharts from 'highcharts';

@Component( {
    selector: 'report-grid',
    templateUrl: './report-grid.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
} )
export class ReportGridComponent implements OnChanges {

    @Input() isLoading = false;
    @Input() report:  WebDataRocks.Report;

    @ViewChild( 'pivot1' ) pivot: WebdatarocksComponent;

    /**
     * If the report has be initialized or not.
     * This determines if we have to create it or just refresh the data
     */
    private _isInitialized = false;

    ngOnChanges(changes: SimpleChanges): void
    {
        // Grid is not ready when initial empty data is passed
        // this checks that there are actual records
        // which gives the grid time to be initialized
       /* if (changes['data']?.currentValue?.length) {
            this.pivot.flexmonster.updateData({ data: changes['data'].currentValue });
        }*/

        if (changes['report']?.currentValue)
        {
            if (!this._isInitialized)
            {
                this.pivot.webDataRocks.setReport(changes['report'].currentValue);
                this._isInitialized = true;
            } else
            {
                // Connects to a new data source whereas filtering, sorting, etc. remain the same.
                this.pivot.webDataRocks.updateData({ data: changes['report'].currentValue.dataSource.data });
            }
        }


    }

    onPivotReady( pivot: any ): void {
        // console.log( '[ready] WebdatarocksComponent', this.pivot );
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

        this.createChart();
    }


    createChart() {
        this.pivot.webDataRocks.highcharts.getData({
            type: 'column'
        }, (data) => {
            console.log(data);
            Highcharts.chart('highchartsContainer', data);
        }, (data) => {
            Highcharts.chart('highchartsContainer', data);
        } );
    }

}
