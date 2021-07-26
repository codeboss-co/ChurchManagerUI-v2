import { CellMinistryDataService } from '@features/admin/groups/cell-ministry/_services/cell-ministry-data.service';
import { Sort } from '@shared/data/pagination.models';
import { GroupAttendanceQuery, GroupAttendanceRecord } from '@features/admin/groups/cell-ministry/cell-ministry.model';
import { PaginatedGeneralTableService } from '@ui/components/general-table/paginated-general-table/paginated-general-table.service';
import { PAGING_SERVICE } from '@ui/components/general-table';

const pagingServiceFactory = ( data: CellMinistryDataService ) => {
    const initialSort: Sort<GroupAttendanceRecord> = { property: 'attendanceDate', order: 'desc' };
    const initialQuery: GroupAttendanceQuery = { churchId: 1 };

    return new PaginatedGeneralTableService<GroupAttendanceRecord, GroupAttendanceQuery>(
        ( request, query ) => data.pageCellAttendanceReports$( request, query ),
        initialSort,
        initialQuery
    );
};

export const pagingServiceProvider =
    [
        CellMinistryDataService,
        {
            provide: PAGING_SERVICE,
            useFactory: pagingServiceFactory,
            deps: [CellMinistryDataService]
        }
    ];