export interface GroupAttendanceForm {
    groupId: number;
    didNotOccur?: boolean;
    attendanceDate: Date | string;
    members: [];
    firstTimers: [];
    note?: string;
}
