import { Moment } from 'moment';

export interface NewGroupForm
{
    parentChurchGroup?: {churchId: number; groupId: number | null};
    groupTypeId: number;
    name: string;
    description?: string;
    meetingTime: Moment;
    start?: Moment;
    end?: Moment;
    recurrence?: string;
}

export interface EditGroupForm extends NewGroupForm
{
    groupId: number;
}