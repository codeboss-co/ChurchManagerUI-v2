export const LOCALE = 'en-ZA';

export const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
};

export const parseLocalDate = ( dateRecord: string | Date): string => {
    const dateString = dateRecord as string;
    const date = new Date(dateString);
    return `${date.toLocaleString(LOCALE, dateOptions)}`;
}