export interface FollowUpQuery
{
    assignedToMe?: boolean;
    withAction?: boolean;
    from?: Date;
    to?: Date;
}

export interface FollowUpRecord
{
    id: number;
    assignedDate: Date | string;
    actionDate?: Date | string;
    type?: string;
    severity?: string;
    assignedPerson?: string;
    person?: string;
    note?: string;
    requiresAdditionalFollowUp?: boolean;
}