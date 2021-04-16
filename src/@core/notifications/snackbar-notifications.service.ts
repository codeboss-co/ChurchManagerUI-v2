import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationsSignalRService } from '@core/notifications/notifications-signalr.service';
import { ToastrService } from '@core/notifications/toastr.service';
import { Notification } from '@core/notifications';

@Injectable({providedIn: 'root'})
export class SnackbarNotificationsService implements OnDestroy {

  // Private
  private _subscription: Subscription;

  constructor(
    private _signalR: NotificationsSignalRService,
    private _snackBar: ToastrService) {

    this._subscription = this._signalR.messageReceived
      .subscribe( ( notify: Notification ) => {
          switch ( notify.type ) {
              case 'success' :
                  // Show the success message
                  this._snackBar.success(notify.title, 'OK');
                  break;

              case 'error' :
                  // Show the success message
                  this._snackBar.error(notify.title, 'OK');
                  break;

              default :
                  // Show the success message
                  this._snackBar.default(notify.title, 'OK');
                  break;
          }
      } );
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
    // Unsubscribe from all subscriptions
    (this._subscription && this._subscription.unsubscribe());
  }

}
