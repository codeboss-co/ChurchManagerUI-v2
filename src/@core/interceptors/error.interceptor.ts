import { Inject, Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { ToastrService } from '@core/notifications/toastr.service';
import { CmHttpErrorResponse } from '@shared/shared.models';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    private toastConfig = {
        destroyByClick: true,
        duration: 5000,
    };

    constructor( private messenger: ToastrService, @Inject(ENV) private environment: Environment ) {}

    intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            retry(2),
            catchError((error: HttpErrorResponse | CmHttpErrorResponse) => {
                // 401 handled in auth.interceptor
                if (error && error.status !== 401) {
                    console.log('Error Interceptor', error);

                    if (this.environment.production) {
                        this.messenger.error( 'Something has gone wrong.', 'OK', this.toastConfig );
                    } else {
                        this.messenger.error( error.message, 'OK', this.toastConfig );
                    }
                }

                return throwError(error);
            })
        );
    }
}
