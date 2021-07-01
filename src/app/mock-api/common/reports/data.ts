/* eslint-disable */
import * as WebDataRocks from 'webdatarocks';

export const reportsData: Map<string, WebDataRocks.Report> = new Map([

        ['group-attendance-report',  {
            dataSource: {
                data: [{
                    Date: {
                        type: "date"
                    },
                    Church: {
                        type: "level",
                        hierarchy: "Structure"
                    },
                    Group: {
                        type: "level",
                        hierarchy: "Structure",
                        level: "Group",
                        parent: "Church",
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
                    },
                    ReceivedHolySpirit: {
                        type: "number",
                        caption: "HS"
                    }
                }],
            },
            slice: {
                rows: [
                    {
                        uniqueName: "Structure"
                    }
                ],
                columns: [
                    {
                        uniqueName: "Date.Year"
                    },
                    {
                        uniqueName: "Date.Month"
                    },
                    {
                        uniqueName: "Measures"
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
        }]

]);