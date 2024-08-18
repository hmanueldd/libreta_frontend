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


  /** CONTACTOS */
  getContacts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/contacto`);
  }
  
  getContact(contactId: number | null): Observable<any> {
    return this.http.get(`${this.apiUrl}/contacto/${contactId}`);
  }

  saveContact(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/contacto/`, data);
  }
  
  updateContact(contactId: number | null, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/contacto/${contactId}`, data);
  }

  deleteContact(contactId:number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/contacto/${contactId}`);
  }

  /** DIRECCIONES */

  saveAddress(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/direccion`, data);
  }

  updateAddreess(id: number | null, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/direccion/${id}`, data);
  }

  deleteAddress(id:number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/direccion/${id}`);
  }
  
  /**TELEFONOS */
  savePhone(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/telefono/`, data);
  }

  updatePhone(id: number | null, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/telefono/${id}`, data);
  }

  deletePhone(id:number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/telefono/${id}`);
  }

  /**EMAILS */
  saveEmail(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/email/`, data);
  }

  updateEmail(id: number | null, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/email/${id}`, data);
  }
  deleteEmail(id:number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/email/${id}`);
  }

  /**BUSQUEDA */
  searchData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/contacto/search/`, data);
  }

}
