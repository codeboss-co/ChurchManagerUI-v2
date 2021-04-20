import { Identifiable } from '@shared/shared.models';

export interface PersonAutocomplete extends Identifiable
{
    photoUrl?: string;
    connectionStatus?: string;
}

export declare type PersonAutocompletes = PersonAutocomplete[];