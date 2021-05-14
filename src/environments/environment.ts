// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Environment } from '@shared/environment.model';

export const environment: Environment  = {
    production: false,
    baseUrls: {
        signalRHub: 'http://localhost:5001/signalr-hub',
        apiUrl: 'http://localhost:5001/api'
    },
    amplify: {
        Auth: {
            region: 'us-east-1',
            userPoolId: 'us-east-1_i6pWJxu8q',
            userPoolWebClientId: '3a8h0si9ejnbi2mnnhfti5m66r'
        }
    },
    contentful: {
        spaceId: 'od8d9ub5fano',
        token: 'l7jzfAF0vA1o7DX0Bj0ecJr8yxrpIoGFmFinLYmy1wg'
    },
    push: {
        publicKey: 'BGPiiyCFTaVDuHs8IL7DTzXLccf41JCevm1ke2Z4OYA_W3K5Vadsnq8I8si_4_h_wMhM7iSoMjta-TPc1bylR6s'
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
