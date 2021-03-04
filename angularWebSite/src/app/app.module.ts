import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './AuthInterceptor';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './home/home.component';
import { InstitutoslistComponent } from './institutoslist/institutoslist.component';
import {HttpClientModule} from '@angular/common/http';
import { ServicoslistComponent } from './servicoslist/servicoslist.component';
import { ProdutoslistComponent } from './produtoslist/produtoslist.component';
import { InstitutoComponent } from './instituto/instituto.component';
import { ServicoComponent } from './servico/servico.component';
import { ProdutoComponent } from './produto/produto.component';
import { LoginComponent } from './login/login.component';
import { RegistarComponent } from './registar/registar.component';
import { AreareservadaComponent } from './areareservada/areareservada.component';
import { GestaoinstitutosComponent } from './gestaoinstitutos/gestaoinstitutos.component';
import { InseririnstitutoComponent } from './inseririnstituto/inseririnstituto.component';
import { GestaoservicosComponent } from './gestaoservicos/gestaoservicos.component';
import { GestaoprodutosComponent } from './gestaoprodutos/gestaoprodutos.component';
import { InserirservicoComponent } from './inserirservico/inserirservico.component';
import { InserirprodutoComponent } from './inserirproduto/inserirproduto.component';
import { GestaostaffComponent } from './gestaostaff/gestaostaff.component';
import { InserirstaffComponent } from './inserirstaff/inserirstaff.component';
import { EditarinstitutoComponent } from './editarinstituto/editarinstituto.component';
import { EditarprodutoComponent } from './editarproduto/editarproduto.component';
import { EditarservicoComponent } from './editarservico/editarservico.component';
import { EditarstaffComponent } from './editarstaff/editarstaff.component';
import { PerfilcontaComponent } from './perfilconta/perfilconta.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InstitutoslistComponent,
    ServicoslistComponent,
    ProdutoslistComponent,
    InstitutoComponent,
    ServicoComponent,
    ProdutoComponent,
    LoginComponent,
    RegistarComponent,
    AreareservadaComponent,
    GestaoinstitutosComponent,
    InseririnstitutoComponent,
    GestaoservicosComponent,
    GestaoprodutosComponent,
    InserirservicoComponent,
    InserirprodutoComponent,
    GestaostaffComponent,
    InserirstaffComponent,
    EditarinstitutoComponent,
    EditarprodutoComponent,
    EditarservicoComponent,
    EditarstaffComponent,
    PerfilcontaComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
