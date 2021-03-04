import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs/internal/Observable';
import {map} from 'rxjs/operators';
import {User} from './User';

const httpOptions = {
  headers: new HttpHeaders( {
    'Content-Type': 'application/json',
    'Authorization':`Bearer ${localStorage.jwt}`,
  })
};

const httpOptions2 = {
  headers: new HttpHeaders( {
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  private baseUrl = 'http://localhost:8000/rest/';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    let url = this.baseUrl + 'token';
    return this.http.post(url, {username, password}, httpOptions2).pipe(
      map(user => {
        if (user) {
          //@ts-ignore
          localStorage.setItem('currentUserTokenAccess', user.access);
          //@ts-ignore
          localStorage.setItem('currentUserTokenRefresh', user.refresh);
          localStorage.setItem('currentUserUsername', username);
        }
        return user;
      })
    );
  }

  registo(user: User): Observable<any> {
    let url = this.baseUrl + 'register';
    return this.http.post(url, user, httpOptions2);
  }

  logout():void {
    localStorage.removeItem('currentUserTokenAccess');
    localStorage.removeItem('currentUserTokenRefresh');
    localStorage.removeItem('currentUserUsername');
    localStorage.removeItem('currentUserId');
  }

  getUser(username: string): Observable<User> {
    let url = this.baseUrl + 'user?username=' + username ;
    return this.http.get<User>(url);
  }

  renovateSession(): Observable<any> {
    console.log('renovar');
    let url = this.baseUrl + 'tokenrefresh';
    let refreshToken = localStorage.getItem('currentUserTokenRefresh');
    return this.http.post(url, {refresh: refreshToken});
  }
}
