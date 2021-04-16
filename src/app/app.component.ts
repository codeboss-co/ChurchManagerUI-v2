import { Component } from '@angular/core';
import { SnackbarNotificationsService } from '@core/notifications/snackbar-notifications.service';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
    /**
     * Constructor
     */
    constructor(private _notifier: SnackbarNotificationsService)
    {
    }
}
