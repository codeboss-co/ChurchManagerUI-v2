import { Moment } from 'moment';

export interface GroupAttendanceRecord
{
    id: number;
    groupName: string;
    attendanceDate: Date | string;
    didNotOccur?: boolean;
    attendanceCount?: number;
    firstTimerCount?: number;
    newConvertCount?: number;
    receivedHolySpiritCount?: number;
    notes?: string;
    photoUrls: string[];
}

export interface GroupAttendanceRecordDetail extends  GroupAttendanceRecord
{
    didAttendCount: number;
    attendanceCount: number;
    attendanceEntered: boolean;
    attendanceRate: number;
    attendanceReviewed: boolean;
    attendees?: GroupAttendees;
    attendanceReview: AttendanceReview;
}

export type GroupAttendees = GroupAttendee[];

export interface GroupAttendee
{
    groupMemberId: number;
    didAttend: boolean;
    isFirstTime?: any;
    isNewConvert: boolean;
    receivedHolySpirit: boolean;
    note?: any;
    groupMember: GroupMemberPerson;
}

interface AttendanceReview
{
    isReviewed?: boolean;
    feedback?: string;
    reviewedBy?: string;
}

interface GroupMemberPerson
{
    personId: number;
    firstName: string;
    middleName?: any;
    lastName: string;
    gender: string;
    photoUrl: string;
}

export interface GroupAttendanceQuery
{
    churchId: number;
    groupId?: number;
    withFeedBack?: boolean;
    from?: Date;
    to?: Date;
}

export interface GroupAttendanceReportGridQuery
{
    groupTypeId: number;
    groupId: number[];
    from: Moment;
    to: Moment;
}

export class GroupAttendanceReportGridRow
{
    Date: Date;
    Church: string;
    Group: string;
    Attendance: number;
    FirstTimers: number;
    NewConverts: number;
    ReceivedHolySpirit: number;
    Offering: number;

    constructor(model: any) {
        this.Date = model.attendanceDate;
        this.Church = model.churchName;
        this.Group = model.groupName;
        this.Attendance = model.attendanceCount;
        this.FirstTimers = model.firstTimerCount;
        this.NewConverts = model.newConvertCount;
        this.ReceivedHolySpirit = model.receivedHolySpiritCount;
        this.Offering = model.offering?.amount ?? 0;
    }
}

export interface CellGroupsWeeklyBreakdown
{
    week: number;
    totalAttendance?: number;
    totalNewConverts?: number;
    totalFirstTimers?: number;
    totalHolySpirit?: number;
}

export interface CellGroupsDashboardData
{
    totalCellsCount: number;
    activeCellsCount: number;
    inActiveCellsCount: number;
    onlineCellsCount: number;
    peopleCount: number;
    leadersCount: number;
    openedCells: number;
    closedCells: number;

    newConvertsCount: number;
    firstTimersCount: number;
    holySpiritCount: number;
}
