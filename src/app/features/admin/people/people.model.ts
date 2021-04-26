export interface FullName {
    title?: any;
    firstName: string;
    nickName?: string;
    middleName?: string;
    lastName: string;
    suffix?: string;
}

export interface BirthDate {
    birthDay?: number;
    birthMonth?: number;
    birthYear?: number;
    age?: number;
}

export interface BaptismStatus {
    baptismDate?: Date;
    isBaptised?: boolean;
}

export interface Email {
    address?: string;
    isActive?: boolean;
}

export interface PhoneNumber {
    id?: number;
    countryCode?: string;
    description?: string;
    number: string;
    isMessagingEnabled?: boolean;
}

export interface Church
{
    id: number;
    name: string;
    description?: string;
    shortCode?: string;
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
    maritalStatus?: string;
    anniversaryDate?: Date;
    email?: Email;
    phoneNumbers?: PhoneNumber[];
    communicationPreference?: any;
    photoUrl?: string;
    occupation?: string;
    familyId?: number;
    receivedHolySpirit?: boolean;
    givingGroupId?: number;
    userLoginId?: string;
    viewedCount?: number;
    family?: any;
    church?: Church;
    recordStatus?: string;
    inactiveDateTime?: any;
}

export type  People = Person[];

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


// Paginated Query / Result
export interface PeopleSearchQuery
{
    searchTerm?: string;
}



