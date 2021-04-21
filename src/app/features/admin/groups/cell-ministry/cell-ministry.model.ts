export interface GroupAttendanceRecord {
    id: number;
    groupName: string;
    attendanceDate: Date;
    didNotOccur?: boolean;
    attendanceCount?: number;
    firstTimerCount?: number;
    newConvertCount?: number;
    receivedHolySpiritCount?: number;
    notes?: string;
    photoUrls: string[];
}

export interface GroupAttendanceQuery {
    churchId: number;
    groupId?: number;
    withFeedBack?: boolean;
    from?: Date;
    to?: Date;
}

export interface CellGroupsWeeklyBreakdown {
    week: number;
    totalAttendance?: number;
    totalNewConverts?: number;
    totalFirstTimers?: number;
    totalHolySpirit?: number;
}