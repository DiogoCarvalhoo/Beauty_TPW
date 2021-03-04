import { Component, OnInit } from '@angular/core';
import {Instituto} from '../Instituto';
import {InstitutoslistService} from '../institutoslist.service';
import {NavigationExtras, Router} from '@angular/router';
import {AutenticacaoService} from '../autenticacao.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-institutoslist',
  templateUrl: './institutoslist.component.html',
  styleUrls: ['./institutoslist.component.css']
})
export class InstitutoslistComponent implements OnInit {
  error: boolean;
  page_obj: boolean; //ALTERAR ISTO
  userId: number;
  userName: string;
  userLogado: boolean;
  institutosList: Instituto[];

  formGroup: FormGroup;
  formReady: boolean;


  constructor(private institutoslistService: InstitutoslistService, private router: Router, private autenticacaoService: AutenticacaoService) {
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
      this.autenticacaoService.getUser(this.userName).subscribe(
        result => {this.userId = result.id;},
        error => {
          if (error.status === 401) {
            this.autenticacaoService.renovateSession().subscribe(
              token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
              erro => this.router.navigateByUrl('/login'));
          }
        }
      );
    }
    this.institutoslistService.getListaInstitutos('','' ).subscribe(
      lista => { this.institutosList = lista; this.initForm()},
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      }
      );
  }

  initForm() {
    this.formGroup = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      localizacao: new FormControl('', [Validators.required]),
    });
    this.formReady = true;
  }

  pesquisa(): void {
    this.institutoslistService.getListaInstitutos(this.formGroup.controls.nome.value, this.formGroup.controls.localizacao.value).subscribe(
      lista => { this.institutosList = lista; this.initForm()},
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      }
    );
  }

  logout() {
    this.autenticacaoService.logout();
    this.userLogado = false;
    this.userName = null;
    this.userId = -1;
    this.router.navigate(['/home']);
  }



}
