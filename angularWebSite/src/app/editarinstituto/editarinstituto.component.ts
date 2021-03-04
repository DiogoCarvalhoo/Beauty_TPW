import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AutenticacaoService} from '../autenticacao.service';
import {InstitutoslistService} from '../institutoslist.service';
import {Instituto} from '../Instituto';
import {Produto} from '../Produto';
import {Servico} from '../Servico';
import {ServicoslistService} from '../servicoslist.service';
import {ProdutoslistService} from '../produtoslist.service';
import {StafflistService} from '../stafflist.service';
import {MembroStaff} from '../MembroStaff';
import {CategoriasService} from '../categorias.service';

@Component({
  selector: 'app-editarinstituto',
  templateUrl: './editarinstituto.component.html',
  styleUrls: ['./editarinstituto.component.css']
})
export class EditarinstitutoComponent implements OnInit {
  userId: number;
  userLogado: boolean;
  userName: string;
  error: boolean;
  institutoID: number;
  instituto: Instituto;
  servicolist: Servico[] = [];
  produtolist: Produto[] = [];
  membrosList: MembroStaff[];
  staffDict = {};
  trabalhosDict = {};


  formReady: boolean;
  formGroup: FormGroup;
  foto: File;

  constructor(private route: ActivatedRoute, private router: Router,private categoriasService: CategoriasService, private autenticacaoService: AutenticacaoService, private institutoslistService: InstitutoslistService, private servicoslistService: ServicoslistService, private produtoslistService: ProdutoslistService, private staffService: StafflistService) {
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
    this.staffDict = {};
    this.trabalhosDict = {};
    this.membrosList = [];
    this.institutoID = parseInt(this.route.snapshot.paramMap.get('id'));
    this.institutoslistService.getInstitutoById(this.institutoID).subscribe(result => {
      this.instituto = result;
      let url = 'http://localhost:8000/rest/listaServicos?page=1&nome=&maxprice=&minprice=&categoria=-1&instituto=' + this.institutoID;
      this.servicoslistService.getListaServicos(url).subscribe(result1 => {this.servicolist = result1.results;
          this.servicolist.forEach( (element) => {
            // @ts-ignore
            this.categoriasService.getCategoriaServicoById(element.categoria).subscribe(categoria => {element.categoria = categoria;},
              error => {
                if (error.status === 401) {
                  this.autenticacaoService.renovateSession().subscribe(
                    token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
                    erro => this.router.navigateByUrl('/login'));
                }
              });
          }); },
        error => {
          if (error.status === 401) {
            this.autenticacaoService.renovateSession().subscribe(
              token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
              erro => this.router.navigateByUrl('/login'));
          }
        });
      this.produtoslistService.getListaProdutos('http://localhost:8000/rest/listaProdutos?page_size=8&page=1&nome=&maxprice=&minprice=&categoria=-1&instituto=' + this.institutoID).subscribe(result2 => {this.produtolist = result2.results;
        this.produtolist.forEach( (element) => {
          // @ts-ignore
          this.categoriasService.getCategoriaProdutoById(element.categoria).subscribe(categoria => { element.categoria = categoria;},
            error => {
              if (error.status === 401) {
                this.autenticacaoService.renovateSession().subscribe(
                  token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
                  erro => this.router.navigateByUrl('/login'));
              }
            });
        });},
        error => {
          if (error.status === 401) {
            this.autenticacaoService.renovateSession().subscribe(
              token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
              erro => this.router.navigateByUrl('/login'));
          }
        });
      this.initForm();
    },
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
    this.staffService.getListaStaffByInstitutoID(this.institutoID).subscribe(result1 => { this.membrosList = result1;
      this.membrosList.forEach( (element) => {
        //@ts-ignore
        this.staffService.getListaTrabalhos(this.institutoID, element.id).subscribe(result2 => {this.staffDict[element.id] = element; this.trabalhosDict[element.id] = result2;},
          error => {
            if (error.status === 401) {
              this.autenticacaoService.renovateSession().subscribe(
                token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
                erro => this.router.navigateByUrl('/login'));
            }
          })
      });
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
    this.formGroup = new FormGroup({
      nome: new FormControl(this.instituto.nome),
      slogan: new FormControl(this.instituto.slogan),
      localizacao: new FormControl(this.instituto.localizacao),
      email: new FormControl(this.instituto.email),
      website: new FormControl(this.instituto.website),
    });
    this.formReady = true;
  }

  onSelectedFile(event) {
    this.foto = event.target.files[0];
  }

  editarProcess() {
    this.error = false;
    if (this.formGroup.valid) {
      const uploadInstituto: FormData = new FormData();
      uploadInstituto.append('id', String(this.instituto.id));
      uploadInstituto.append('nome', this.formGroup.controls.nome.value);
      uploadInstituto.append('slogan', this.formGroup.controls.slogan.value);
      uploadInstituto.append('localizacao', this.formGroup.controls.localizacao.value);
      uploadInstituto.append('email', this.formGroup.controls.email.value);
      uploadInstituto.append('website', this.formGroup.controls.website.value);
      if (this.foto !== undefined) {
        uploadInstituto.append('foto', this.foto, this.foto.name);
      } else {
        uploadInstituto.append('foto', '');
      }
      this.institutoslistService.updateInstituto(uploadInstituto).subscribe(result => {  this.router.navigate(['/geririnstitutos']);},
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




  removerServico(servico: Servico) {
    this.servicoslistService.dropServico(servico.id).subscribe(result => {this.ngOnInit();},
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
  }

  removerProduto(produto: Produto) {
    this.produtoslistService.dropProduto(produto.id).subscribe(result => {this.ngOnInit();},
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
  }

  removerStaff(membrostaff: MembroStaff): void {
    this.staffService.dropMembroStaff(membrostaff.id).subscribe(result => {this.ngOnInit();},
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
