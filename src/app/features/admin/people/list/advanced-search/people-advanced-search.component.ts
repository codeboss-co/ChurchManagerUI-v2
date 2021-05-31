import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'people-advanced-search',
    templateUrl: './people-advanced-search.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleAdvancedSearchComponent implements OnInit {

    constructor()
    {
    }

    ngOnInit(): void
    {
    }

}
