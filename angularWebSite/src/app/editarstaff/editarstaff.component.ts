import { Component, OnInit } from '@angular/core';
import {Instituto} from '../Instituto';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MembroStaff} from '../MembroStaff';
import {ActivatedRoute, Router} from '@angular/router';
import {CategoriasService} from '../categorias.service';
import {AutenticacaoService} from '../autenticacao.service';
import {ServicoslistService} from '../servicoslist.service';
import {InstitutoslistService} from '../institutoslist.service';
import {StafflistService} from '../stafflist.service';
import {Trabalho} from '../Trabalho';

@Component({
  selector: 'app-editarstaff',
  templateUrl: './editarstaff.component.html',
  styleUrls: ['./editarstaff.component.css']
})
export class EditarstaffComponent implements OnInit {
  userId: number;
  userLogado: boolean;
  userName: string;
  error: boolean;
  membrostaffID: number;
  membrostaff: MembroStaff;
  trabalhos = [];
  selectedTrabalhos: number[] = [];

  formReady: boolean;
  formGroup: FormGroup;
  foto: File;

  constructor(private route: ActivatedRoute, private router: Router, private autenticacaoService: AutenticacaoService,  private institutoslistService: InstitutoslistService, private stafflistService: StafflistService) {
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
    this.membrostaffID = parseInt(this.route.snapshot.paramMap.get('id'));

    this.stafflistService.getStaffMemberById(this.membrostaffID).subscribe(result => {this.membrostaff = result;
      //@ts-ignore
      this.selectedTrabalhos = this.membrostaff.trabalhos;
      this.initForm();
    },
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
  }

  initForm() {
    this.trabalhos = [];
    this.stafflistService.getListaTrabalhosByDono(this.userId).subscribe(lista => {
      lista.forEach((element) => {
        //@ts-ignore
        this.institutoslistService.getInstitutoById(element.instituto).subscribe(result => {
          this.trabalhos.push([element, result.nome]);
        },
          error => {
            if (error.status === 401) {
              this.autenticacaoService.renovateSession().subscribe(
                token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
                erro => this.router.navigateByUrl('/login'));
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
      nome: new FormControl(this.membrostaff.nome),
      trabalho: new FormControl(''),
    });
    this.formReady = true;
  }

  onSelectedFile(event) {
    this.foto = event.target.files[0];
  }

  editarProcess() {
    this.error = false;
    if (this.formGroup.valid) {
      let trabalhos: string = '';
      this.selectedTrabalhos.forEach((elemento) => {
        trabalhos = trabalhos + elemento + '-';
      });
      trabalhos = trabalhos.substring(0, trabalhos.length - 1);
      const uploadMembro: FormData = new FormData();
      uploadMembro.append('id', String(this.membrostaff.id));
      uploadMembro.append('nome', this.formGroup.controls.nome.value);
      if (this.foto !== undefined) {
        uploadMembro.append('foto', this.foto, this.foto.name);
      } else {
        uploadMembro.append('foto', '');
      }
      uploadMembro.append('trabalhos', trabalhos);

      this.stafflistService.updateStaff(uploadMembro).subscribe(result => {this.router.navigate(['/gerirstaff']);},
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
