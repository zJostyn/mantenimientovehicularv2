import { Component } from '@angular/core';
import { UsuariosService } from 'src/app/service/usuarios.service';
import { VehiculoComponent } from '../vehiculo/vehiculo.component';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-protected',
  templateUrl: './protected.component.html',
  styleUrls: ['./protected.component.css']
})
export class ProtectedComponent {

  rol: string = '';
  nombrecompleto: string = '';
  email: string = '';
  modalAbierto: boolean = true;
  id: string | null;
  idusuario: string = '';

  constructor(private modalService: UsuariosService, private arouter:ActivatedRoute, private mantenimientopendiente:UsuariosService) {
    this.id = this.arouter.snapshot.paramMap.get('id');
   }

  ngOnInit() {
    const rolFromLocalStorage1 = localStorage.getItem('rol');
    this.rol = rolFromLocalStorage1 !== null ? rolFromLocalStorage1 : 'valor1';
    const rolFromLocalStorage2 = localStorage.getItem('nombrecompleto');
    this.nombrecompleto = rolFromLocalStorage2 !== null ? rolFromLocalStorage2 : 'valor2';
    const rolFromLocalStorage3 = localStorage.getItem('email');
    this.email = rolFromLocalStorage3 !== null ? rolFromLocalStorage3 : 'valor3';
    const idusuarioFromLocalStorage1 = localStorage.getItem('id');
    this.idusuario = idusuarioFromLocalStorage1 !== null ? idusuarioFromLocalStorage1 : 'valor4'
    this.verificarMantenimientosPendientes();
  }

  agregarVehiculo(): void {
    this.modalService.abrirModal();
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  verificarMantenimientosPendientes() {
    if(this.id == 'perfil') {
      this.mantenimientopendiente.verificarMantenimientosPendientes(this.idusuario).subscribe(
        data => Swal.fire({
          title: 'Alerta del Sistema',
          html: data,
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        }),
        error => console.log(error)
      )
    }
  }

}