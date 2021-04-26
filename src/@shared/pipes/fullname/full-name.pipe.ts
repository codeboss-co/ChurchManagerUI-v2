import { Pipe, PipeTransform } from '@angular/core';
import { FullName } from '@features/admin/people';

/**
 * Displays full name
 */
@Pipe({
    name: 'fullName',
    pure: false
})
export class FullNamePipe implements PipeTransform
{
    transform( value: FullName, short: boolean = true ): string {
        if ( short ){
          return `${value.firstName} ${value.lastName}`;
        } else{
            return `${value.title} ${value.firstName} ${value.middleName} ${value.lastName} ${value.suffix}`;
        }
    }
}