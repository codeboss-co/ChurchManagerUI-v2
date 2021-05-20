export interface CalendarWeekday
{
    abbr: string;
    label: string;
    value: string;
}

export const weekdays: CalendarWeekday[] = [
    {
        abbr : 'M',
        label: 'Monday',
        value: 'MO'
    },
    {
        abbr : 'T',
        label: 'Tuesday',
        value: 'TU'
    },
    {
        abbr : 'W',
        label: 'Wednesday',
        value: 'WE'
    },
    {
        abbr : 'T',
        label: 'Thursday',
        value: 'TH'
    },
    {
        abbr : 'F',
        label: 'Friday',
        value: 'FR'
    },
    {
        abbr : 'S',
        label: 'Saturday',
        value: 'SA'
    },
    {
        abbr : 'S',
        label: 'Sunday',
        value: 'SU'
    }
];

export interface Weekly {
    byDay: string[];
}

export interface NewGroupForm {
    groupTypeId: number;
    parentGroupId: number;
    name: string;
    description: string;
    frequency?: string;
    weekly?: Weekly;
    meetingTime?: string;
}