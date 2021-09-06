import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

export abstract class QueryBase<TQuery>
{
    searchForm: FormGroup;
    searchBtnClicked = new Subject();

    query$: Observable<TQuery>;
}
