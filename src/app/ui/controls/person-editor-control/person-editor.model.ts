import { BirthDateFormValue } from '@features/admin/people/new-family-form/person-form/person-form.model';

export interface PersonFormValue {
    firstName: string;
    middleName?: string;
    lastName: string;
    gender: string;
    ageClassification?: string;
    occupation?: string;
    emailAddress?: string;
    phoneNumber?: string;
    birthDate?: BirthDateFormValue;
    receivedHolySpirit?: boolean;
}
