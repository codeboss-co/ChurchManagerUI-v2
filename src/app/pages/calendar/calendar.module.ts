import { NgModule } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseDateRangeModule } from '@fuse/components/date-range';
import { CalendarRecurrenceComponent } from './recurrence/recurrence.component';
import { SharedModule } from '@shared/shared.module';
import { CalendarRecurrenceRuleFriendlyPipe } from './calendar.pipes';

@NgModule({
    declarations: [
        CalendarRecurrenceComponent,
        CalendarRecurrenceRuleFriendlyPipe
    ],
    imports     : [
        ScrollingModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatMomentDateModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatTooltipModule,
        FuseDateRangeModule,
        SharedModule
    ],
    exports: [CalendarRecurrenceComponent, FuseDateRangeModule, CalendarRecurrenceRuleFriendlyPipe],
    providers   : [
        {
            provide : MAT_DATE_FORMATS,
            useValue: {
                parse  : {
                    dateInput: 'DD/MM/YYYY'
                },
                display: {
                    dateInput         : 'DD/MM/YYYY',
                    monthYearLabel    : 'MMM YYYY',
                    dateA11yLabel     : 'DD/MM/YYYY',
                    monthYearA11yLabel: 'MMMM YYYY'
                }
            }
        }
    ]
})
export class CalendarModule
{
}
