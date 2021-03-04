import { Injectable } from '@angular/core';
import {Instituto} from './Instituto';
import {Observable} from 'rxjs/internal/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders( {'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class InstitutoslistService {
  private baseUrl = 'http://localhost:8000/rest/';
  constructor(private http: HttpClient) { }

  getListaInstitutos(nomePesquisado: string, localizacaoPesquisada: string): Observable<Instituto[]> {
    let url = this.baseUrl + 'listaInstitutos?';
    if (nomePesquisado === undefined ) {
      nomePesquisado = '';
    }
    url += '&nome=' + nomePesquisado;
    if (localizacaoPesquisada === undefined) {
      localizacaoPesquisada = '';
    }
    url += '&localizacao=' + localizacaoPesquisada;

    return this.http.get<Instituto[]>(url);
  }

  getInstitutoById(id: number) {
    let url = this.baseUrl + 'instituto?';
    url += '&id=' + id;
    return this.http.get<Instituto>(url)
  }

  createInstituto(instituto: any): Observable<any> {
    let url = this.baseUrl + 'createInstituto';
    return this.http.post(url, instituto);
  }

  updateInstituto(instituto: any): Observable<any> {
    let url = this.baseUrl + 'updateInstituto';
    return this.http.put(url, instituto);
  }

  dropInstituto(id: number) {
    let url = this.baseUrl + 'dropInstituto/' + id;
    return this.http.delete(url, httpOptions);
  }

}
