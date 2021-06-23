import { Pipe, PipeTransform } from '@angular/core';
import { recurrenceRuleFriendlyText } from './index';

@Pipe({
    name: 'recurrenceRuleFriendly',
    pure: true
})
export class CalendarRecurrenceRuleFriendlyPipe implements PipeTransform
{
    transform( recurrence: string ): string {
        return recurrenceRuleFriendlyText(recurrence);
    }
}