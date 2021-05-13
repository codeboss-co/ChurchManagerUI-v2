import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ToastrService } from '@core/notifications/toastr.service';

@Injectable()
export class NotificationsInterceptor implements HttpInterceptor {

    constructor(private messenger: ToastrService) {}

    intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {

        // Only handle POST or DELETE requests
        if (!(req.method === 'POST' || req.method === 'DELETE')) {
            return next.handle(req);
        }

        console.log('Notifications Interceptor');

        return next.handle(req).pipe(
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse && event.status === 202) {
                    console.log('\t - Successfully Accepted');
                    this.messenger.success( 'Your request is processing.', 'Successfully Accepted');
                }
            })
        );
    }
}
