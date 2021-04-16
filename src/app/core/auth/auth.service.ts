import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { CognitoUser } from 'amazon-cognito-identity-js';
import Amplify, { Auth } from 'aws-amplify';
import { environment } from '../../../environments/environment';
import { fromPromise } from 'rxjs/internal-compatibility';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService
{
    private _authenticated: boolean = false;

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
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('access_token', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('access_token') ?? '';
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
                .catch(error =>  this._authState.next(null) )
            );

       /* // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post('api/auth/sign-in', credentials).pipe(
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.access_token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );*/
    }

    /** get authenticat state */
    public currentAuthenticatedUser$(): Observable<CognitoUser> {
        return fromPromise(Auth.currentAuthenticatedUser())
            .pipe(
                map((cognitoUser: CognitoUser) => {
                    console.log('CognitoUser', cognitoUser);
                    this._authState.next(cognitoUser);
                    return cognitoUser;
                }),
                catchError(error => {
                    this._authState.next(null);
                    return of(null);
                })
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
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Renew token
        return this._httpClient.post('api/auth/refresh-access-token', {
            access_token: this.accessToken
        }).pipe(
            catchError(() => {

                // Return false
                return of(false);
            }),
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.access_token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                // this._userService.user = response.user;

                // Return true
                return of(true);
            })
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

        /*// Remove the access token from the local storage
        localStorage.removeItem('access_token');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);*/
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

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
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
