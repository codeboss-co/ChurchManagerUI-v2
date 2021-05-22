import { Inject, Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { PushSubscriptionService } from '@core/notifications/push-subscription.service';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PushNotificationsService {
    /**
     * Currently active Push Subscription or null if there is no subscription.
     */
    private _subscription: PushSubscription;
    public isSubscribed$ = new Subject<boolean>();
    public isEnabled$ = new BehaviorSubject(this._swPush.isEnabled);
    public operationName: string;

    constructor(
        private _swPush: SwPush,
        private _subsService: PushSubscriptionService,
        private _snackBar: MatSnackBar,
        @Inject(ENV) private _environment: Environment) {

        _swPush.subscription.subscribe((subscription) => {
            console.log('[Push Subscription] sub changed', subscription);
            this._subscription = subscription;
            this._subscription === null ? this.isSubscribed$.next(false) : this.isSubscribed$.next(true);
        });
    }

    subscribeToPushNotifications(): void {
        // True if the Service Worker is enabled (supported by the browser and enabled via ServiceWorkerModule).
        if (this._swPush.isEnabled) {
            // Request subscription with the service worker
            this._swPush.requestSubscription({
                serverPublicKey: this._environment.push.publicKey
            })
                .then(sub => {
                    // Distribute subscription to the server
                    this._subsService.addSubscription(sub).subscribe(() => {
                        console.log('[Push Subscription] Add subscriber server succeeded.');

                        // let the user know they are successfully subscribed
                        this._snackBar.open(
                            'Thank you for subscribing.',
                            null,
                            {
                                duration: 2000
                            }
                        );

                    }, err => {
                        console.log('[Push Subscription] Add subscriber request failed', err);
                    });
                })
                .catch(err => console.error(err));
        }
    }

    unSubscribeFromPushNotifications(): void {
        // Get active subscription
        if (this._subscription) {
            console.log('[Push Subscription] current subscription', this._subscription);
            // Remove from server
            this._subsService.removeSubscription(this._subscription).subscribe(() => {
                    console.log('[Push Subscription] Delete subscriber server succeeded.');

                    // Unsubscribe current client
                    this._swPush.unsubscribe()
                        .then(() => {
                            console.log('[Push Subscription] Unsubscription successful');

                            this._snackBar.open(
                                'You are now unsubscribed.',
                                null,
                                {
                                    duration: 2000
                                }
                            );
                        })
                        .catch(error => console.error(error));

                },
                error => console.error(error)
            );
        }
    }

    showMessages(): void {
        this._swPush.messages.subscribe(message => {
            console.log(message);
        });
    }
}
