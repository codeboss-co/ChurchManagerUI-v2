import { BaptismStatus, BirthDate, Church, Email, FullName, PhoneNumber } from '@features/admin/people';
import { publicDecrypt } from 'crypto';

export interface FamilyMember {
    personId?: number;
    fullName: FullName;
    gender: string;
    ageClassification: string;
    photoUrl: string;
    birthDate: BirthDate;
}

export interface Profile {
    personId?: number;
    familyId?: number;
    church?: Church;
    connectionStatus?: string;
    ageClassification?: string;
    gender?: string;
    firstVisitDate?: Date;
    fullName?: FullName;
    birthDate?: BirthDate;
    baptismStatus?: BaptismStatus;
    foundationSchool?: DiscipleshipStep;
    maritalStatus?: string;
    anniversaryDate?: any;
    email?: Email;
    phoneNumbers?: PhoneNumber[];
    communicationPreference?: string;
    photoUrl?: string;
    occupation?: string;
    source?: string;
    receivedHolySpirit?: boolean;
    familyMembers?: FamilyMember[];
    groups?: any[];
}

class FamilyMemberModel implements  FamilyMember {
    ageClassification: string;
    birthDate: BirthDate;
    fullName: FullName;
    gender: string;
    photoUrl: string;

    constructor(model?: Partial<FamilyMember>) {
        Object.assign(this, model);
        this.photoUrl = model.photoUrl || 'assets/images/avatars/profile-blank.jpg';
    }
}

export class ProfileModel implements Profile {
    personId: number;
    familyId: number;
    church?: Church;
    connectionStatus: string;
    ageClassification: string;
    gender?: string;
    firstVisitDate?: Date;
    fullName: FullName;
    birthDate?: BirthDate;
    baptismStatus?: BaptismStatus;
    foundationSchool?: DiscipleshipStep;
    maritalStatus?: any;
    anniversaryDate?: any;
    email?: Email;
    phoneNumbers?: PhoneNumber[];
    communicationPreference?: string;
    photoUrl?: string;
    occupation?: string;
    source?: string;
    receivedHolySpirit?: boolean;
    familyMembers: FamilyMember[];
    groups?: any[];

    constructor(model?: Partial<Profile>) {
        Object.assign(this, model);
        this.photoUrl = model.photoUrl || 'assets/images/avatars/profile-blank.jpg';
        this.familyMembers = model.familyMembers.map(x => new FamilyMemberModel(x));
    }

}

export interface DiscipleshipStep
{
    id?: number;
    name?: string;
    isComplete?: boolean;
    completionDate?: Date;
    status?: string;
}

/**
 * Update profile models
 */
export interface ProfileConnectionInfo
{
    churchId: number;
    connectionStatus: string;
    firstVisitDate: Date | null;
    source: string;
}

export interface ProfilePersonalInfo
{
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: string;
    ageClassification: string;
}

export interface ProfileGeneralInfo
{
    occupation?: string;
    phoneNumber: string;
    email?: string;
    maritalStatus?: string;
    birthDate?: BirthDateType;
}

export type BirthDateType = { day?: number; month?: number; year?: number };

export class BirthDateModel implements BirthDateType
{
    day?: number;
    month?: number;
    year?: number;

    constructor(model: Partial<BirthDateType>)
    {
        this.day = model?.day || null;
        this.month = model?.month || null;
        this.year = model?.year || null;
    }
}

export interface ProfileDiscipleshipInfo
{
    receivedHolySpirit?: boolean;
    isBaptised?: boolean;
    baptismDate?: Date | null;
    isCompleteFoundationSchool?: boolean;
    foundationSchoolDate?: Date | null;
}




