export interface Notification {
    id?: string | any;
    type?: string;
    title?: string;
    payload?: string;
    icon?: string;
}

/** Describes the current state of the {@link NotificationMethod} to the server. */
export enum NotificationMethod {
  /** Broadcast all Users Message. */
  Broadcast = 'BroadcastMessage',
  /** Direct User Message */
  Direct = 'DirectMessage',
  /** List of online users */
  OnlineUsers = 'OnlineUsers'
}
