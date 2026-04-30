import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav>
      <a routerLink="/dersler"    routerLinkActive="active">Dərslər</a>
      <a routerLink="/sagirdler"  routerLinkActive="active">Şagirdlər</a>
      <a routerLink="/imtahanlar" routerLinkActive="active">İmtahanlar</a>
    </nav>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent { }
