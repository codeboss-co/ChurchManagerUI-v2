import RRule from 'rrule';

export interface Calendar
{
    id: string;
    title: string;
    color: string;
    visible: boolean;
}

export interface CalendarSettings
{
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD' | 'll';
    timeFormat: '12' | '24';
    startWeekOn: 6 | 0 | 1;
}

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

export const settings: CalendarSettings = {
    dateFormat : 'll', // Aug 20, 2019
    timeFormat : '24', // 24-hour format
    startWeekOn: 1 // Monday
};


// Convert the recurrence rule to friendly text
export const recurrenceRuleFriendlyText = (recurrence: string): string => {
    // Convert the recurrence rule to text
    let ruleText = RRule.fromString(recurrence).toText();
    ruleText = ruleText.charAt(0).toUpperCase() + ruleText.slice(1);

    // Return the rule text
    return ruleText;
};
