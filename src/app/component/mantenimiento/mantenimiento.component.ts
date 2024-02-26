import { Component } from '@angular/core';
import axios from 'axios';
import Swal from 'sweetalert2';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class MantenimientoComponent {
  vehiculo_id: number = 0;
  detalles: string = '';
  tipo: string = '';
  kilometraje: number = 0;
  alertas: string = '';
  fecha: Date = new Date();
  comentario: string = '';

  link: string = '';

  constructor(private dialogRef: MatDialogRef<MantenimientoComponent>) { }

  ngOnInit(): void {
    const idFromLocalStorage = localStorage.getItem('id_vehiculo');
    const idAsNumber = idFromLocalStorage !== null ? parseInt(idFromLocalStorage) : 0;
    this.vehiculo_id = idAsNumber;

    const link1 = localStorage.getItem('link');
    if (link1 !== null) {
      this.link = link1;
    } else {
      this.link = 'valor';
    }
  }

  isValidKilometraje(): boolean {
    return /^[0-9]+$/.test(this.kilometraje.toString());
  }

  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const formattedMonth = month < 10 ? '0' + month : month.toString();
    const formattedDay = day < 10 ? '0' + day : day.toString();
    return `${year}-${formattedMonth}-${formattedDay}`;
  }

  guardar() {
    if (
      this.vehiculo_id &&
      this.detalles &&
      this.tipo &&
      this.isValidKilometraje() &&
      this.alertas &&
      this.fecha &&
      this.comentario
    ) {
      const formData = {
        vehiculo_id: this.vehiculo_id,
        detalles: this.detalles,
        tipo: this.tipo,
        kilometraje: this.kilometraje,
        alertas: this.alertas,
        fecha: this.fecha,
        comentario: this.comentario
      }

      const url = 'https://apimantenimientovehicularv2.onrender.com/api/mantenimiento';

      axios.post(url, formData)
        .then(response => {
          console.log('Respuesta del servidor:', response.data);
          Swal.fire({
            title: "Éxito",
            text: "Mantenimiento Registrado",
            icon: "success",
            confirmButtonText: "Aceptar"
          }).then((result) => {
              if (result.isConfirmed) {
                this.dialogRef.close();
                window.location.reload();
              }
          });
        })
        .catch(error => {
          console.error('Error al enviar la solicitud POST:', error);
          Swal.fire("Error", "Mantenimiento no Registrado", "error");
        });
    } else {
      Swal.fire("Error", "Por favor, complete todos los campos", "error");
    }
  }
};