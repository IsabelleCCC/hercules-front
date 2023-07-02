import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { FaConfig, FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as FontAwesomeSolid from '@fortawesome/free-solid-svg-icons';
import * as FontAwesomeRegular from '@fortawesome/free-regular-svg-icons';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { HomeComponent } from './home/home.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuComponent } from './menu/menu.component';
import { ConfigsComponent } from './configs/configs.component';
import { AvaliacaoFisicaComponent } from './avaliacao-fisica/avaliacao-fisica.component';
import { PlanosDeTreinoComponent } from './planos-de-treino/planos-de-treino.component';
import { RegistrarTreinoComponent } from './registrar-treino/registrar-treino.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpInterceptorService } from './services/http-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CadastroComponent,
    HomeComponent,
    MenuComponent,
    ConfigsComponent,
    AvaliacaoFisicaComponent,
    PlanosDeTreinoComponent,
    RegistrarTreinoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    NgbModule,
    SweetAlert2Module.forRoot(),
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary, faConfig: FaConfig) {
    faConfig.fixedWidth = true
    library.addIcons(
      FontAwesomeSolid.faCheck,
      FontAwesomeSolid.faHouse,
      FontAwesomeSolid.faDumbbell,
      FontAwesomeSolid.faListUl,
      FontAwesomeSolid.faChildReaching,
      FontAwesomeSolid.faGear,
      FontAwesomeSolid.faXmark,
      FontAwesomeRegular.faTrashCan,
      FontAwesomeSolid.faPencil,
      FontAwesomeSolid.faTrashCan,
      FontAwesomeSolid.faPlus
    )
  }
 }
