export interface FullName {
    title?: any;
    firstName?: string;
    nickName?: string;
    middleName?: string;
    lastName: string;
    suffix?: string;
}

export interface BirthDate {
    birthDay: number;
    birthMonth: number;
    birthYear: number;
}

export interface BaptismStatus {
    isBaptised: boolean;
    baptismDate?: any;
}

export interface Email {
    address: string;
    isActive: boolean;
}

export interface Person {
    personId?: number;
    churchId: number;
    connectionStatus: string;
    deceasedStatus?: any;
    ageClassification: string;
    gender: string;
    firstVisitDate?: Date;
    fullName: FullName;
    birthDate?: BirthDate;
    baptismStatus?: BaptismStatus;
    maritalStatus?: any;
    anniversaryDate?: any;
    email?: Email;
    phoneNumbers?: any[];
    communicationPreference?: any;
    photoUrl?: string;
    occupation?: string;
    familyId?: number;
    receivedHolySpirit?: boolean;
    givingGroupId?: number;
    userLoginId?: string;
    viewedCount?: number;
    family?: any;
    church?: any;
    recordStatus?: string;
    inactiveDateTime?: any;
}

export class PersonModel implements Person {
    ageClassification: string;
    churchId: number;
    connectionStatus: string;
    fullName: FullName;
    gender: string;

    /**
     * Constructor
     *
     * @param person
     */
    constructor(person)
    {
        {
            this.ageClassification = person.ageClassification || 'Unknown';
            this.fullName = person.fullName || null;
            this.connectionStatus = person.connectionStatus || '';
            this.gender = person.gender || '';
            this.churchId = person.churchId || '';
        }
    }
}

export interface PeopleSearchQuery
{
    searchTerm?: string;
}


