import { NgModule, Optional, SkipSelf } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { environment } from '../environments/environment';
import { ENV } from '@shared/constants';
import { httpInterceptorProviders } from '@core/interceptors';
import { notificationToastrProvider } from '@core/notifications';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxUiLoaderModule, NgxUiLoaderRouterModule } from 'ngx-ui-loader';
import { ngxUiLoaderConfig, routerLoaderConfig, tokenGetter } from '@core/core.config';

@NgModule({
    imports  : [
        HttpClientModule,

        // Material Core Modules
        MatSnackBarModule,
        MatMomentDateModule,
        // Auth setup
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                allowedDomains: ['localhost:5001', 'codeboss.tech'],
            }
        }),
        // Loaders
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
        NgxUiLoaderRouterModule.forRoot(routerLoaderConfig)
    ],
    providers: [
        { provide: ENV, useValue: environment },
        httpInterceptorProviders,
        notificationToastrProvider,
        // Change the default behaviour to parse dates as UTC
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
    ],
    exports: [NgxUiLoaderModule, NgxUiLoaderRouterModule]
})
export class CoreModule
{
    /**
     * Constructor
     */
    constructor(
        private _domSanitizer: DomSanitizer,
        private _matIconRegistry: MatIconRegistry,
        @Optional() @SkipSelf() parentModule?: CoreModule
    )
    {
        // Do not allow multiple injections
        if ( parentModule )
        {
            throw new Error('CoreModule has already been loaded. Import this module in the AppModule only.');
        }

        // Register icon sets
        this._matIconRegistry.addSvgIconSet(this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-twotone.svg'));
        this._matIconRegistry.addSvgIconSetInNamespace('mat_outline', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/material-outline.svg'));
        this._matIconRegistry.addSvgIconSetInNamespace('iconsmind', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/iconsmind.svg'));
        this._matIconRegistry.addSvgIconSetInNamespace('feather', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/feather.svg'));
        this._matIconRegistry.addSvgIconSetInNamespace('heroicons_outline', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-outline.svg'));
        this._matIconRegistry.addSvgIconSetInNamespace('heroicons_solid', this._domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/heroicons-solid.svg'));
    }
}
