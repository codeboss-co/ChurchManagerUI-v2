import { Sort } from '@shared/data/pagination.models';
import { PaginatedGeneralTableService } from '@ui/components/general-table/paginated-general-table/paginated-general-table.service';
import { PAGING_SERVICE } from '@ui/components/general-table';
import { ActivatedRoute } from '@angular/router';
import { Mission, MissionsDataService, MissionsQuery } from '@features/admin/missions';
import { first, map } from 'rxjs/operators';

const pagingServiceFactory = ( data: MissionsDataService, route: ActivatedRoute ) => {
    const initialSort: Sort<Mission> = { property: 'startDateTime', order: 'desc' };
    const initialQuery: MissionsQuery = {};

    let _groupId = null;

    route.parent.params
        .pipe(first())
        .pipe(map(({groupId})  => groupId))
        .subscribe(
            groupId =>_groupId = groupId
        );

    if (_groupId) {
        initialQuery.groupId = _groupId;
    }
    console.log('initialQuery', initialQuery);
    return new PaginatedGeneralTableService<Mission, MissionsQuery>(
        ( request, query ) => data.pageRecords$( request, query ),
        initialSort,
        initialQuery
    );
};

export const pagingServiceProvider =
    [
        MissionsDataService,
        {
            provide: PAGING_SERVICE,
            useFactory: pagingServiceFactory,
            deps: [MissionsDataService, ActivatedRoute]
        }
    ];
