import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pluralizes age number if present
 */
@Pipe({
    name: 'age',
    pure: false
})
export class AgePluralizePipe implements PipeTransform
{
    transform( value: number, ...args: any[] ): string {
        if ( value ){
           if (value === 1){
               return 'yr';
           } else {
               return 'yrs';
           }
        }
    }
}