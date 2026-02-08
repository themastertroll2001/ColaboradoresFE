import { Component } from '@angular/core';

import { ColaboradorComponent } from './components/colaborador/colaborador.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ ColaboradorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Datos Empleados';
}
