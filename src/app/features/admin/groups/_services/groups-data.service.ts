/**
 * @summary
 *
 * The real groups service as the other was a copy of contacts and needs refactoring
 */
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { GroupMemberForm, GroupMemberSimple, GroupType, GroupTypeRole, GroupWithChildren } from '../group.model';
import { Observable } from 'rxjs';
import { ApiResponse, FormAction, FormActions } from '@shared/shared.models';
import { map } from 'rxjs/operators';
import { HttpBaseService } from '@shared/api/http-base.service';
import { GroupAttendanceForm } from '@features/admin/groups';
import { NewGroupForm } from '@features/admin/groups/manage/components/new/new-group.model';

@Injectable()
export class GroupsDataService extends HttpBaseService
{
    private _apiUrl = this._environment.baseUrls.apiUrl;

    constructor(
        private http: HttpClient,
        @Inject(ENV) private _environment: Environment )
    {
        super(http);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get group members and their simple information
     */
    getGroupMembers$(groupId: number): Observable<GroupMemberSimple[]>
    {
        return super.get<ApiResponse>(`${this._apiUrl}/v1/groups/${groupId}/members`, null)
            .pipe(
                map(response => response.data)
            );
    }

    /**
     * Get group member
     */
    getGroupMember$(groupMemberId: number): Observable<GroupMemberForm>
    {
        return super.get<ApiResponse>(`${this._apiUrl}/v1/groups/members/${groupMemberId}`, null)
            .pipe(
                map(response => response.data)
            );
    }

    /**
     * Get group roles for group
     */
    getGroupRoles$(groupTypeId: number): Observable<GroupTypeRole[]>
    {
        return super.get<ApiResponse>(`${this._apiUrl}/v1/groups/${groupTypeId}/grouproles`, null)
            .pipe(
                map(response => response.data)
            );
    }

    /**
     * Add new group member
     */
    addOrUpdateGroupMember$(model: GroupMemberForm, action: FormAction = FormActions.New): Observable<any>
    {
        const personId = model.person.id;
        const groupId = model.groupId;
        const groupRoleId = model.groupRole;
        const communicationPreference = model.communicationPreference;
        const firstVisitDate = model.firstVisitDate;

        const body = {
            personId, groupId, groupRoleId, communicationPreference, firstVisitDate
        };

        let url;
        if (action === FormActions.New) {
            url = `${this._apiUrl}/v1/groups/${model.groupId}/add-member`;
        } else {
           url = `${this._apiUrl}/v1/groups/${model.groupId}/update-member`;
        }

        return super.post<ApiResponse>(url, body)
            .pipe(
                map(response => response.data)
            );
    }

    registerAttendance$( model: GroupAttendanceForm ): Observable<any>
    {
        return super.post<any>(`${this._apiUrl}/v1/groups/${model.groupId}/attendance`, model);
    }

    getGroupType$(groupTypeId: number) : Observable<GroupType>
    {
        return super.get<ApiResponse>(`${this._apiUrl}/v1/groups/types/${groupTypeId}`, null)
            .pipe(
                map(response => response.data)
            );
    }

    /**
     * @returns the newly created group id
     */
    addGroup$(model: NewGroupForm): Observable<number>
    {
        return super.post<ApiResponse>(`${this._apiUrl}/v1/groups`, model)
            .pipe(
                map(response => response.data),
            );;
    }

    /**
     * Get groups with their children in the form of a tree
     */
    getGroupsTree$(): Observable<GroupWithChildren[]>
    {
        return super.get<ApiResponse>(`${this._apiUrl}/v1/groups/tree`, null)
            .pipe(
                map(response => response.data),
            );
    }

    /**
     * Get group by id with their children in the form of a tree
     */
    getGroupTree$(groupId: number): Observable<GroupWithChildren[]>
    {
        return super.get<ApiResponse>(`${this._apiUrl}/v1/groups/${groupId}/tree`, null)
            .pipe(
                map(response => response.data),
            );
    }
}