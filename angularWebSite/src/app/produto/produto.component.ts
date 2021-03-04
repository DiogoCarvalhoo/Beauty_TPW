import { Component, OnInit } from '@angular/core';
import {Produto} from '../Produto';
import {Instituto} from '../Instituto';
import {ActivatedRoute, Router} from '@angular/router';
import {ProdutoslistService} from '../produtoslist.service';
import {AutenticacaoService} from '../autenticacao.service';
import {CategoriasService} from '../categorias.service';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css']
})
export class ProdutoComponent implements OnInit {
  userId: number;
  userLogado: boolean;
  userName: string;
  produtoID: number;
  produto: Produto;
  vendedores: Instituto[];

  constructor(private route: ActivatedRoute, private produtoslistService: ProdutoslistService, private router: Router, private autenticacaoService: AutenticacaoService, private categoriasService: CategoriasService) {
    this.produtoID = parseInt(this.route.snapshot.paramMap.get('id'));
    this.produtoslistService.getProdutoById(this.produtoID).subscribe(produto => {this.produto = produto;
      //@ts-ignore
      this.categoriasService.getCategoriaProdutoById(this.produto.categoria).subscribe(result => {
        this.produto.categoria = result;
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
    this.produtoslistService.getVendedoresDeProduto(this.produtoID).subscribe(vendedores => {this.vendedores = vendedores;},
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
