import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Instituto} from '../Instituto';
import {Router} from '@angular/router';
import {AutenticacaoService} from '../autenticacao.service';
import {InstitutoslistService} from '../institutoslist.service';
import {StafflistService} from '../stafflist.service';
import {MembroStaff} from '../MembroStaff';

@Component({
  selector: 'app-inserirstaff',
  templateUrl: './inserirstaff.component.html',
  styleUrls: ['./inserirstaff.component.css']
})
export class InserirstaffComponent implements OnInit {
  userId: number;
  userLogado: boolean;
  userName: string;
  error: boolean;

  formReady: boolean;
  formGroup: FormGroup;
  foto: File;
  trabalhos = [];
  institutos: Instituto[] = [];

  constructor(private router: Router, private autenticacaoService: AutenticacaoService, private stafflistService: StafflistService, private institutoslistService: InstitutoslistService) {
    this.error = false;
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
    } else {
      this.router.navigate(['/home']);
    }
    this.institutoslistService.getListaInstitutos('', '').subscribe(result => {this.institutos = result; this.initForm();},
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      })
  }

  initForm() {
    this.trabalhos = [];
    this.stafflistService.getListaTrabalhosByDono(this.userId).subscribe(lista => {
      lista.forEach((element) => {
        this.institutos.forEach((element2) => {
          //@ts-ignore
          if (element.instituto === element2.id) {
            this.trabalhos.push([element, element2.nome]);
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
    this.formGroup = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      trabalhos: new FormControl('', [Validators.required]),
    });
    this.formReady = true;
  }


  onSelectedFile(event) {
    this.foto = event.target.files[0];
  }


  inserirProcess() {
    this.error = false;
    if (this.formGroup.valid && this.foto !== undefined) {
      this.autenticacaoService.getUser(this.userName).subscribe(dono => {
        let trabalhos : string = '';
        this.formGroup.controls.trabalhos.value.forEach((elemento) => {
          trabalhos = trabalhos + elemento.id + '-';
        });
        trabalhos = trabalhos.substring(0, trabalhos.length - 1);

        const uploadMembro: FormData = new FormData();
        uploadMembro.append('nome', this.formGroup.controls.nome.value);
        uploadMembro.append('foto', this.foto, this.foto.name);
        uploadMembro.append('trabalhos', trabalhos);
        uploadMembro.append('dono', String(dono.id));

        this.stafflistService.createMembroStaff(uploadMembro).subscribe(result => {
        this.router.navigate(['/gerirstaff']);
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

    } else {
      this.error = true;
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
