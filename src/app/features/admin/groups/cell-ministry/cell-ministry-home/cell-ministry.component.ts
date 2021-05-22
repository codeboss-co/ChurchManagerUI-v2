import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CellMinistryDataService } from '../_services/cell-ministry-data.service';
import { map, takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';

@Component({
    selector     : 'cell-ministry',
    templateUrl  : './cell-ministry.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class CellMinistryComponent implements OnDestroy
{
    chartGithubIssues: ApexOptions = {};

    totalAttendance$ = new BehaviorSubject(0);
    totalFirstTimers$ = new BehaviorSubject(0);
    totalNewConverts$ = new BehaviorSubject(0);

    attendanceChart = {
        scheme: {
            domain: ['#5c84f1']
        },
        data  : []
    };

    firstTimerChart = {
        scheme: {
            domain: ['#1c84f1']
        },
        data  : []
    };

    newConvertChart = {
        scheme: {
            domain: ['#9c84f1']
        },
        data  : []
    };

    private _unsubscribeAll = new Subject();


    constructor(private _data: CellMinistryDataService)
    {
        _data.getChartData$()
            .pipe(takeUntil(this._unsubscribeAll))
            .pipe(
                map(x => x.map( chart => {
                    const attendance = ({name: 'Week ' + chart.week, value: chart.totalAttendance});
                    const firstTimers = ({name: 'Week ' + chart.week, value: chart.totalFirstTimers});
                    const newConverts = ({name: 'Week ' + chart.week, value: chart.totalNewConverts});

                    return { attendance, firstTimers, newConverts };
                }) )
            ).subscribe(
                chartData => {
                    console.log('cell chart data', chartData);
                    const attendance = chartData.map(x => x.attendance);
                    const firstTimers = chartData.map(x => x.firstTimers);
                    const newConverts = chartData.map(x => x.newConverts);

                    const attendanceValues = attendance.map(x => x.value);
                    const firstTimersValues = firstTimers.map(x => x.value);
                    const newConvertsValues = newConverts.map(x => x.value);

                    this.attendanceChart = {
                        scheme: {
                            domain: ['#5c84f1']
                        },
                        data  : [...attendance]
                    };

                    this.firstTimerChart = {
                        scheme: {
                            domain: ['#1c84f1']
                        },
                        data  : [...firstTimers]
                    };

                    this.newConvertChart = {
                        scheme: {
                            domain: ['#9c84f1']
                        },
                        data  : [...newConverts]
                    };

                    const sumFn = (accumulator, currentValue) => accumulator + currentValue;
                    const totalAttendance = attendanceValues.reduce(sumFn);
                    const totalFirstTimers = firstTimersValues.reduce(sumFn);
                    const totalNewConverts = newConvertsValues.reduce(sumFn);
                    this.totalAttendance$.next(totalAttendance);
                    this.totalFirstTimers$.next(totalFirstTimers);
                    this.totalNewConverts$.next(totalNewConverts);
                }
            );
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}