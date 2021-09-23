import { Sort } from '@shared/data/pagination.models';
import { PaginatedGeneralTableService } from '@ui/components/general-table/paginated-general-table/paginated-general-table.service';
import { PAGING_SERVICE } from '@ui/components/general-table';
import { FollowUpDataService } from '../../_services/follow-up-data.service';
import { FollowUpQuery, FollowUpRecord } from '../../follow-up.models';
import { ActivatedRoute } from '@angular/router';
import { first, map } from 'rxjs/operators';

const pagingServiceFactory = ( data: FollowUpDataService, route: ActivatedRoute ) => {
    console.log('pagingServiceFactory');

    let _personId = null;

    route.parent.params
        .pipe(first())
        .pipe(map(({personId})  => personId))
        .subscribe(
            personId =>_personId = personId
        );

    const initialSort: Sort<FollowUpRecord> = { property: 'assignedDate', order: 'desc' };
    const initialQuery: FollowUpQuery = { assignedToMe: false };

    if (_personId) {
        initialQuery.person = { id: _personId };
    }
    console.log('initialQuery', initialQuery);
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
            deps: [FollowUpDataService, ActivatedRoute]
        }
    ];