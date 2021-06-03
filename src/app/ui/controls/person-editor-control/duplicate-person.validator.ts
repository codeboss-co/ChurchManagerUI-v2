import { AbstractControl, AsyncValidator, AsyncValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { debounceTime, delay, map } from 'rxjs/operators';

@Injectable()
export class DuplicatePersonValidator implements AsyncValidator
{
    private _apiUrl = this._environment.baseUrls.apiUrl;

    constructor(
        private _http: HttpClient,
        @Inject(ENV) private _environment: Environment)
    {
        console.log(_http);
    }

    validate(control: AbstractControl): Observable<ValidationErrors | null>
    {
        console.log('validate')
       const firstNameCtl = control.get('firstName');
       const lastNameCtl = control.get('lastName');

        if (firstNameCtl.valid && lastNameCtl.valid)
        {
            const {firstName,lastName,emailAddress} = control.value;
            const params = new HttpParams()
                .set('firstName', firstName)
                .set('lastName', lastName)
                .set('email', emailAddress);

            console.log('switchMap')
            return this._http.get(
                `${this._apiUrl}/v1/people/find`, {params})
                .pipe(
                    map((isUsed) => {
                        console.log('map _http')
                        // null no error, object for error
                        return !isUsed ? null : {duplicateError: 'Person exists already.'};
                    })
                )
        }

        return of({ 'InValid': true });
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
    takenUsernames = ['hello', 'world', 'username'];

    constructor() {}

    checkIfUsernameExists(username: string): Observable<boolean> {
        console.log('username', username);
        // normally, this is where you will connect to your backend for validation lookup
        // using http, we simulate an internet connection by delaying it by a second
        return of(this.takenUsernames.includes(username)).pipe(delay(1000));
    }

    usernameValidator(): AsyncValidatorFn {
        return (control: FormGroup): Observable<ValidationErrors | null> => {
            console.log('usernameValidator');
            return this.checkIfUsernameExists(control.value).pipe(
                map(res => {
                    console.log(res);
                    // if res is true, username exists, return true
                    return res ? { usernameExists: true } : null;
                    // NB: Return null if there is no error
                })
            );
        };
    }
}