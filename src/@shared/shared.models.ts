export interface ApiResponse {
    succeeded: boolean;
    message?: any;
    errors?: any;
    data?: any;
}

export interface Identifiable {
    id: string | number;
    label: string;
}

export declare type Autocompletes = Identifiable[];

export interface SelectItem {
    id: string | number;
    name: string;
}

export interface UserDetails {
    username?: string;
    userLoginId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    photoUrl?: string;
}

export interface DialogData<T> {
    data: T;
}

export declare type OnlineUsers = OnlineUser[];
export interface OnlineUser
{
    id: string;  // userLoginId
    name: string;
    avatar?: string; // photoUrl
    status: string;
    unread?: number;
    lastOnline?: Date;
}

export class OnlineUserModel implements OnlineUser
{
    id: string;  // userLoginId
    name: string;
    avatar?: string; // photoUrl
    status: string;
    unread?: number;
    lastOnline?: Date;

    constructor(model: Partial<OnlineUser>)
    {
        this.id = model.id;
        this.name = model.name;
        this.avatar = model.avatar  || 'assets/images/avatars/profile-blank.jpg';
        this.status = model.status;
        this.unread = model.unread;
        this.lastOnline = model.lastOnline;
    }
}


