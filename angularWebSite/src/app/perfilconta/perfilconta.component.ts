import { Component, OnInit } from '@angular/core';
import {AutenticacaoService} from '../autenticacao.service';
import {Router} from '@angular/router';
import {Form, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../User';
import {UserService} from '../user.service';

@Component({
  selector: 'app-perfilconta',
  templateUrl: './perfilconta.component.html',
  styleUrls: ['./perfilconta.component.css']
})
export class PerfilcontaComponent implements OnInit {
  error: boolean;
  userId: number;
  userLogado: boolean;
  userName: string;
  user: User;

  formGroup: FormGroup;
  formGroup2: FormGroup;
  formReady: boolean;
  formReady2: boolean;

  constructor(private router: Router, private autenticacaoService: AutenticacaoService, private userService: UserService) {
    this.error = false;
    this.formReady = false;
    this.formReady2 = false;
  }

  ngOnInit(): void {
    if (localStorage.getItem('currentUserUsername') != null) {
      this.userLogado = true;
    } else {
      this.userLogado = false;
    }
    if (this.userLogado) {
      this.userName = localStorage.getItem('currentUserUsername');
      this.autenticacaoService.getUser(this.userName).subscribe(result => {this.userId = result.id; this.user = result; this.initForm();

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

  initForm() {
    this.formGroup = new FormGroup({
      email: new FormControl(this.user.email, [Validators.required]),
    });
    this.formGroup2 = new FormGroup({
      passwordatual: new FormControl('', [Validators.required]),
      passwordnova: new FormControl('', [Validators.required]),
      passwordnovarepetida: new FormControl('', [Validators.required]),
    });
    this.formReady = true;
    this.formReady2 = true;
  }

  alterarEmail() {
    if (this.formGroup.valid) {
      this.user.email = this.formGroup.controls.email.value;
      this.userService.updateUserEmail(this.user).subscribe(result => {
          this.router.navigate(['/home']);
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


  alterarPassword() {
    if (this.formGroup2.valid) {
      const passwordatual = this.formGroup2.controls.passwordatual.value;
      const passwordnova = this.formGroup2.controls.passwordnova.value;
      const passwordnovarepetida = this.formGroup2.controls.passwordnovarepetida.value;
      if (passwordnova === passwordnovarepetida) {
        this.userService.updateUserPassword(this.userId, passwordatual, passwordnova).subscribe(result => {
            this.router.navigate(['/home']);
          },
          error => {
            if (error.status === 401) {
              this.autenticacaoService.renovateSession().subscribe(
                token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
                erro => this.router.navigateByUrl('/login'));
            }
            if (error.status === 304) {
              this.router.navigate(['/home']);
            }
          });
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
