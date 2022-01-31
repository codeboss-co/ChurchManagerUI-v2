export interface MissionsQuery
{
    types?: string[];
    categories?: string[];
    groupId?: number;
    from?: Date;
    to?: Date;
}

export interface Mission
{
    id: number;
    name: string;
    type: string;
    category: string;
    startDateTime?: Date | string;
    endDateTime?: Date | string;
}

export interface Attendance {
    attendanceCount?: number;
    firstTimerCount?: number;
    newConvertCount?: number;
    receivedHolySpiritCount?: number;
}


export const missionTypes: string[] = ['InReach', 'OutReach'];
export const missionCategoryList: string[] = ['ROSA' , 'Healing Streams'];