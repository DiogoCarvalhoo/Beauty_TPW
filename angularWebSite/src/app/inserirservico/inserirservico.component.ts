import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AutenticacaoService} from '../autenticacao.service';
import {ServicoslistService} from '../servicoslist.service';
import {CategoriaServico} from '../CategoriaServico';
import {CategoriasService} from '../categorias.service';
import {Instituto} from '../Instituto';
import {InstitutoslistService} from '../institutoslist.service';
import {Servico} from '../Servico';

@Component({
  selector: 'app-inserirservico',
  templateUrl: './inserirservico.component.html',
  styleUrls: ['./inserirservico.component.css']
})
export class InserirservicoComponent implements OnInit {
  userId: number;
  userLogado: boolean;
  userName: string;
  error: boolean;

  formReady: boolean;
  formGroup: FormGroup;
  foto: File;
  categorias: CategoriaServico[];
  institutos: Instituto[] = [];
  constructor(private router: Router, private autenticacaoService: AutenticacaoService, private servicoslistService: ServicoslistService, private categoriasService: CategoriasService, private institutoslistService: InstitutoslistService) {
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
    this.initForm();
  }

  initForm() {
    this.categoriasService.getListaCategoriasServicos().subscribe(lista => {this.categorias = lista;});
    this.institutos = [];
    this.institutoslistService.getListaInstitutos('','').subscribe(lista => {
      lista.forEach((element) => {
        //@ts-ignore
        if (element.dono === this.userId) {
          this.institutos.push(element);
        }
      });
    },
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      })
    this.formGroup = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      descricao: new FormControl('', [Validators.required]),
      preco: new FormControl('', [Validators.required]),
      categoria: new FormControl('', [Validators.required]),
      instituto: new FormControl('', [Validators.required]),
      //foto: new FormControl('', [Validators.required]),
    });
    this.formReady = true;
  }

  onSelectedFile(event) {
    this.foto = event.target.files[0];
  }

  inserirProcess() {
    this.error = false;
    if (this.formGroup.valid && this.foto !== undefined) {
      let categoriaselecionada;
      let institutosselecionados = '';
      this.formGroup.controls.instituto.value.forEach((elemento) => {
        this.institutoslistService.getInstitutoById(elemento).subscribe(result => {
          institutosselecionados = institutosselecionados + result.id + '-';
        },
          error => {
            if (error.status === 401) {
              this.autenticacaoService.renovateSession().subscribe(
                token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
                erro => this.router.navigateByUrl('/login'));
            }
          });
      });
      this.categoriasService.getCategoriaServicoById(this.formGroup.controls.categoria.value).subscribe(result => {categoriaselecionada = result;
        this.autenticacaoService.getUser(this.userName).subscribe(dono => {
          const uploadServico: FormData = new FormData();
          uploadServico.append('nome', this.formGroup.controls.nome.value);
          uploadServico.append('descricao', this.formGroup.controls.descricao.value);
          uploadServico.append('preco', this.formGroup.controls.preco.value);
          uploadServico.append('institutos', institutosselecionados.substring(0, institutosselecionados.length - 1));
          uploadServico.append('foto', this.foto, this.foto.name);
          uploadServico.append('categoria', String(categoriaselecionada.id));
          uploadServico.append('dono', String(dono.id));

          this.servicoslistService.createServico(uploadServico).subscribe(result => {
            this.router.navigate(['/gerirservicos']);
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
