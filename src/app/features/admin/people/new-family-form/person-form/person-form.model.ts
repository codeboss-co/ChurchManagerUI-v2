import { Identifiable } from '@shared/shared.models';

export interface FamilyMember {
    churchId: number;
    familyId?: number;
    connectionStatus: string;
    source: string;
    firstVisitDate?: Date;
    person: PersonBasicDetailsForm;
    assignedFollowUpPerson?: Identifiable | null;
}

export interface PersonBasicDetailsForm {
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    ageClassification: string;
    occupation?: any;
    emailAddress?: string;
    phoneNumber: string;
    birthDate: BirthDateFormValue;
    receivedHolySpirit: boolean;
}

export interface BirthDateFormValue {
    day: number;
    month: number;
    year: number;
}

interface Address {
    street: string;
    city: string;
    country: string;
    province: string;
    postalCode: string;
}

export interface NewFamilyForm {
    familyName: string;
    members: FamilyMember[];
    address: Address;
}