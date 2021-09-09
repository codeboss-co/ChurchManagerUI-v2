import { PersonAutocomplete } from '@ui/layout/common/search/search-bar.models';
import { Identifiable } from '@shared/shared.models';

export interface FollowUpQuery
{
    types?: string[];
    assignedPerson?: Identifiable;
    person?: Identifiable;
    assignedToMe?: boolean;
    severity?: string[];
    withAction?: boolean;
    from?: Date;
    to?: Date;
}

export interface FollowUpRecord
{
    id: number;
    assignedDate: Date | string;
    actionDate?: Date | string;
    type?: string;
    severity?: string;
    assignedPerson?: PersonAutocomplete;
    person?: PersonAutocomplete;
    note?: string;
    requiresAdditionalFollowUp?: boolean;
}