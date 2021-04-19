import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged, first, map } from 'rxjs/operators';
import { Moment } from 'moment';

import { GroupAttendanceForm } from './group-attendance.model';
import { Observable } from 'rxjs/internal/Observable';
import { FuseAnimations } from '@fuse/animations';
import { Group, GroupMemberSimple, GroupsDataService } from '@features/admin/groups';

@Component({
    selector     : 'profile-groups-attendance-form-dialog',
    templateUrl  : './group-attendance-form-dialog.component.html',
    styleUrls    : ['./group-attendance-form-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : FuseAnimations
})
export class GroupAttendanceFormDialogComponent implements OnInit {

    form: FormGroup;
    group: Group;

    didNotOccur$: Observable<boolean>;

    private readonly _phoneNumberPattern = '^((?:\\+27|27)|0)([0-9]{2})(\\d{7})$';

    /**
     * Constructor
     *
     * @param {MatDialogRef<GroupAttendanceFormDialogComponent>} matDialogRef
     * @param _data
     * @param {GroupsDataService} _groupsData
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<GroupAttendanceFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _groupsData: GroupsDataService,
        private _formBuilder: FormBuilder
    )
    {
        this.group = _data.group;
    }

    ngOnInit(): void
    {
        this.form = this.createForm();

        // Fetch group members and update form controls
        this._groupsData.getGroupMembers$(this.group.groupId)
            .pipe(first())
            .subscribe(members => {
                this.updateGroupMembersForm(members);
            });

        this.didNotOccur$ = this.didNotOccurControl
            .valueChanges
            .pipe(
                distinctUntilChanged(),
                map(didNotOccur => didNotOccur)
            );
    }

    /**
     * Create attendance form
     *
     * @returns {FormGroup}
     * https://netbasal.com/angular-reactive-forms-the-ultimate-guide-to-formarray-3adbe6b0b61a
     */
    private createForm(): FormGroup
    {
        return this._formBuilder.group({
            attendanceDate: [null, Validators.required],
            didNotOccur: [false],
            members: this._formBuilder.array([]),
            firstTimers: this._formBuilder.array([]),
            note   : [null]
        });
    }

    /*
    *  Updates the members form array with the actual member data populated
    *
    *  https://stackoverflow.com/questions/46495204/angular-formarray-patchvalue-error-typeerror-value-foreach-is-not-a-function
    */
    private updateGroupMembersForm(members: GroupMemberSimple[]): void
    {
        const membersControl =  this._formBuilder.array([]);

        members.forEach(member => {
            membersControl.push(this.newGroupMemberControl(member));
        });

        this.form.setControl('members', membersControl);
    }

    // Creates a new Group Member Form Array item
    private newGroupMemberControl(member: GroupMemberSimple): AbstractControl {
        return this._formBuilder.group({
            groupMemberId: [member.groupMemberId],
            groupMemberName: [`${member.firstName } ${member.lastName }`],
            groupMemberDidAttend   : [false],
            receivedHolySpirit   : [false],
            newConvert   : [false],
        });
    }

    // Creates a new First Timer / Visitor Form Array item
    private newFirstTimerControl(): AbstractControl {
        return this._formBuilder.group({
            firstName: [null, Validators.required],
            lastName: [null, Validators.required],
            gender: [null, Validators.required],
            phoneNumber: [null, [Validators.required, Validators.pattern(this._phoneNumberPattern)]],
            receivedHolySpirit   : [false],
            newConvert   : [false]
        });
    }

    // Adds a new First Timer / Visitor Form Array item
    public addFirstTimerControl(): void {
        this.firstTimersFormArray.push(this.newFirstTimerControl());
    }

    removeFirstTimerControl(index: number): void {
        this.firstTimersFormArray.removeAt(index);
    }

    /*
     * Access to the Groups Members Form item
     */
    public get groupMembersFormArray(): FormArray {
        return this.form.get('members') as FormArray;
    }

    public get didNotOccurControl(): FormArray {
        return this.form.get('didNotOccur') as FormArray;
    }

    /*
    * Access to the Groups Members Form item
    */
    public get firstTimersFormArray(): FormArray {
        return this.form.get('firstTimers') as FormArray;
    }

    public save() {
        const attendanceDateMoment = this.form.get('attendanceDate').value as Moment;

        const model: GroupAttendanceForm = {
            groupId: this.group.groupId,
            attendanceDate: attendanceDateMoment.format('YYYY-MM-DD'),
            didNotOccur: this.form.get('didNotOccur').value,
            members: this.form.get('members').dirty ? this.form.get('members').value : [],
            firstTimers: this.form.get('firstTimers').value,
            note:  this.form.get('note').value
        };

        this.matDialogRef.close(model);
    }
}
