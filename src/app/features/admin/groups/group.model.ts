import { Person } from '../people';
import { Moment } from 'moment';
import { Identifiable } from '@shared/shared.models';

export interface Group {
    groupId: number;
    name: string;
    description: string;
    parentGroupId?: number;
    groupType: GroupType;
    members: GroupMember[];
    recordStatus: string;
}

export interface GroupType {
    id?: number;
    name: string;
    description: string;
    groupTerm?: string;
    groupMemberTerm?: string;
    takesAttendance: boolean;
    isSystem: boolean;
    iconCssClass?: string;
}

export interface GroupMemberRole {
    id: number;
    name: string;
    description: string;
    isLeader: boolean;
}

export interface GroupMember {
    id: number;
    groupId: number;
    personId: number;
    groupMemberRoleId: number;
    archiveStatus?: string;
    communicationPreference: string;
    group?: Group;
    groupMemberRole: GroupMemberRole;
    person: Person;
    recordStatus: string;
    inactiveDateTime?: any;
    firstVisitDate? : Date;
}



export interface GroupSummary
{
    groupId: number;
    name: string;
    description: string;
    parentGroupId?: number;
    groupType: string;
    recordStatus: string;
    membersCount: number;
}

export interface GroupMemberSimple
{
    groupId: number;
    groupMemberId: number;
    personId: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: string;
    photoUrl: string;
    groupMemberRole?: string;
    groupMemberRoleId?: number;
    isLeader?: boolean;
    firstVisitDate?: Date;
    recordStatus: string;
}

export type GroupMembersSimple = GroupMemberSimple[];

export interface GroupWithChildren
{
    id?: number;
    churchId?: number;
    parentGroupId?: number;
    parentGroupName?: string;
    groupType?: GroupType;
    name: string;
    description?: string;
    address?: any;
    startDate?: Date;
    isOnline?: boolean;
    createdDate?: Date;
    groups?: GroupWithChildren[];
    level?: number;
    schedule?: ScheduleViewModel;
}

export interface GroupTypeRole
{
    id?: number;
    name: string;
    description: string;
    isLeader: boolean;
    canView?: boolean;
    canEdit?: boolean;
    canManageMembers?: boolean;
    groupTypeId?: number;
}

export interface GroupMemberForm
{
    person: Identifiable;
    groupRole: number;
    communicationPreference?: string;
    firstVisitDate?: Moment;
    recordStatus?: string;

    groupMemberId?: number; // Used for editing
    groupId?: number;
}

export interface ScheduleViewModel
{
    scheduleText?: string;
    iCalendarContent?: string;
    startDate?: Date;
    endDate?: Date;
    meetingTime?: string;
    recurrenceRule?: string;
}