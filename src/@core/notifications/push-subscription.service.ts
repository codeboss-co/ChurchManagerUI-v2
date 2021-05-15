import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { EMPTY, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PushSubscriptionService
{
    private _apiUrl = this._environment.baseUrls.apiUrl;

    constructor(
        private _http: HttpClient,
        @Inject(ENV) private _environment: Environment) { }

    addSubscription(subscription: PushSubscription): Observable<any>
    {
        console.log('[Push Subscription Service] Adding subscriber');
        return this._http.post(`${this._apiUrl}/v1/webpush/subscribe`, { subscription: subscription });
    }

    removeSubscription(subscription: PushSubscription): Observable<any>
    {
        console.log('[Push Subscription Service] Deleting subscriber');
        return this._http.post(`${this._apiUrl}/v1/webpush/unsubscribe`, { subscription: subscription });
    }
}

/**
 * Converts an ArrayBuffer to a String.
 *
 * @param arrayBuffer - Buffer to convert.
 * @returns String.
 */
export function base64Encode(arrayBuffer: ArrayBuffer): string
{
    return btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
}
