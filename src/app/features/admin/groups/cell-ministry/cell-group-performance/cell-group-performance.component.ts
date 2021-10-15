import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Subject } from 'rxjs';
import { ApexOptions, ChartComponent } from 'ng-apexcharts';

@Component({
    selector     : 'cell-group-performance',
    templateUrl  : './cell-group-performance.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations   : fuseAnimations
})
export class CellGroupPerformanceComponent implements OnInit, OnDestroy
{
    @ViewChild('chart') chart: ChartComponent;
    public chartOptions:  ApexOptions = {};

    // Private
    private _unsubscribeAll = new Subject();


    /**
     * Constructor
     */
    constructor()
    {
        this.chartOptions = {
            chart      : {
                fontFamily: 'inherit',
                foreColor : 'inherit',
                height    : '30%',
                type      : 'bar',
                toolbar   : {
                    show: false
                },
                zoom      : {
                    enabled: false
                }
            },
            colors     : ['#64748B', '#94A3B8'],
            dataLabels : {
                enabled        : false
            },
            grid       : {
                borderColor: 'var(--fuse-border)'
            },
            labels     : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            legend     : {
                show: false
            },
            plotOptions: {
                bar: {
                    columnWidth: '20%'
                }
            },
            series     : [
                {
                    name: 'Did Attend',
                    type: 'column',
                    data: [1, 0, 1, 0, 0, 1, 1, 1, 1,0]
                }
            ],
            states     : {
                hover: {
                    filter: {
                        type : 'darken',
                        value: 0.75
                    }
                }
            },
            tooltip    : {
                followCursor: true,
                theme       : 'dark'
            },
            xaxis      : {
                axisBorder: {
                    show: false
                },
                axisTicks : {
                    color: 'var(--fuse-border)'
                },
                labels    : {
                    style: {
                        colors: 'var(--fuse-text-secondary)'
                    }
                },
                tooltip   : {
                    enabled: false
                }
            },
            yaxis      : {
                labels: {
                    show: false,
                    offsetX: -16,
                    style  : {
                        colors: 'var(--fuse-text-secondary)'
                    },
                    formatter: val => val === 0 ? 'No' : 'Yes'
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle methods
    // -----------------------------------------------------------------------------------------------------
    ngOnDestroy(): void
    {
    }

    ngOnInit(): void
    {
    }

}
