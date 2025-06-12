import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { App } from './app/app';
import { provideRouter, withRouterConfig } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(withFetch()),
    provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' }))
  ]
}).catch((err) => console.error(err));
