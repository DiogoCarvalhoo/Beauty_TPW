import { Component, OnInit } from '@angular/core';
import {AutenticacaoService} from '../autenticacao.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../User';

@Component({
  selector: 'app-registar',
  templateUrl: './registar.component.html',
  styleUrls: ['./registar.component.css']
})
export class RegistarComponent implements OnInit {
  erroCredenciais: boolean;
  erroPasswords: boolean;
  userId: number;
  userLogado: boolean;
  userName: string;

  formGroup: FormGroup;
  formReady: boolean;


  constructor(private autenticacaoService: AutenticacaoService, private router: Router) {
    this.erroCredenciais = false;
    this.erroPasswords = false;
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
  }

  initForm() {
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      passwordrepetida: new FormControl('', [Validators.required]),
    });
    this.formReady = true;
  }

  registoProcess() {
    if (this.formGroup.valid) {
      if (this.formGroup.controls.password.value === this.formGroup.controls.passwordrepetida.value) {
        const novoUser = new User(this.formGroup.controls.username.value, this.formGroup.controls.email.value, this.formGroup.controls.password.value);
        this.autenticacaoService.registo(novoUser).subscribe(result => {
          this.router.navigate(['/login']);
        },
          error => {
            if (error.status === 401) {
              this.autenticacaoService.renovateSession().subscribe(
                token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
                erro => this.router.navigateByUrl('/login'));
            } else {
              this.erroCredenciais = true;
              this.ngOnInit();
            }
          });
      } else {
        this.erroPasswords = true;
      }
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
