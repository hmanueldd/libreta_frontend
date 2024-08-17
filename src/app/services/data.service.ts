import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = environment.apiUrl; // URL base desde el archivo de entorno
  constructor(private http: HttpClient) { }


  getContactos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/contactos`);
  }

  
}
