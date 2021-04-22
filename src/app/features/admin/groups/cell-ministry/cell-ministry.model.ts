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

export interface GroupAttendanceRecordDetail extends  GroupAttendanceRecord {
    didAttendCount: number;
    attendanceCount: number;
    attendanceEntered: boolean;
    attendanceRate: number;
    attendanceReviewed: boolean;
    attendees?: GroupAttendee[];
}

export interface GroupAttendee {
    groupMemberId: number;
    didAttend: boolean;
    isFirstTime?: any;
    isNewConvert: boolean;
    receivedHolySpirit: boolean;
    note?: any;
    groupMember: GroupMemberPerson;
}

interface GroupMemberPerson {
    personId: number;
    firstName: string;
    middleName?: any;
    lastName: string;
    gender: string;
    photoUrl: string;
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