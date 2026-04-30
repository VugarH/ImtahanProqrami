import { Routes } from '@angular/router';
import { DerslerComponent } from './components/dersler/dersler.component';
import { SagirdlerComponent } from './components/sagirdler/sagirdler.component';
import { ImtahanlarComponent } from './components/imtahanlar/imtahanlar.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dersler', pathMatch: 'full' },
  { path: 'dersler',    component: DerslerComponent },
  { path: 'sagirdler',  component: SagirdlerComponent },
  { path: 'imtahanlar', component: ImtahanlarComponent }
];
