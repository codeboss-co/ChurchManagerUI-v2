export interface FamiliesQuery
{
    name?: string;
    address?: string;
}

export interface Family
{
    id?: number;
    name: string;
    street?: string;
    city?: string;
    country?: string;
    province?: string;
    postalCode?: string;
}


