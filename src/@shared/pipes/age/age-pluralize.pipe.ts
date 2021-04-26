import { Pipe, PipeTransform } from '@angular/core';
import { BirthDate } from '@features/admin/people';

/**
 * Pluralizes age number if present
 */
@Pipe({
    name: 'agePluralize',
    pure: false
})
export class AgePluralizePipe implements PipeTransform
{
    transform( birthDate?: BirthDate, ...args: any[] ): string {
        if ( birthDate && birthDate.age ){
           if (birthDate.age <= 1){
               return `${birthDate.age} yr`;
           } else {
               return `${birthDate.age} yrs`;
           }
        }
    }
}