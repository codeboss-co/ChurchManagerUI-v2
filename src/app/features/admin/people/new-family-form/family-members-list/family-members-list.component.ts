import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FamilyMember } from '../person-form/person-form.model';
import { MatTableDataSource } from '@angular/material/table';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

/*
*  https://stackoverflow.com/questions/51150193/angular-material-editable-table-using-formarray
* */
@Component({
    selector     : 'people-family-members-list',
    templateUrl  : './family-members-list.component.html',
    styleUrls    : ['./family-members-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FamilyMembersListComponent implements OnChanges
{
    @Input() familyMembers: FormArray;
    @Input() debug = false;

    displayedColumns: string[] = ['firstName', 'lastName', 'gender', 'ageClassification', 'followUpPerson'];
    dataSource: MatTableDataSource<FamilyMember> = new MatTableDataSource([]);

    tableForm: FormGroup;

    constructor(private _formBuilder: FormBuilder)
    {
        this.tableForm= this._formBuilder.group({
            members: this._formBuilder.array([])
        });
    }

    ngOnChanges( changes: SimpleChanges ): void
    {
        if ( changes['familyMembers'] ) {
            this.dataSource.data = changes['familyMembers'].currentValue as FamilyMember[];
            this._setForm(changes['familyMembers'].currentValue);
        }
    }

   /*
    * Access to the Groups Members Form item
    */
    public get familyMembersFormArray(): FormArray
    {
        return this.tableForm.get('members') as FormArray;
    }

    /*
    * Creates & initializes the form controls
    * */
    private _setForm(members: FamilyMember[]){
        const formArrayControl = this.familyMembersFormArray;

        members.forEach((member) =>{
            formArrayControl.push(this._setFormArray(member));
        });
    };

    /*
    * Initializes the form array items
    * */
    private _setFormArray(member: FamilyMember)
    {
        return this._formBuilder.group({
            churchId:[member.churchId],
            connectionStatus:[member.connectionStatus],
            source:[member.source],
            firstVisitDate:[member.firstVisitDate],
            person:[member.person],
            assignedFollowUpPerson:[member.assignedFollowUpPerson]
        });
    }
}