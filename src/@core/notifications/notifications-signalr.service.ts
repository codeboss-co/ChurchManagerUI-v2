import { Inject, Injectable } from '@angular/core';

import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';
import { Environment } from '@shared/environment.model';
import { AuthService } from '@core/auth/auth.service';
import { ENV } from '@shared/constants';
import { OnlineUserModel, OnlineUsers } from '@shared/shared.models';
import { ToastrService } from '@core/notifications/toastr.service';
import { NotificationMethod } from '@core/notifications/notification';


/*
* https://marcstan.net/blog/2018/05/31/Home-App-SignalR/
* */

const WAIT_UNTIL_TOKEN_IS_READY_DELAY_IN_MS = 0;
// 0, 2, 10, 30, 60, 300 second delays before reconnect attempts.
// The last null param tell SignalR to stop re-trying.
const DEFAULT_RETRY_DELAYS_IN_MS = [0, 5000, 10000, 30000, 60000, 300000, null];

const HubSettings = {
  Name: 'Notifications',
  Path:  '/notifyhub'
};

@Injectable({providedIn: 'root'})
export class NotificationsSignalRService {

    public loginToken: string;

    // SignalR streams
    public messageReceived = new Subject<Notification>();
    public onlineUsers$ = new Subject<OnlineUserModel[]>();
    // SignalR streams

    public connectionEstablished = new BehaviorSubject<boolean>( false );
    private messagesCount: number;
    private _hubConnection: HubConnection;

    constructor(
        private auth: AuthService,
        private messenger: ToastrService,
        @Inject(ENV) private environment: Environment ) {

        console.log( `${HubSettings.Name} Hub URL`, `${this.environment.baseUrls.signalRHub}${HubSettings.Path}` );

        // Returns the token or empty of not authenticated
        auth.getToken$()
            .subscribe( token => {
                this.loginToken = token;
                // We need to be authorized to use this hub
                if ( token ) {
                    this.createConnection();
                    this.registerOnServerEvents();
                    this.startConnection();
                    this.messagesCount = 0;
                }
            } );
        }

    private createConnection() {
      console.log( `${HubSettings.Name} Hub URL`, `${this.environment.baseUrls.signalRHub}${HubSettings.Path}` );

      if ( !this._hubConnection || this._hubConnection.state === HubConnectionState.Disconnected) {
            this._hubConnection = new HubConnectionBuilder()
                .withUrl( `${this.environment.baseUrls.signalRHub}${HubSettings.Path}`, {accessTokenFactory: () => this.loginToken} )
                .withAutomaticReconnect( DEFAULT_RETRY_DELAYS_IN_MS )
                .configureLogging(LogLevel.Critical)
                .build();
        }
    }

    private registerOnServerEvents(): void {
        if (this._hubConnection) {
            // hub server events
            this._hubConnection.on( NotificationMethod.Broadcast, ( notify: Notification ) => {
                console.log(NotificationMethod.Broadcast, notify );
                this.messageReceived.next( notify );
            } );

            this._hubConnection.on( NotificationMethod.Direct, ( notify: Notification ) => {
                console.log(NotificationMethod.Direct, notify );
                this.messageReceived.next( notify );
            } );

            this._hubConnection.on( NotificationMethod.OnlineUsers, ( users: OnlineUsers ) => {
                console.log(NotificationMethod.OnlineUsers, users );
                const model = users.map(user => new OnlineUserModel(user));
                this.onlineUsers$.next(model);
            } );

            // hub connection state events
            this._hubConnection.onreconnecting( () => {
                this.messenger.default(
                    `Could not connect to ${HubSettings.Name} service. \nWe are retrying the connection.`,
                    'OK',
                    { duration: 5000 } );
            });

            this._hubConnection.onreconnected( () => {
                this.messenger.success( 'Connection Reestablished', 'OK' );
            });

            this._hubConnection.onclose((e) => {
                console.log(`${HubSettings.Name} Hub Connection closed!`, e);
            });
        }
    }

    private startConnection() {
        this._hubConnection
            .start()
            .then( () => {
                console.log( ` [√] Started ${HubSettings.Name}  Hub!` );
                this.connectionEstablished.next( true );

                // Send Test
                /* console.log('SignalR about to send to server');
                 const notification: INotification = {
                     type: 'success',
                     payload: 'whatever'
                 };
                 this._hubConnection.invoke("SendToUser", 'dillancagnetta@yahoo.com', notification);*/


            } )
            .catch( err => {
                console.error( 'Error while establishing connection :( - ' + err );
                this.messenger.error(
                    `Could not connect to ${HubSettings.Name}  service. \nPlease check your internet connection.`,
                    'OK',
                    { duration: 5000 } );
            } );
    }

}
