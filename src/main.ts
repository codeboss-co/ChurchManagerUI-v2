import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from 'environments/environment';
import { AppModule } from 'app/app.module';
import LogRocket from 'logrocket';

if ( environment.production )
{
    enableProdMode();
    LogRocket.init('r8s22n/church-manager');
}


platformBrowserDynamic().bootstrapModule(AppModule)
                        .catch(err => console.error(err));
