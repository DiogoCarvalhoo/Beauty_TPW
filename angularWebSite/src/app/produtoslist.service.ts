import { Injectable } from '@angular/core';
import {Produto} from './Produto';
import {Observable} from 'rxjs/internal/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { CategoriaProduto} from './CategoriaProduto';
import {Instituto} from './Instituto';
import {Servico} from './Servico';

const httpOptions = {
  headers: new HttpHeaders( {'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ProdutoslistService {
  private baseUrl = 'http://localhost:8000/rest/';

  constructor(private http: HttpClient) { }

  getListaProdutos(url): Observable<any> {

    return this.http.get<any>(url);
  }

  getProdutoById(id: number) {
    let url = this.baseUrl + 'produto?';
    url += '&id=' + id;
    return this.http.get<Produto>(url)
  }

  getVendedoresDeProduto(id: number) {
    let url = this.baseUrl + 'vendedoresproduto?';
    url += '&id=' + id;
    return this.http.get<Instituto[]>(url)
  }


  createProduto(produto: any): Observable<any> {
    let url = this.baseUrl + 'createProduto';
    return this.http.post(url, produto);
  }

  updateProduto(produto: any): Observable<any> {
    let url = this.baseUrl + 'updateProduto';
    return this.http.put(url, produto);
  }

  dropProduto(id: number) {
    let url = this.baseUrl + 'dropProduto/' + id;
    return this.http.delete(url, httpOptions);
  }
}
