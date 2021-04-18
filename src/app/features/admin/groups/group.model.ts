import { Person } from '../people';

export interface Group {
    groupId: number;
    name: string;
    description: string;
    parentGroupId?: any;
    groupType: GroupType;
    members: GroupMember[];
    recordStatus: string;
}

export interface GroupType {
    id: number;
    name: string;
    description: string;
    groupTerm: string;
    groupMemberTerm: string;
    takesAttendance: boolean;
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
    archiveStatus?: any;
    communicationPreference: string;
    group?: Group;
    groupMemberRole: GroupMemberRole;
    person: Person;
    recordStatus: string;
    inactiveDateTime?: any;
}

export interface GroupSummary {
    groupId: number;
    name: string;
    description: string;
    parentGroupId?: any;
    groupType: string;
    recordStatus: string;
    membersCount: number;
}

export interface GroupMemberSimple{
    groupMemberId: number;
    personId: number;
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: string;
    photoUrl: string;
}
