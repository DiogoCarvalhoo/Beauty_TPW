import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from './User';
import {Observable} from 'rxjs/internal/Observable';


const httpOptions = {
  headers: new HttpHeaders( {'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8000/rest/';

  constructor(private http: HttpClient) { }

  updateUserEmail(user: User) {
    let url = this.baseUrl + 'updateUserEmail';
    return this.http.put(url, user, httpOptions);
  }

  updateUserPassword(userid: number, passwordatual: string, passwordnova: string): Observable<any> {
    console.log(userid)
    let url = this.baseUrl + 'updateUserPassword';
    return this.http.put(url, {userid, passwordatual, passwordnova}, httpOptions);
  }
}
