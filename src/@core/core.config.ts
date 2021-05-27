import { NgxUiLoaderConfig } from 'ngx-ui-loader';
import { NgxUiLoaderRouterConfig } from 'ngx-ui-loader/lib/utils/interfaces';

export function tokenGetter() {
    return localStorage.getItem("accessToken");
}

export const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    hasProgressBar: false,
    fgsType: 'cube-grid',
};

export const routerLoaderConfig: NgxUiLoaderRouterConfig = {
    exclude: ['/apps/people', '/pages/profile']
}
