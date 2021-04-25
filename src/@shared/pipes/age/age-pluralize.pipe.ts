import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pluralizes age number if present
 */
@Pipe({
    name: 'agePluralize',
    pure: false
})
export class AgePluralizePipe implements PipeTransform
{
    transform( value: number, ...args: any[] ): string {
        if ( value ){
           if (value <= 1){
               return `${value} yr`;
           } else {
               return `${value} yrs`;
           }
        }
    }
}