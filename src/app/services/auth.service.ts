import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response: any) => {
          if (response.code === 1) {
            // Guardamos el token que viene en la respuesta
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userRoles', response.data.user.roles);
          }
        })
      );
  }
} 