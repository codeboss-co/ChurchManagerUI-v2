import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { AuthService } from '@core/auth/auth.service';
import { AuthUtils } from '@core/auth/auth.utils';
import { Auth } from 'aws-amplify';

export const InterceptorSkipHeader = 'X-Skip-Interceptor';

@Injectable()
export class AuthInterceptor implements HttpInterceptor
{
    /**
     * Constructor
     */
    constructor(private _authService: AuthService)
    {
    }

    /**
     * Intercept
     *
     * @param request
     * @param next
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        // Ignore if we have this header or reading assets
        if (request.headers.has(InterceptorSkipHeader) || request.url.includes('assets')) {
            const headers = request.headers.delete(InterceptorSkipHeader);
            return next.handle(request.clone({ headers }));
        }

        // Only for our http requests to api
        if (request.url.includes('/api')) {
            return this._getToken().pipe(
                mergeMap(token => {

                    console.log('Auth Interceptor token called');

                    const tokenReq = request.clone({
                        setHeaders: { Authorization: `Bearer ${token}` }
                    });

                    // Response
                    return next.handle(tokenReq)
                        .pipe(
                            catchError((error) => {

                                // Catch "401 Unauthorized" responses
                                if ( error instanceof HttpErrorResponse && error.status === 401 )
                                {
                                    // Sign out
                                    this._authService.signOut();

                                    // Reload the app
                                    location.reload();
                                }

                                return throwError(error);
                            })
                        );
                    }),
                    catchError(err => throwError(err))
            );
        }
    }

    /*
  * Retrieves the token from the active session
  */
    private _getToken() {
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
