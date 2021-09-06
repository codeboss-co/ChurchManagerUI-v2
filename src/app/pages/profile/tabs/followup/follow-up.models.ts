export interface FollowUpListQuery
{
    assignedToMe?: boolean;
    withAction?: boolean;
    from?: Date;
    to?: Date;
}