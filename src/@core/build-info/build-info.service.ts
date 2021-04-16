import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { pluck, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ENV } from '@shared/constants';

// https://codinglatte.com/posts/angular/app_initializer-in-angular/
@Injectable({providedIn: 'root'})
export class BuildInfoService {

    constructor(
        private http: HttpClient,
        @Inject(ENV) private environment) {}

    /*
    * Version info stream
    * */
    public version$ = this.buildInfo$().pipe( pluck( 'version' ) );

    /*
    * Reads version info from build file
    * This file is created by the build process
    *  */
    public buildInfo$(): Observable<BuildInfo> {
        return this.http.get<BuildInfo>('assets/buildinfo.json').pipe(shareReplay(1));
    }
}

export interface BuildInfo {
    version: string;
    build?: string;
}
