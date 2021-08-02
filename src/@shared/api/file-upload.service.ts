import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ENV } from '@shared/constants';
import { Environment } from '@shared/environment.model';

@Injectable({
    providedIn: 'root'
})
export class FileUploadService
{
    private _baseUrl = this._environment.baseUrls.apiUrl;

    constructor(
        private _http: HttpClient,
        @Inject(ENV) private _environment: Environment)
    {
    }

    upload(file: File, url: string): Observable<HttpEvent<any>> {
        const formData: FormData = new FormData();

        formData.append('file', file);

        const req = new HttpRequest('POST', `${this._baseUrl}/v1/${url}`, formData, {
            reportProgress: true,
            responseType: 'json'
        });

        return this._http.request(req);
    }
}
