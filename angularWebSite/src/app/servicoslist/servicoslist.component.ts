import { Component, OnInit } from '@angular/core';
import {Servico} from '../Servico';
import {ServicoslistService} from '../servicoslist.service';
import {CategoriaServico} from '../CategoriaServico';
import {Instituto} from '../Instituto';
import {InstitutoslistService} from '../institutoslist.service';
import {CategoriasService} from '../categorias.service';
import {Router} from '@angular/router';
import {AutenticacaoService} from '../autenticacao.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-servicoslist',
  templateUrl: './servicoslist.component.html',
  styleUrls: ['./servicoslist.component.css']
})
export class ServicoslistComponent implements OnInit {
  error: boolean;
  page_obj: boolean; //ALTERAR ISTO
  userId: number;
  userName: string;
  userLogado: boolean;
  servicosList: Servico[];
  institutos: Instituto[];
  categorias: CategoriaServico[];
  next: string;
  previous: string;

  formGroup: FormGroup;
  formReady: boolean;


  constructor(private autenticacaoService: AutenticacaoService, private servicoslistService: ServicoslistService, private institutolistService: InstitutoslistService, private categoriasService: CategoriasService, private router: Router) {
    this.error = false;
    this.page_obj = true;
    this.formReady = false;
  }

  ngOnInit(): void {
    if (localStorage.getItem('currentUserUsername') != null) {
      this.userLogado = true;
    } else {
      this.userLogado = false;
    }
    if (this.userLogado) {
      this.userName = localStorage.getItem('currentUserUsername');
      this.autenticacaoService.getUser(this.userName).subscribe(result => {this.userId = result.id;
      },
        error => {
          if (error.status === 401) {
            this.autenticacaoService.renovateSession().subscribe(
              token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
              erro => this.router.navigateByUrl('/login'));
          }
        });
    }
    this.initForm();
    this.institutolistService.getListaInstitutos('','' ).subscribe(lista => { this.institutos = lista;
      this.categoriasService.getListaCategoriasServicos().subscribe(lista1 => {this.categorias = lista1; this.getServicos('http://localhost:8000/rest/listaServicos?page_size=8&page=1&nome=&maxprice=&minprice=&categoria=-1&instituto=-1');
      },
        error => {
          if (error.status === 401) {
            this.autenticacaoService.renovateSession().subscribe(
              token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
              erro => this.router.navigateByUrl('/login'));
          }
        });
    },
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
  }


  getServicos(url) {

    this.servicoslistService.getListaServicos(url).subscribe(response2 => {
        this.servicosList = response2.results;
        // set the components next property here from the response
          this.next = response2.links.next;

          // set the components next property here from the response
        this.previous = response2.links.previous;

      },
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
  }


  initForm() {
    this.formGroup = new FormGroup({
      nome: new FormControl(''),
      precomin: new FormControl(''),
      precomax: new FormControl(''),
      instituto: new FormControl(''),
      categoria: new FormControl(''),
    });
    this.formReady = true;
  }

  pesquisa(): void {
    let instituto: any = this.formGroup.controls.instituto.value;
    let categoria: any = this.formGroup.controls.categoria.value;
    if (instituto === '') {
      instituto = -1;
    }
    let url = 'http://localhost:8000/rest/listaServicos?';

    url += '&instituto=' + instituto;

    if (categoria === '') {
      categoria = -1;
    }
    url += '&categoria=' + categoria;


    if (this.formGroup.controls.nome.value === undefined || this.formGroup.controls.nome.value === null) {
      url += '&nome=';
    } else {
      url += '&nome=' + this.formGroup.controls.nome.value;
    }


    if (this.formGroup.controls.precomin.value === undefined || this.formGroup.controls.precomin.value === null) {
      url += '&minprice=';
    } else {
      url += '&minprice=' + this.formGroup.controls.precomin.value;
    }

    if (this.formGroup.controls.precomax.value === undefined || this.formGroup.controls.precomax.value === null) {
      url += '&maxprice=';
    } else {
      url += '&maxprice=' + this.formGroup.controls.precomax.value;
    }

    url += '&page=1&page_size=8';
    this.getServicos(url);
  }

  fetchNext() {
    this.getServicos(this.next);
  }

  // function fetches the previous paginated items by using the url in the previous property
  fetchPrevious() {
    this.getServicos(this.previous);
  }

  goToServico( servico: Servico) {
    this.router.navigate(['/servico', servico.id]);
  }

  logout() {
    this.autenticacaoService.logout();
    this.userLogado = false;
    this.userName = null;
    this.userId = -1;
    this.router.navigate(['/home']);
  }

}
