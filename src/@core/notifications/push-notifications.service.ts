import { Inject, Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { PushSubscriptionService } from '@core/notifications/push-subscription.service';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, shareReplay, take } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PushNotificationsService
{
    /**
     * Currently active Push Subscription or null if there is no subscription.
     */
    readonly subscription$: Observable<PushSubscription | null>;
    readonly isSubscribed$ = new BehaviorSubject(false);
    readonly isEnabled: boolean = this._swPush.isEnabled;

    constructor(
        private _swPush: SwPush,
        private _subscriptions: PushSubscriptionService,
        private _snackBar: MatSnackBar,
        @Inject(ENV) private _environment: Environment) {

        this.subscription$ = _swPush.subscription;
        this.subscription$.subscribe(x => console.log('push sub change', x));
    }

    subscribeToPushNotifications(): void {
        // True if the Service Worker is enabled (supported by the browser and enabled via ServiceWorkerModule).
        if (this._swPush.isEnabled) {
            this._swPush.requestSubscription({
                serverPublicKey: this._environment.push.publicKey
            })
                .then(sub => {
                    this._subscriptions.addSubscription(sub).subscribe(response => {
                        console.log('[Push Subscription] Add subscriber request answer', response);

                        this._snackBar.open(
                            'Now you are subscribed',
                            null,
                            {
                                duration: 2000
                            }
                        );

                        this.isSubscribed$.next(true);
                    }, err => {
                        console.log('[Push Subscription] Add subscriber request failed', err);
                    });
                })
                .catch(err => console.error(err));
        }
    }

    unSubscribeFromPushNotifications(): void
    {
        // Get active subscription
        this._swPush.subscription.pipe(take(1)).subscribe(currentSubscription => {
            console.log('[Push Subscription] current subscription', currentSubscription);

            // Delete the subscription on the backend
            this._subscriptions.removeSubscription(currentSubscription).subscribe(
                response => {
                    console.log('[Push Subscription] Delete subscriber request answer', response);

                    // Unsubscribe current client (browser)
                    currentSubscription
                        .unsubscribe()
                        .then(success => {
                            console.log('[Push Subscription] Unsubscription successful', success);
                        })
                        .catch(err => {
                            console.log('[Push Subscription] Unsubscription failed', err);
                        });


                    this._snackBar.open(
                        'Now you are unsubscribed',
                        null,
                        {
                            duration: 2000
                        }
                    );

                    this.isSubscribed$.next(false);
                },
                err => {
                    console.log('[Push Subscription] Delete subscription request failed', err);
                }
            );
        });
    }

    showMessages(): void
    {
        this._swPush.messages.subscribe(message => {
            console.log(message);
        });
    }
}
