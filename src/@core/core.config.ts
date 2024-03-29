import { NgxUiLoaderConfig } from 'ngx-ui-loader';
import { NgxUiLoaderRouterConfig } from 'ngx-ui-loader/lib/utils/interfaces';

export function tokenGetter() {
    return localStorage.getItem("accessToken");
}

export const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    hasProgressBar: true,
    logoUrl: 'assets/images/logo/logo.svg',
    //fgsType: 'cube-grid'
};

export const routerLoaderConfig: NgxUiLoaderRouterConfig = {
    exclude: [
        '/apps/people',
        '/apps/groups/cell-ministry/attendance-reports',
        '/pages/profile'
    ]
}
