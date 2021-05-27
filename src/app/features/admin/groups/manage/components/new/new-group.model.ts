import { Moment } from 'moment';

export interface NewGroupForm {
    churchId: number;
    groupTypeId: number;
    parentGroupId?: number | null;
    name: string;
    description: string;
    meetingTime: Moment;
    start?: Moment;
    end?: Moment;
    recurrence?: string;
}