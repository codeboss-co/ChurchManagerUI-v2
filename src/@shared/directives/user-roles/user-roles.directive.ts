import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';

@Directive({
    selector: '[userRoles]',
    exportAs: 'userRoles'
})
export class UserRolesDirective implements OnInit
{
    /* eslint-disable */
    @Input('userRoles') allowedRoles: string[] = [];

    /**
     * Constructor
     */
    constructor(
        private _templateRef: TemplateRef<any>,
        private _viewContainer: ViewContainerRef,
        private _auth: AuthService
    )
    {
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._viewContainer.clear();
        console.log('this.allowedRoles', this.allowedRoles);
        if (this._auth.hasRoles(this.allowedRoles)) {
            this._viewContainer.createEmbeddedView(this._templateRef);
        }
    }
}
