import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Colaborador } from '../../models/colaborador.model';

@Component({
  selector: 'app-colaborador-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './colaborador-modal.component.html',
  styleUrl: './colaborador-modal.component.css'
})
export class ColaboradorModalComponent {

  @Input() visible = false;
  @Input() modoEdicion = false;
  @Input() colaborador!: Colaborador;

  @Output() cerrar = new EventEmitter<void>();
  @Output() guardar = new EventEmitter<any>();

  cerrarModal() {
    this.cerrar.emit();
  }

  guardarColaborador() {
    this.guardar.emit(this.colaborador);
  }
}
