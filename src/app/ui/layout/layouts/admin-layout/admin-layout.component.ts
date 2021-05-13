import { Component, Inject, Renderer2, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseTailwindService } from '@fuse/services/tailwind/tailwind.service';
import { SnackbarNotificationsService } from '@core/notifications/snackbar-notifications.service';
import { LayoutComponent } from '@ui/layout/layout.component';

@Component({
    selector     : 'layout',
    templateUrl  : './admin-layout.component.html',
    styleUrls    : ['./admin-layout.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminLayoutComponent extends LayoutComponent
{
    /**
     * Constructor
     */
    constructor(
        protected _activatedRoute: ActivatedRoute,
        @Inject(DOCUMENT) protected _document: any,
        protected _renderer2: Renderer2,
        protected _router: Router,
        protected _fuseConfigService: FuseConfigService,
        protected _fuseMediaWatcherService: FuseMediaWatcherService,
        protected _fuseTailwindConfigService: FuseTailwindService,
        private _notifications: SnackbarNotificationsService
    )
    {
        super(_activatedRoute, _document, _renderer2, _router,
            _fuseConfigService, _fuseMediaWatcherService,
            _fuseTailwindConfigService);
    }

}
