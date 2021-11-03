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


