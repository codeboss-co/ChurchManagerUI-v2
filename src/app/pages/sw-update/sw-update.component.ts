import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WindowRef } from '@core/window-ref';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'sw-update-menu',
    templateUrl: './sw-update.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwUpdateComponent implements OnInit, OnDestroy {

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        public snackBar: MatSnackBar,
        private winRef: WindowRef,
        private swUpdate: SwUpdate
    ) {
    }

    ngOnInit(): void {
        this._subscribeForUpdates();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    private _subscribeForUpdates(): void {
        this.swUpdate.available
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(event => {
                console.log(
                    '[App Update] Update available: current version is',
                    event.current,
                    'available version is',
                    event.available
                );

                const versionMessage = event.available.appData ? event.available.appData['versionMessage'] : '';
                const snackBarRef = this.snackBar.open(
                    versionMessage || 'Newer version of the app is available.',
                    'Refresh'
                );

                snackBarRef.onAction().subscribe(() => {
                    this.activateUpdate();
                });
            });

        this.swUpdate.activated
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(event => {
                console.log(
                    '[App Update] Update activated: old version was',
                    event.previous,
                    'new version is',
                    event.current
                );
            });
    }

    activateUpdate(): void {
        console.log('[App Update] activateUpdate started');
        this.swUpdate
            .activateUpdate()
            .then(() => {
                console.log('[App Update] activateUpdate completed');
                this.winRef.nativeWindow.location.reload();
            })
            .catch(err => {
                console.error(err);
            });
    }

    checkForUpdate(): void {
        console.log('[App Update] checkForUpdate started');
        this.swUpdate
            .checkForUpdate()
            .then(() => {
                console.log('[App Update] checkForUpdate completed');
            })
            .catch(err => {
                console.error(err);
            });
    }

    openLog(): void {
        this.winRef.nativeWindow.open('/ngsw/state');
    }
}
