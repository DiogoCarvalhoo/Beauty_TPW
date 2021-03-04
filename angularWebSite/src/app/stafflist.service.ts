import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Servico} from './Servico';
import {MembroStaff} from './MembroStaff';
import {Trabalho} from './Trabalho';
import {Produto} from './Produto';

const httpOptions = {
  headers: new HttpHeaders( {'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class StafflistService {
  private baseUrl = 'http://localhost:8000/rest/';

  constructor(private http: HttpClient) {}

  getStaffMemberById(id: number) {
    let url = this.baseUrl + 'staffbyid?';
    url += '&id=' + id;
    return this.http.get<MembroStaff>(url);
  }

  getListaStaffByDonoID(id:number) {
    let url = this.baseUrl + 'staffbydono?';
    url += '&id=' + id;
    return this.http.get<MembroStaff[]>(url);
  }

  getListaStaffByInstitutoID(id:number) {
    let url = this.baseUrl + 'staffbyinstituto?';
    url += '&id=' + id;
    return this.http.get<MembroStaff[]>(url);
  }

  getListaTrabalhosByDono(id: number) {
    let url = this.baseUrl + 'trabalhobydono?';
    url += '&id=' + id;
    return this.http.get<Trabalho[]>(url);
  }

  getListaTrabalhos(id_instituto:number, id_membro:number) {
    let url = this.baseUrl + 'trabalho?';
    url += '&instituto=' + id_instituto;
    url += '&staff=' + id_membro;
    return this.http.get<Trabalho[]>(url);
  }

  createMembroStaff(membroStaff: any): Observable<any> {
    let url = this.baseUrl + 'createStaff';
    return this.http.post(url, membroStaff);
  }

  updateStaff(membroStaff: any): Observable<any> {
    let url = this.baseUrl + 'updateStaff';
    return this.http.put(url, membroStaff);
  }

  dropMembroStaff(id: number) {
    let url = this.baseUrl + 'dropStaff/' + id;
    return this.http.delete(url, httpOptions);
  }

}
