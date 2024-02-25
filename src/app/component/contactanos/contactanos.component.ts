import { Component } from '@angular/core';
import axios from 'axios';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contactanos',
  templateUrl: './contactanos.component.html',
  styleUrls: ['./contactanos.component.css']
})
export class ContactanosComponent {

  nombre:string='';
  mensaje:string='';

  guardar() {
    if (
      this.nombre &&
      this.mensaje
    ) {
      const formData = {
        nombre: this.nombre,
        mensaje: this.mensaje,
      }
      this.redireccionarWhatsApp(this.nombre, this.mensaje);
    } else {
      Swal.fire("Error", "Por favor, complete todos los campos", "error");
    }
  }

  redireccionarWhatsApp(nombre:any, mensaje:any) {
    const phoneNumber = "593989435811";
    const message = encodeURIComponent( "Nombre: " + nombre + " Mensaje: " + mensaje); // Codificar el mensaje para la URL
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${message}`;

    Swal.fire("Éxito", "Redirigiendo a WhatsApp", "success").then(() => {
      window.location.href = whatsappLink;
    });
  }
  
}
