export interface ConfirmDialogModel
{
    title: string;
    message: string;
    confirmCaption?: string;
    cancelCaption?: string;
}

export class DefaultConfirmDialog implements ConfirmDialogModel
{
    confirmCaption: string;
    cancelCaption: string;

    constructor(public title: string, public message: string)
    {
        this.confirmCaption = 'Confirm';
        this.cancelCaption = 'Cancel';
    }
}