import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app/app.routes';

const appConfig = {
  providers: [
    provideHttpClient(withFetch()), // Habilita fetch para HttpClient
    provideRouter(routes), // Configura tus rutas si es necesario
    BrowserModule,
    BrowserAnimationsModule, // Agregar a los proveedores
    provideAnimationsAsync()
  ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
