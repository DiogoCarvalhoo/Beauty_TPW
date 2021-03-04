import { Component, OnInit } from '@angular/core';
import {Servico} from '../Servico';
import {MembroStaff} from '../MembroStaff';
import {Router} from '@angular/router';
import {ServicoslistService} from '../servicoslist.service';
import {AutenticacaoService} from '../autenticacao.service';
import {StafflistService} from '../stafflist.service';

@Component({
  selector: 'app-gestaostaff',
  templateUrl: './gestaostaff.component.html',
  styleUrls: ['./gestaostaff.component.css']
})
export class GestaostaffComponent implements OnInit {
  error: boolean;
  page_obj: boolean; //ALTERAR ISTO
  userId: number;
  userName: string;
  userLogado: boolean;
  trabalhadorList: MembroStaff[] = [];

  constructor(private router: Router, private stafflistService: StafflistService, private autenticacaoService: AutenticacaoService) {
    this.error = false;
    this.page_obj = true;
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
          this.trabalhadorList = [];
          this.stafflistService.getListaStaffByDonoID(this.userId).subscribe(lista => {this.trabalhadorList = lista},
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
    } else {
      this.router.navigate(['/home']);
    }
  }


  remover(membrostaff: MembroStaff): void {
    this.stafflistService.dropMembroStaff(membrostaff.id).subscribe(result => {this.ngOnInit();},
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
