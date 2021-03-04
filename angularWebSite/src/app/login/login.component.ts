import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AutenticacaoService} from '../autenticacao.service';
import {Route, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  erroCredenciais: boolean;
  userId: number;
  userLogado: boolean;
  userName: string;

  formGroup: FormGroup;
  formReady: boolean;

  constructor(private autenticacaoService: AutenticacaoService, private router: Router) {
    this.erroCredenciais = false;
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
        }
      );
    }
    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
    this.formReady = true;
  }

  loginProcess() {
    if (this.formGroup.valid) {
      this.autenticacaoService.login(this.formGroup.controls.username.value, this.formGroup.controls.password.value ).subscribe(
        result => {
          this.router.navigate(['/home']);},
        error => {
            this.erroCredenciais = true;
            this.ngOnInit();
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
