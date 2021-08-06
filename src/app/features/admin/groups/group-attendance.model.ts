export interface GroupAttendanceForm
{
    groupId: number;
    didNotOccur?: boolean;
    attendanceDate: Date | string;
    members: [];
    firstTimers: [];
    offering?: number;
    notes?: string;
}
