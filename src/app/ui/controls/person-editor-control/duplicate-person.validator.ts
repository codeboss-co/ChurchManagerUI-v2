import { AsyncValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ApiResponse } from '@shared/shared.models';

@Injectable()
export class PersonValidationService {

    private _apiUrl = this._environment.baseUrls.apiUrl;

    constructor(
        private _http: HttpClient,
        @Inject(ENV) private _environment: Environment) {}

    duplicatePerson(): AsyncValidatorFn {
        return (control: FormGroup): Observable<ValidationErrors | null> => {

            const {firstName,lastName,emailAddress} = control.value;
            const params = new HttpParams()
                .set('firstName', firstName)
                .set('lastName', lastName)
                .set('email', emailAddress);

            return this._http.get(
                `${this._apiUrl}/v1/people/duplicate-check`, {params})
                .pipe(
                    map((response: ApiResponse) => {
                        // null no error, object for error
                        return !response.data ? null : {duplicateError: 'Person exists already.'};
                    })
                );
        };
    }
}