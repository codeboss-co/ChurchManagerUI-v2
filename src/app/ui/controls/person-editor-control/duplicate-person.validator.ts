import { AbstractControl, AsyncValidator, AsyncValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiResponse } from '@shared/shared.models';

@Injectable()
export class DuplicatePersonValidator implements AsyncValidator
{
    private _apiUrl = this._environment.baseUrls.apiUrl;

    constructor(
        private _http: HttpClient,
        @Inject(ENV) private _environment: Environment)
    {
    }

    validate(control: AbstractControl): Observable<ValidationErrors | null>
    {
        console.log('validate')

        const {firstName,lastName,emailAddress} = control.value;
        const params = new HttpParams()
            .set('firstName', firstName)
            .set('lastName', lastName)
            .set('email', emailAddress);

        return this._http.get(
            `${this._apiUrl}/v1/people/find`, {params})
            .pipe(
                map((valid) => {
                    console.log('valid', valid)
                    // null no error, object for error
                    return !valid ? null : {duplicateError: 'Person exists already.'};
                })
            );
    }
}

export class ZipcodeValidator {
    static createValidator(zipcodeService: DuplicatePersonValidator): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors> => {
            return zipcodeService.validate(control);
        };
    }
}

@Injectable({
    providedIn: 'root'
})
export class UsernameValidationService {

    private _apiUrl = this._environment.baseUrls.apiUrl;

    constructor(private _http: HttpClient,
                @Inject(ENV) private _environment: Environment) {}

    usernameValidator(): AsyncValidatorFn {
        return (control: FormGroup): Observable<ValidationErrors | null> => {
            console.log('validate')

            const {firstName,lastName,emailAddress} = control.value;
            const params = new HttpParams()
                .set('firstName', firstName)
                .set('lastName', lastName)
                .set('email', emailAddress);

            return this._http.get(
                `${this._apiUrl}/v1/people/find`, {params})
                .pipe(
                    map((response: ApiResponse) => {
                        console.log('response', response)
                        // null no error, object for error
                        return !response.data ? null : {duplicateError: 'Person exists already.'};
                    })
                );
        };
    }
}