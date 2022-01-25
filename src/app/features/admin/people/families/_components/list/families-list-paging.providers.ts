import { Sort } from '@shared/data/pagination.models';
import { PaginatedGeneralTableService } from '@ui/components/general-table/paginated-general-table/paginated-general-table.service';
import { PAGING_SERVICE } from '@ui/components/general-table';
import { ActivatedRoute } from '@angular/router';
import { FamiliesDataService, FamiliesQuery, Family } from '@features/admin/people/families';

const pagingServiceFactory = ( data: FamiliesDataService, route: ActivatedRoute ) => {
    const initialSort: Sort<Family> = { property: 'name', order: 'desc' };
    const initialQuery: FamiliesQuery = {};

    /**
    * @notes Logic to load a families based on URL search would go here:
    * @see missions
    * */

    return new PaginatedGeneralTableService<Family, FamiliesQuery>(
        ( request, query ) => data.pageRecords$( request, query ),
        initialSort,
        initialQuery
    );
};

export const pagingServiceProvider =
    [
        FamiliesDataService,
        {
            provide: PAGING_SERVICE,
            useFactory: pagingServiceFactory,
            deps: [FamiliesDataService, ActivatedRoute]
        }
    ];
