import { Component, OnInit } from '@angular/core';
import {Servico} from '../Servico';
import {Router} from '@angular/router';
import {AutenticacaoService} from '../autenticacao.service';
import {ServicoslistService} from '../servicoslist.service';

@Component({
  selector: 'app-gestaoservicos',
  templateUrl: './gestaoservicos.component.html',
  styleUrls: ['./gestaoservicos.component.css']
})
export class GestaoservicosComponent implements OnInit {
  error: boolean;
  page_obj: boolean; //ALTERAR ISTO
  userId: number;
  userName: string;
  userLogado: boolean;
  renderizar: boolean = false;
  servicosList: Servico[] = [];


  constructor(private router: Router, private servicoslistService: ServicoslistService, private autenticacaoService: AutenticacaoService) {
    this.error = false;
    this.page_obj = true;
  }

  ngOnInit(): void {
    this.renderizar = false;
    if (localStorage.getItem('currentUserUsername') != null) {
      this.userLogado = true;
    } else {
      this.userLogado = false;
    }
    if (this.userLogado) {
      this.userName = localStorage.getItem('currentUserUsername');
      this.autenticacaoService.getUser(this.userName).subscribe(result => {this.userId = result.id;
          this.servicosList = [];
          this.getServicos('http://localhost:8000/rest/listaServicos?page=1&nome=&maxprice=&minprice=&categoria=-1&instituto=-1');

        },
        error => {
          if (error.status === 401) {
            this.autenticacaoService.renovateSession().subscribe(
              token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
              erro => this.router.navigateByUrl('/login'));
          }
        });
    } else {
      this.router.navigate(['/home']);
    }
  }


  remover(servico: Servico): void {
    this.servicoslistService.dropServico(servico.id).subscribe(result => {this.ngOnInit();},
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
        response2.results.forEach((element) => {
          //@ts-ignore
          if (element.dono === this.userId || this.userName === 'projeto') {
            this.servicosList.push(element);
          }
        });
        this.renderizar = true;
      },
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
  }




  logout() {
    this.autenticacaoService.logout();
    this.userLogado = false;
    this.userName = null;
    this.userId = -1;
    this.router.navigate(['/home']);
  }

}
