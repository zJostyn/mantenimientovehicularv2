import { Component, Injector } from '@angular/core';
import { UsuariosService } from 'src/app/service/usuarios.service';
import axios from 'axios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehiculo-id',
  templateUrl: './vehiculo-id.component.html',
  styleUrls: ['./vehiculo-id.component.css']
})
export class VehiculoIDComponent {
  vehiculos: any[] = [];
  bandera: boolean = false;

  usuario_id: number = 0;
  marca: string = '';
  modelo: string = '';
  anio: string = '';
  tipo: string = '';
  chasis: string = '';
  placa: any = '';
  kilometraje: number = 0;
  link: string = '';

  constructor(private injector: Injector, private modalService: UsuariosService) { }

  ngOnInit(): void {
    const idFromLocalStorage = localStorage.getItem('id');
    const idAsNumber = idFromLocalStorage !== null ? parseInt(idFromLocalStorage) : 0;
    if (idAsNumber !== 0) {
      this.enviarVehiculo(idAsNumber);
    } else {
      console.log('El valor de "id" en localStorage no es un número válido.');
    }
  }

  get isBanderaSet(): boolean {
    return !!localStorage.getItem('bandera');
  }

  enviarVehiculo(val: number): void {
    if (this.isBanderaSet) {
      const usuariosService = this.injector.get(UsuariosService);
      usuariosService.postVehiculo(val).subscribe(
        (result) => {
          this.vehiculos = result;
          console.log("resultados: ", this.vehiculos);
        },
        (error) => {
          console.error('Error al obtener registros de inicio de sesión', error);
        }
      );
    } else {
      console.log('error');
    }
  }

  obtenerID(id: number, link: string): void {
    localStorage.setItem('id_vehiculo', id.toString());
    localStorage.setItem('link', link);
    this.agregarMantenimiento();
  }

  agregarMantenimiento(): void {
    this.modalService.abrirModal1();
  }

  mostrarVentanaEmergente(id: number) {
    const registro = this.vehiculos.find(vehiculos => vehiculos.id === id);
    this.usuario_id = registro.usuario_id;
    this.marca = registro.marca;
    this.modelo = registro.modelo;
    this.anio = registro.anio;
    this.tipo = registro.tipo;
    this.chasis = registro.chasis;
    this.placa = registro.placa;
    this.kilometraje = registro.kilometraje;
    this.link = registro.link;
  
    const ventanaEmergente = document.getElementById('ventanaEmergente');
    if (ventanaEmergente) {
      ventanaEmergente.style.display = 'block';
    }
  }
  
  cerrarVentanaEmergente() {
    const ventanaEmergente = document.getElementById('ventanaEmergente');
    if (ventanaEmergente) {
      ventanaEmergente.style.display = 'none';
    }
  }

  validarPlaca(placa: any): boolean {
    if (typeof placa !== 'string') {
      return false;
    }

    const placaRegex = /^[A-Z]{3}\d{4}$/;
    return placaRegex.test(placa);
  }

  guardar(id: number) {
    if (!this.validarPlaca(this.placa)) {
      Swal.fire("Error", "La placa debe tener 3 letras y 4 números y no exceder de 7 caracteres", "error");
      return;
    }
  
    if (
      this.usuario_id &&
      this.marca &&
      this.modelo &&
      this.anio &&
      this.tipo &&
      this.chasis &&
      this.placa &&
      this.kilometraje &&
      this.link
    ) {
      const formData = {
        usuario_id: this.usuario_id,
        marca: this.marca,
        modelo: this.modelo,
        anio: this.anio,
        tipo: this.tipo,
        chasis: this.chasis,
        placa: this.placa,
        kilometraje: this.kilometraje,
        link: this.link,
        id: id
      }
  
      const url = 'https://apimantenimientovehicularv2.onrender.com/api/updateVehiculo';
  
      axios.put(url, formData)
        .then(response => {
          this.cerrarVentanaEmergente();
          console.log('Respuesta del servidor:', response.data);
          Swal.fire({
            title: "Éxito",
            text: "Vehículo Actualizado",
            icon: "success",
            confirmButtonText: "Aceptar"
          }).then((result) => {
              if (result.isConfirmed) {
                  window.location.reload();
              }
          });
        })
        .catch(error => {
          console.error('Error al enviar la solicitud PUT:', error);
          Swal.fire("Error", "Vehículo no Actualizado", "warning");
        });
    } else {
      Swal.fire("Error", "Por favor, complete todos los campos", "error");
    }
  }
  
}
