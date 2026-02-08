import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ColaboradorService } from '../../services/colaborador.service';
import { ColaboradorModalComponent } from '../colaborador-modal/colaborador-modal.component';
import { Colaborador } from '../../models/colaborador.model';

@Component({
  selector: 'app-colaborador',
  standalone: true,
  imports: [FormsModule, CommonModule, ColaboradorModalComponent],
  templateUrl: './colaborador.component.html',
  styleUrl: './colaborador.component.css'
})
export class ColaboradorComponent implements OnInit {
  colaboradores: Colaborador[] = [];
  alertaVisible = false;
  alertaMensaje = '';
  alertaTipo: 'success' | 'error' | 'warning' = 'success';
  nuevoColaborador: Colaborador = {
    NOMBRE: '',
    APELLIDO: '',
    DIRECCION: '',
    EDAD: null,
    PROFESION: '',
    ESTADOCIVIL: ''
  };
  mostrarModal = false;
  animarTabla = false;
  paginaActual = 1;
  limite = 10;
  totalRegistros = 0;
  modoEdicion = false;
  idEditar: number | null = null;
  mostrarConfirmDelete = false;
  idAEliminar: number | null = null;


  constructor(private colaboradorService: ColaboradorService) { }

  ngOnInit(): void {
    this.cargarColaboradores();
  }

  cargarColaboradores() {
    this.animarTabla = false;
    this.colaboradorService.getColaboradores(this.paginaActual, this.limite).subscribe(resp => {
      this.colaboradores = resp.data;
      this.totalRegistros = resp.total;
      setTimeout(() => {
        this.animarTabla = true;
      }, 500);
    });
  }

  editarColaborador(c: Colaborador) {
    if (!c.IDCOLABORADOR) return;
    this.modoEdicion = true;
    this.idEditar = c.IDCOLABORADOR;

    this.nuevoColaborador = {
      NOMBRE: c.NOMBRE,
      APELLIDO: c.APELLIDO,
      DIRECCION: c.DIRECCION,
      EDAD: c.EDAD,
      PROFESION: c.PROFESION,
      ESTADOCIVIL: c.ESTADOCIVIL
    };

    this.mostrarModal = true;
  }


  eliminarConfirmado() {
    if (this.idAEliminar === null) return;
    this.colaboradorService.deleteColaborador(this.idAEliminar).subscribe({
      next: () => {
        this.mostrarConfirmDelete = false;
        this.idAEliminar = null;
        this.cargarColaboradores();
        this.mostrarAlerta('Colaborador eliminado correctamente', 'success');
      },
      error: () => {
        this.mostrarConfirmDelete = false;
        this.mostrarAlerta('Error al eliminar colaborador', 'error');
      }
    });
  }

  nivelRiesgo(edad: number | null) {
    if (edad === null) return;
    if (edad < 18) {
      this.mostrarAlerta('Fuera de peligro', 'success');
    } else if (edad <= 60) {
      this.mostrarAlerta('Tenga cuidado, tome medidas de prevención', 'warning');
    } else {
      this.mostrarAlerta('Por favor quédese en casa', 'error');
    }
  }

  abrirModal() {
    this.modoEdicion = false;
    this.idEditar = null;

    this.nuevoColaborador = {
      NOMBRE: '',
      APELLIDO: '',
      DIRECCION: '',
      EDAD: null,
      PROFESION: '',
      ESTADOCIVIL: ''
    };
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardarDesdeModal(data: any) {
    const payload = {
      nombre: data.NOMBRE,
      apellido: data.APELLIDO,
      direccion: data.DIRECCION,
      edad: data.EDAD,
      profesion: data.PROFESION,
      estadocivil: data.ESTADOCIVIL
    };

    if (this.modoEdicion && this.idEditar !== null) { // editar
      this.colaboradorService.updateColaborador(this.idEditar, payload).subscribe(() => {
        this.cerrarModal();
        this.cargarColaboradores();
      });
    } else { //crear
      this.colaboradorService.createColaborador(payload).subscribe(() => {
        this.cerrarModal();
        this.cargarColaboradores();
      });
    }
  }

  siguientePagina() {
    if (this.paginaActual * this.limite < this.totalRegistros) {
      this.paginaActual++;
      this.cargarColaboradores();
    }
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.cargarColaboradores();
    }
  }

  cambiarLimite(nuevoLimite: number) {
    this.limite = nuevoLimite;
    this.paginaActual = 1;
    this.cargarColaboradores();
  }

  mostrarAlerta(mensaje: string, tipo: 'success' | 'error' | 'warning' = 'success') {
    this.alertaMensaje = mensaje;
    this.alertaTipo = tipo;
    this.alertaVisible = true;

    setTimeout(() => {
      this.alertaVisible = false;
    }, 2000);
  }

  confirmarEliminar(id?: number) {
    if (!id) return;
    this.idAEliminar = id;
    this.mostrarConfirmDelete = true;
  }

  cancelarEliminar() {
    this.idAEliminar = null;
    this.mostrarConfirmDelete = false;
  }
}
