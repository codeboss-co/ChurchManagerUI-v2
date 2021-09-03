import { Inject, Injectable } from '@angular/core';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';
import { Observable } from 'rxjs/internal/Observable';
import { PersonAutocompletes } from '@ui/layout/common/search/search-bar.models';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { ApiResponse } from '@shared/shared.models';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PersonSearchService
{
    constructor(
        private _httpClient: HttpClient,
        @Inject(ENV) private environment: Environment)
    {
    }

    lookup(value: string): Observable<PersonAutocompletes> {
        return this._searchApi(value.toLowerCase()).pipe(
            // map the data property of the api results
            map(response => response.data.map(person => person)),
            // catch errors
            catchError(_ => {
                return of(null);
            })
        );
    }

    private _searchApi(query: string): Observable<ApiResponse> {
        const url = `${this.environment.baseUrls.apiUrl}/v1/people/autocomplete?searchTerm=${query}`;
        return this._httpClient.get<ApiResponse>(url);
    }
}