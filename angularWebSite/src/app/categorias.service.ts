import { Injectable } from '@angular/core';
import {CategoriaProduto} from './CategoriaProduto';
import {CategoriaServico} from './CategoriaServico';
import {Observable} from 'rxjs/internal/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Produto} from './Produto';
import {Servico} from './Servico';

const httpOptions = {
  headers: new HttpHeaders( {'Content-Type': 'application/json'})
};
@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  private baseUrl = 'http://localhost:8000/rest/';
  constructor(private http: HttpClient) { }

  getCategoriaProdutoById(id: number){
    let url = this.baseUrl + 'categoriaproduto?';
    url += '&id=' + id;
    return this.http.get<CategoriaProduto>(url)
  }

  getCategoriaServicoById(id: number){
    let url = this.baseUrl + 'categoriaservico?';
    url += '&id=' + id;
    return this.http.get<CategoriaServico>(url)
  }

  getListaCategoriasProdutos(): Observable<CategoriaProduto[]> {
    let url = this.baseUrl + 'listacategoriasProdutos';
    return this.http.get<Produto[]>(url);
  }

  getListaCategoriasServicos(): Observable<CategoriaServico[]> {
    let url = this.baseUrl + 'listacategoriasServicos';
    return this.http.get<Servico[]>(url)
  }

  createCategoriaServico(categoria: any): Observable<any> {
    let url = this.baseUrl + 'createCategoriaServico';
    return this.http.post(url, categoria);
  }

  createCategoriaProduto(categoria: any): Observable<any> {
    let url = this.baseUrl + 'createCategoriaProduto';
    return this.http.post(url, categoria);
  }

  dropCategoriaServico(categoria: CategoriaServico): Observable<any> {
    let url = this.baseUrl + 'dropCategoriaServico/' + categoria.id;
    return this.http.delete(url, httpOptions);
  }

  dropCategoriaProduto(categoria: CategoriaProduto): Observable<any> {
    let url = this.baseUrl + 'dropCategoriaProduto/' + categoria.id;
    return this.http.delete(url, httpOptions);
  }
}
