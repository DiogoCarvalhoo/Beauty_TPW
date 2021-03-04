import { Component, OnInit } from '@angular/core';
import {Servico} from '../Servico';
import {Instituto} from '../Instituto';
import {ActivatedRoute, Router} from '@angular/router';
import {ServicoslistService} from '../servicoslist.service';
import {AutenticacaoService} from '../autenticacao.service';
import {CategoriasService} from '../categorias.service';

@Component({
  selector: 'app-servico',
  templateUrl: './servico.component.html',
  styleUrls: ['./servico.component.css']
})
export class ServicoComponent implements OnInit {
  userId: number;
  userLogado: boolean;
  userName: string;
  servicoID: number;
  servico: Servico;
  vendedores: Instituto[];

  constructor(private route: ActivatedRoute, private servicoslistService: ServicoslistService, private router: Router, private autenticacaoService: AutenticacaoService, private categoriasService: CategoriasService) {
    this.servicoID = parseInt(this.route.snapshot.paramMap.get('id'));
    this.servicoslistService.getServicoById(this.servicoID).subscribe(servico => {this.servico = servico
      //@ts-ignore
      this.categoriasService.getCategoriaServicoById(this.servico.categoria).subscribe(result => {
        this.servico.categoria = result;
      },
        error => {
          if (error.status === 401) {
            this.autenticacaoService.renovateSession().subscribe(
              token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
              erro => this.router.navigateByUrl('/login'));
          }
        })
    },
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
    this.servicoslistService.getVendedoresDeServico(this.servicoID).subscribe(vendedores => {this.vendedores = vendedores;},
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
