import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Identifiable } from '@shared/shared.models';

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