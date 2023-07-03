import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CadastroComponent } from './cadastro/cadastro.component';
import { HomeComponent } from './home/home.component';
import { ConfigsComponent } from './configs/configs.component';
import { PlanosDeTreinoComponent } from './planos-de-treino/planos-de-treino.component';
import { RegistrarTreinoComponent } from './registrar-treino/registrar-treino.component';
import { AvaliacaoFisicaComponent } from './avaliacao-fisica/avaliacao-fisica.component';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'login', component: LoginComponent},
  { path: 'cadastro', component: CadastroComponent},
  { path: 'home', component: HomeComponent},
  { path: 'configs', component: ConfigsComponent},
  { path: 'planos-de-treino', component: PlanosDeTreinoComponent},
  { path: 'registrar-treino', component: RegistrarTreinoComponent},
  { path: 'avaliacao-fisica', component: AvaliacaoFisicaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
