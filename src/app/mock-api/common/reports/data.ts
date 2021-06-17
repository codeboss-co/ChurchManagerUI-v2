/* eslint-disable */
export const reportsData: Flexmonster.Report[] = [
    {
        dataSource: {
            type: 'group-attendance-report',
            mapping: {
                Date: {
                    type: "year/quarter/month/day"
                },
                Church: {
                    type: "string",
                    hierarchy: "Structure"
                },
                Group: {
                    type: "string",
                    parent: "Church",
                    hierarchy: "Structure"
                },
                Attendance: {
                    type: "number",
                    caption: "Attendance"
                },
                FirstTimers: {
                    type: "number",
                    caption: "FT"
                },
                NewConverts: {
                    type: "number",
                    caption: "NC"
                }
            }
        },

        slice: {
            rows: [
                {
                    uniqueName: "Structure",
                    levelName: "Group"
                }
            ],
            columns: [
                {
                    uniqueName: "Date",
                    levelName: "Date.Year"
                },
                {
                    uniqueName: "[Measures]"
                }
            ],
            measures: [
                {
                    uniqueName: "Attendance",
                    aggregation: "sum"
                },
                {
                    uniqueName: "NewConverts",
                    aggregation: "sum"
                },
                {
                    uniqueName: "FirstTimers",
                    aggregation: "sum"
                },
                {
                    uniqueName: "ReceivedHolySpirit",
                    aggregation: "sum"
                }
            ]
        }
    }
];