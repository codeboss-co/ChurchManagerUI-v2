import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Identifiable } from '@shared/shared.models';
import { GroupTypeGroup } from '@ui/controls/group-types-groups-select-control/group-type-group.model';

/**
 * Validates if the value passed has a code in order to be declared as an
 * object provided by material autocomplete options
 */
export function isAutocompleteOption( value: Identifiable ): boolean {
    return (value as Identifiable)?.id !== undefined;
}

/**
 * Validates the control value to have an `id` attribute. It is expected
 * control value to be an object.
 */
export function containsIdValidation( control: AbstractControl ): ValidationErrors {
    return isAutocompleteOption( control.value ) ? null : { invalidId: true };
}


export class CustomValidators {

    /**
     * Validates the control value to have an `GroupTypeGroup` values.
     */
    static groupAndGroupType( control: AbstractControl ): ValidationErrors {
        const value = control.value as GroupTypeGroup;
        return value?.groupTypeId !== null && value?.groupId !== null ? null : { invalid: true };
    }

}