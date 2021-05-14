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

        const body = {
            name: 'test sub 1',
            endpoint: subscription.endpoint,
            p256dh: base64Encode(subscription.getKey('p256dh')),
            auth: base64Encode(subscription.getKey('auth'))
        };

        //return this._http.post(`${this._apiUrl}/v1/webpush/subscribe`, body);
        return of('SUCCEEDED');
    }

    removeSubscription(subscription: PushSubscription): Observable<any>
    {
        console.log('[Push Subscription Service] Deleting subscriber');

        const body = {
            name: 'test sub 1',
            endpoint: subscription.endpoint,
            p256dh: base64Encode(subscription.getKey('p256dh')),
            auth: base64Encode(subscription.getKey('auth'))
        };

        //return this._http.post(`${this._apiUrl}/v1/webpush/unsubscribe`, body);
        return of('SUCCEEDED');
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
