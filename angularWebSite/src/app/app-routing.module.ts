import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import {HomeComponent} from './home/home.component';
import {InstitutoslistComponent} from './institutoslist/institutoslist.component';
import {ServicoslistComponent} from './servicoslist/servicoslist.component';
import {ProdutoslistComponent} from './produtoslist/produtoslist.component';
import {InstitutoComponent} from './instituto/instituto.component';
import {ServicoComponent} from './servico/servico.component';
import {ProdutoComponent} from './produto/produto.component';
import {LoginComponent} from './login/login.component';
import {RegistarComponent} from './registar/registar.component';
import {AreareservadaComponent} from './areareservada/areareservada.component';
import {GestaoinstitutosComponent} from './gestaoinstitutos/gestaoinstitutos.component';
import {InseririnstitutoComponent} from './inseririnstituto/inseririnstituto.component';
import {GestaoservicosComponent} from './gestaoservicos/gestaoservicos.component';
import {InserirservicoComponent} from './inserirservico/inserirservico.component';
import {GestaoprodutosComponent} from './gestaoprodutos/gestaoprodutos.component';
import {InserirprodutoComponent} from './inserirproduto/inserirproduto.component';
import {InserirstaffComponent} from './inserirstaff/inserirstaff.component';
import {GestaostaffComponent} from './gestaostaff/gestaostaff.component';
import {EditarinstitutoComponent} from './editarinstituto/editarinstituto.component';
import {EditarprodutoComponent} from './editarproduto/editarproduto.component';
import {EditarservicoComponent} from './editarservico/editarservico.component';
import {EditarstaffComponent} from './editarstaff/editarstaff.component';
import {PerfilcontaComponent} from './perfilconta/perfilconta.component';

// Paths Disponiveis
const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'listaInstitutos', component: InstitutoslistComponent},
  {path: 'listaServicos', component: ServicoslistComponent},
  {path: 'listaProdutos', component: ProdutoslistComponent},
  {path: 'instituto/:id', component: InstitutoComponent},
  {path: 'servico/:id', component: ServicoComponent},
  {path: 'produto/:id', component: ProdutoComponent},
  {path: 'login', component: LoginComponent},
  {path: 'registar', component: RegistarComponent},
  {path: 'areareservada', component: AreareservadaComponent},
  {path: 'inseririnstituto', component: InseririnstitutoComponent},
  {path: 'geririnstitutos', component: GestaoinstitutosComponent},
  {path: 'editarinstituto/:id', component: EditarinstitutoComponent},
  {path: 'inserirservico', component: InserirservicoComponent},
  {path: 'gerirservicos', component: GestaoservicosComponent},
  {path: 'editarservico/:id', component: EditarservicoComponent},
  {path: 'inserirproduto', component: InserirprodutoComponent},
  {path: 'gerirprodutos', component: GestaoprodutosComponent},
  {path: 'editarproduto/:id', component: EditarprodutoComponent},
  {path: 'inserirstaff', component: InserirstaffComponent},
  {path: 'gerirstaff', component: GestaostaffComponent},
  {path: 'editarstaff/:id', component: EditarstaffComponent},
  {path: 'account', component: PerfilcontaComponent},
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
