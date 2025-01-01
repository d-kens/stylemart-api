import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { RegReqObject } from '../models/auth.model';
import { AuthReqObject } from '../models/auth.model';
import { User } from '../models/user.model';

const baseUrl = environment.auth.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkInitialAuthentication());
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  private checkInitialAuthentication(): boolean {
    return !!localStorage.getItem('authToken');
  }

 
  registerUser(userData: RegReqObject): Observable<User> {
    return this.http.post<User>(`${baseUrl}/register`, userData)
  }

  login(userData: AuthReqObject): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(`${baseUrl}/login`, userData)
  }

  refreshToken(): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      `${baseUrl}/refresh-token`,
      {},
      { withCredentials: true }
    ).pipe(
      catchError((error) => {
        console.log("REFRESH ERROR OCCURED, USER LOGGED OUT")
        this.logout().subscribe();
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<string> {
    return this.http.post<string>(
      `${baseUrl}/logout`, 
      {}, 
      { withCredentials: true }
    ).pipe(
      tap(() => {
        localStorage.removeItem('authToken'); 
        this.updateAuthenticationStatus(false);
      })
    );
  }
  

  
  storeAccessToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  

  getAuthenticatedUser(): Observable<User> {
    return this.http.get<User>(`${baseUrl}/user`)
  }

  updateAuthenticationStatus(isAuthenticated: boolean) {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  

}
