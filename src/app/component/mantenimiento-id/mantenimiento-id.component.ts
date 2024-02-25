import { Component, Injector } from '@angular/core';
import { UsuariosService } from 'src/app/service/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mantenimiento-id',
  templateUrl: './mantenimiento-id.component.html',
  styleUrls: ['./mantenimiento-id.component.css']
})
export class MantenimientoIDComponent {
  mantenimiento: any[] = [];
  mantenimiento1: any[] = [];
  bandera: boolean = false;
  filtroTipo: string = 'todos';
  filtroID: number = 0;
  mostrarTooltip: boolean = false;
  linkVehiculoSeleccionado: any[] = [];
  IdMantenimientoSeleccionado:any = "";

  constructor(private injector: Injector, private funcionesmantenimiento:UsuariosService) { }

  ngOnInit(): void {
    const usuariosService = this.injector.get(UsuariosService);
    const idFromLocalStorage = localStorage.getItem('id');
    const idAsNumber = idFromLocalStorage !== null ? parseInt(idFromLocalStorage) : 0;

    if (idAsNumber !== 0) {
      usuariosService.postMantenimiento1(idAsNumber).subscribe(data => {
        this.mantenimiento1 = data;
      });
    } else {
    }
  }

  get isBanderaSet(): boolean {
    return !!localStorage.getItem('bandera');
  }

  enviarMantenimiento(val: number): void {
    if (this.isBanderaSet) {
      const usuariosService = this.injector.get(UsuariosService);

      usuariosService.postMantenimiento(val).subscribe(
        (result) => {
          this.mantenimiento = result;
          this.mostrarAlerta();
          console.log("resultados: ", this.mantenimiento);
        },
        (error) => {
          console.error('Error al obtener registros de inicio de sesión', error);
        }
      );
    } else {
      console.log('error');
    }
  }

  obtenerId(id: number) {
    if (this.isBanderaSet) {
      Swal.fire({
        title: '¿Estás seguro de eliminar Mantenimiento?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'No, cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          const usuariosService = this.injector.get(UsuariosService);
          usuariosService.deleteMantenimiento(id).subscribe(
            (result) => {
              this.mantenimiento = result;
              console.log("resultados: ", this.mantenimiento);
            },
            (error) => {
              console.error('Error al obtener registros de inicio de sesión', error);
            }
          );
        } else {
          console.log('Eliminación cancelada');
        }
      });
    } else {
      console.log('error');
    }
  }

  actualizarMantenimiento(val: number): void {
    const usuariosService = this.injector.get(UsuariosService);

    usuariosService.updateMantenimiento(val).subscribe(
      (result) => {
        if (result) {
          Swal.fire("Mantenimiento", "Mantenimiento Realizado Exitosamente", "success");
        } else {
          Swal.fire("Error", "No se pudo realizar el mantenimiento", "error");
        }
      },
      (error) => {
        console.error('Error al actualizar el mantenimiento', error);
        Swal.fire("Error", "Ocurrió un error al actualizar el mantenimiento", "error");
      }
    );
  }


  mostrarAlerta() {
    console.log('Entrando a mostrarAlerta');
  
    const alertasPorId = new Map(); 
  
    for (const login of this.mantenimiento) {
      console.log('Verificando login.alertas:', login.alertas);
  
      if (login.alertas === 'Por Realizar') {
        const fechaMantenimiento = new Date(login.fecha);
        const fechaActual = new Date();
        const diferencia = fechaMantenimiento.getTime() - fechaActual.getTime();
        const diasFaltantes = Math.floor(diferencia / (1000 * 3600 * 24));
  
        let mensaje = '';
  
        if (diasFaltantes < 0) {
          mensaje = `El Mantenimiento con ID número ${login.id} está atrasado.`;
        } else if (diasFaltantes === 0) {
          mensaje = `El Mantenimiento con ID número ${login.id} es hoy.`;
        } else {
          mensaje = `El Mantenimiento con ID número ${login.id} le faltan ${diasFaltantes} días.`;
        }
  
        if (!alertasPorId.has(login.id)) {
          alertasPorId.set(login.id, []);
        }
        alertasPorId.get(login.id).push(mensaje);
      }
    }
  
    let mensajeAlerta = '';
  
    for (const [id, alertas] of alertasPorId) {
      mensajeAlerta += `<br>${alertas.join('<br>')}`;
    }
  
    if (mensajeAlerta !== '') {
      console.log('Mostrando alertas:', mensajeAlerta);
  
      Swal.fire({
        title: 'Alertas Para Este Vehículo',
        html: mensajeAlerta,
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  obtenerImagenVehiculoSeleccionado(filtro:any):any {
    this.funcionesmantenimiento.obtenerIMGVehi(filtro).subscribe(
      data => this.linkVehiculoSeleccionado = data,
      error => console.log(error)
    )
  }

  definirIDMantenimientoSeleccionado(id: any) {
    this.IdMantenimientoSeleccionado = id;
    console.log(this.IdMantenimientoSeleccionado);
  }

  agendamientoSuccess(mensaje:string) {
    Swal.fire({
      title: "Agendamiento de Mantenimiento",
      text: mensaje,
      icon: "success",
      confirmButtonText: "Aceptar"
    }).then((result) => {
        if (result.isConfirmed) {
            this.cerrarVentanaEmergente();
            window.location.reload();
        }
    });
  }

  reAgendarMantenimiento(fechaasignada: any) {
    this.funcionesmantenimiento.reAsignarFechaMantenimiento(this.IdMantenimientoSeleccionado, fechaasignada).subscribe(
      data => this.agendamientoSuccess(data.toString()),
      error => Swal.fire("Agendamiento de Mantenimiento", error.toString() , "error"),
    )
    
  }

  mostrarVentanaEmergente() : void {
    const ventanaEmergente = document.getElementById('ventanaEmergente');
    if (ventanaEmergente) {
      ventanaEmergente.style.display = 'block';
    }
  }
  
  cerrarVentanaEmergente(): void {
    const ventanaEmergente = document.getElementById('ventanaEmergente');
    if (ventanaEmergente) {
      ventanaEmergente.style.display = 'none';
    }
  }
}
