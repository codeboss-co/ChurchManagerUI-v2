import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
    providedIn: 'root'
})
export class AuthService
{
    private _apiUrl = this._environment.baseUrls.apiUrl;
    isAuthenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _router: Router,
        private _jwtHelper: JwtHelperService,
        @Inject(ENV) private _environment: Environment
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
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
    signIn(credentials: { username: string, password: string }): Observable<any>
    {
        return this._httpClient.post(`${this._apiUrl}/v1/auth/login`, credentials)
            .pipe(
                map((response) => {
                    const token = (<any>response).accessToken;
                    const refreshToken = (<any>response).refreshToken;
                    this.accessToken = token;
                    localStorage.setItem("refreshToken", refreshToken);
                    this.isAuthenticated = true;
                } )
            );
    }

    /** get authenticate state */
    public isAuthenticated$(): Observable<boolean> {
        const token: string = this.accessToken;
        if (token && !this._jwtHelper.isTokenExpired(token)) {
            return of(true);
        }

        return of(false);
    }

    /**
     * Sign out
     */
    signOut(): void
    {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        this._router.navigate(['sign-in']);
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
        return of(this.accessToken);
    }
}
