import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { PersonBasicDetailsForm } from '../person-form/person-form.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector     : 'people-family-members-list',
    templateUrl  : './family-members-list.component.html',
    styleUrls    : ['./family-members-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FamilyMembersListComponent implements OnChanges
{
    @Input() familyMembers: PersonBasicDetailsForm[] = [];

    displayedColumns: string[] = ['firstName', 'lastName', 'gender', 'ageClassification'];
    dataSource: MatTableDataSource<PersonBasicDetailsForm> = new MatTableDataSource([]);

    ngOnChanges( changes: SimpleChanges ): void
    {
        if ( changes['familyMembers'] ) {
            this.dataSource.data = changes['familyMembers'].currentValue;
            console.log( 'this.dataSource.data', this.dataSource.data, '' );
        }
    }
}