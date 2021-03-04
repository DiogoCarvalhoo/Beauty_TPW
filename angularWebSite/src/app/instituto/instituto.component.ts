import { Component, OnInit } from '@angular/core';
import {Instituto} from '../Instituto';
import {Servico} from '../Servico';
import {Produto} from '../Produto';
import {ServicoslistService} from '../servicoslist.service';
import {ProdutoslistService} from '../produtoslist.service';
import {InstitutoslistService} from '../institutoslist.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoriasService} from '../categorias.service';
import {AutenticacaoService} from '../autenticacao.service';
import {MembroStaff} from '../MembroStaff';
import {StafflistService} from '../stafflist.service';
import {element} from 'protractor';

@Component({
  selector: 'app-instituto',
  templateUrl: './instituto.component.html',
  styleUrls: ['./instituto.component.css']
})
export class InstitutoComponent implements OnInit {
  userId: number;
  userLogado: boolean;
  userName: string;
  institutoID: number;
  instituto: Instituto;
  servicosList: Servico[];
  produtosList: Produto[];
  membrosList: MembroStaff[];
  staffDict = {};
  trabalhosDict = {};

  constructor(private router: Router, private route: ActivatedRoute, private staffService: StafflistService, private servicoslistService: ServicoslistService, private produtoslistService: ProdutoslistService, private institutoslistService: InstitutoslistService, private categoriasService: CategoriasService, private autenticacaoService: AutenticacaoService) {
    this.institutoID = parseInt(this.route.snapshot.paramMap.get('id'));
    this.institutoslistService.getInstitutoById(this.institutoID).subscribe(objeto => { this.instituto = objeto; },
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
    let url = 'http://localhost:8000/rest/listaServicos?page=1&nome=&maxprice=&minprice=&categoria=-1&instituto=' + this.institutoID;
    this.servicoslistService.getListaServicos(url).subscribe(lista => { this.servicosList = lista.results;
      this.servicosList.forEach( (element) => {
        // @ts-ignore
        this.categoriasService.getCategoriaServicoById(element.categoria).subscribe(categoria => {element.categoria = categoria;},
          error => {
            if (error.status === 401) {
              this.autenticacaoService.renovateSession().subscribe(
                token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
                erro => this.router.navigateByUrl('/login'));
            }
          });
      });},
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
    url = 'http://localhost:8000/rest/listaProdutos?page=1&nome=&maxprice=&minprice=&categoria=-1&instituto=' + this.institutoID;
    this.produtoslistService.getListaProdutos(url).subscribe(lista => {this.produtosList = lista.results;
      this.produtosList.forEach( (element) => {
        // @ts-ignore
        this.categoriasService.getCategoriaProdutoById(element.categoria).subscribe(categoria => { element.categoria = categoria;},
          error => {
            if (error.status === 401) {
              this.autenticacaoService.renovateSession().subscribe(
                token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
                erro => this.router.navigateByUrl('/login'));
            }
          });
      });
    },
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
    this.staffService.getListaStaffByInstitutoID(this.institutoID).subscribe(result => { this.membrosList = result;
      this.membrosList.forEach( (element) => {
        //@ts-ignore
        this.staffService.getListaTrabalhos(this.institutoID, element.id).subscribe(result => {this.staffDict[element.id] = element; this.trabalhosDict[element.id] = result;},
          error => {
            if (error.status === 401) {
              this.autenticacaoService.renovateSession().subscribe(
                token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
                erro => this.router.navigateByUrl('/login'));
            }
          })
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
  }

  logout() {
    this.autenticacaoService.logout();
    this.userLogado = false;
    this.userName = null;
    this.userId = -1;
    this.router.navigate(['/home']);
  }

}
