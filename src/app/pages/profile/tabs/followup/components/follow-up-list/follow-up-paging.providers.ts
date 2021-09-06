import { Sort } from '@shared/data/pagination.models';
import { PaginatedGeneralTableService } from '@ui/components/general-table/paginated-general-table/paginated-general-table.service';
import { PAGING_SERVICE } from '@ui/components/general-table';
import { FollowUpDataService } from '../../_services/follow-up-data.service';
import { FollowUpQuery, FollowUpRecord } from '../../follow-up.models';

const pagingServiceFactory = ( data: FollowUpDataService ) => {
    const initialSort: Sort<FollowUpRecord> = { property: 'assignedDate', order: 'desc' };
    const initialQuery: FollowUpQuery = { assignedToMe: true };

    return new PaginatedGeneralTableService<FollowUpRecord, FollowUpQuery>(
        ( request, query ) => data.pageRecords$( request, query ),
        initialSort,
        initialQuery
    );
};

export const pagingServiceProvider =
    [
        FollowUpDataService,
        {
            provide: PAGING_SERVICE,
            useFactory: pagingServiceFactory,
            deps: [FollowUpDataService]
        }
    ];