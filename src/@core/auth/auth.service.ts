import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthUtils } from '@core/auth/auth.utils';
import { UserService } from '@core/user/user.service';
import { CognitoUser } from 'amazon-cognito-identity-js';
import Amplify, { Auth } from 'aws-amplify';
import { environment } from '../../environments/environment';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService
{
    private _authState: Subject<CognitoUser> = new Subject<CognitoUser>();
    authState: Observable<CognitoUser> = this._authState.asObservable();

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _router: Router
    )
    {
        Amplify.configure(environment.amplify);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string, password: string }): Observable<any>
    {
        return fromPromise(
            Auth.signIn(credentials.email, credentials.password)
                .then(cognitoUser => this._authState.next(cognitoUser) )
                .catch(error =>  {
                    this._authState.next(null);
                    throw error;
                } )
            );
    }

    /** get authenticate state */
    public isAuthenticated$(): Observable<boolean> {
        return fromPromise(Auth.currentAuthenticatedUser())
            .pipe(
                map(result => true),
                catchError(error => of(false))
            );
    }

    /**
     * Sign out
     */
    signOut(): void
    {
        fromPromise(Auth.signOut())
            .subscribe(
                result => {
                    this._authState.next(null);
                    this._router.navigate(['sign-in']);
                },
                error => console.log(error)
            );
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string, email: string, password: string, company: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string, password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /*
    * Retrieves the token from the active session
    */
    public getToken$(): Observable<any> {
        return from(
            new Promise((resolve, reject) => {
                Auth.currentSession().then((session) => {
                    if (!session.isValid()) {
                        resolve(null);
                    } else {
                        resolve(session.getAccessToken().getJwtToken());
                    }
                })
                    .catch(err => resolve(null));
            })
        );
    }
}
