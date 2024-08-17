import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';

const appConfig = {
  providers: [
    provideHttpClient(withFetch()), // Habilita fetch para HttpClient
    provideRouter([]) // Configura tus rutas si es necesario
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
