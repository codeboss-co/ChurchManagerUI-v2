interface ChurchAttendanceMonthlyTotals {
    year: number;
    month: number;
    totalAttendance: number;
    totalNewConverts: number | null;
    totalFirstTimers: number | null;
}

export interface ChurchAttendanceAnnualBreakdown {
    year: number;
    data: ChurchAttendanceMonthlyTotals[];
}
