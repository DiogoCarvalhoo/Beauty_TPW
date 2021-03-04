import { Component, OnInit } from '@angular/core';
import {Produto} from '../Produto';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AutenticacaoService} from '../autenticacao.service';
import {ProdutoslistService} from '../produtoslist.service';
import {CategoriasService} from '../categorias.service';
import {CategoriaProduto} from '../CategoriaProduto';
import {Instituto} from '../Instituto';
import {InstitutoslistService} from '../institutoslist.service';

@Component({
  selector: 'app-editarproduto',
  templateUrl: './editarproduto.component.html',
  styleUrls: ['./editarproduto.component.css']
})
export class EditarprodutoComponent implements OnInit {
  userId: number;
  userLogado: boolean;
  userName: string;
  error: boolean;
  produtoID: number;
  produto: Produto;
  categorias: CategoriaProduto[] = [];
  institutos: Instituto[] = [];
  selectedCategoria: number;
  selectedInstitutos: number[] = [];

  formReady: boolean;
  formGroup: FormGroup;
  foto: File;

  constructor(private route: ActivatedRoute, private router: Router, private categoriasService: CategoriasService, private autenticacaoService: AutenticacaoService, private produtoslistService: ProdutoslistService, private institutoslistService: InstitutoslistService) {
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
    this.produtoID = parseInt(this.route.snapshot.paramMap.get('id'));
    this.produtoslistService.getProdutoById(this.produtoID).subscribe(result => {this.produto = result;
      //@ts-ignore
      this.selectedCategoria = this.produto.categoria;
      //@ts-ignore
      this.selectedInstitutos = this.produto.instituto;
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
    this.categoriasService.getListaCategoriasProdutos().subscribe(lista => {this.categorias = lista;},
      error => {
        if (error.status === 401) {
          this.autenticacaoService.renovateSession().subscribe(
            token => {localStorage.setItem('currentUserTokenAccess', token.access); this.ngOnInit()} ,
            erro => this.router.navigateByUrl('/login'));
        }
      });
    this.institutos = [];
    this.institutoslistService.getListaInstitutos('','').subscribe(lista => {
      lista.forEach((element) => {
        //@ts-ignore
        if (element.dono === this.userId || this.userName === 'projeto') {
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
      });
    this.formGroup = new FormGroup({
      nome: new FormControl(this.produto.nome),
      descricao: new FormControl(this.produto.descricao),
      preco: new FormControl(this.produto.preco),
      quantidade: new FormControl(this.produto.quantidade),
      categoria: new FormControl(''),
      instituto: new FormControl(''),
    });
    this.formReady = true;
  }

  onSelectedFile(event) {
    this.foto = event.target.files[0];
  }

  editarProcess() {
    this.error = false;
    if (this.formGroup.valid) {
      let institutos: string = '';
      this.selectedInstitutos.forEach((elemento) => {
        institutos = institutos + elemento + '-';
      });
      institutos = institutos.substring(0, institutos.length - 1);
      const uploadProduto: FormData = new FormData();
      uploadProduto.append('id', String(this.produto.id));
      uploadProduto.append('nome', this.formGroup.controls.nome.value);
      uploadProduto.append('descricao', this.formGroup.controls.descricao.value);
      uploadProduto.append('preco', this.formGroup.controls.preco.value);
      uploadProduto.append('quantidade', this.formGroup.controls.quantidade.value);
      uploadProduto.append('institutos', institutos);
      if (this.foto !== undefined) {
        uploadProduto.append('foto', this.foto, this.foto.name);
      } else {
        uploadProduto.append('foto', '');
      }
      uploadProduto.append('categoria', String(this.formGroup.controls.categoria.value));
      this.produtoslistService.updateProduto(uploadProduto).subscribe(result => {this.router.navigate(['/gerirprodutos']);},
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
