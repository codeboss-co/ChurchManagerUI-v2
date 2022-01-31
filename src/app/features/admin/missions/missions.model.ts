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
    stream?: string;
    startDateTime?: Date | string;
    endDateTime?: Date | string;
    attendance?: Attendance;
}

export interface Attendance {
    attendanceCount?: number;
    firstTimerCount?: number;
    newConvertCount?: number;
    receivedHolySpiritCount?: number;
}


export const missionTypes: string[] = ['InReach', 'OutReach'];
export const missionCategoryList: string[] = ['ROSA' , 'Healing Streams', 'Shelter', 'Offer7', 'Cell', 'Festival of Souls'];
export const missionStreams: string[] = ['Person' , 'Group', 'Church'];