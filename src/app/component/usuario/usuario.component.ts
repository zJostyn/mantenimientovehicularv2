import { Component } from '@angular/core';
import axios from 'axios';
import { UsuariosService } from 'src/app/service/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {

  nombrecompleto: string = '';
  nombredeusuario: string = '';
  email: string = '';
  pass: string = '';

  constructor(private verificar:UsuariosService) {
  }

  hasInvalidCharacters(): boolean {
    return !/^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+$/.test(this.nombrecompleto);
  }

  isInvalidEmail(): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return !emailPattern.test(this.email);
  }

  guardar() {
    if (
      this.nombrecompleto &&
      this.nombredeusuario &&
      this.email &&
      this.pass
    ) {
      this.verificar.verificarCorreo(this.email).subscribe
      ((data) => {
        console.log(data);
        this.verificar.verificarUsuario(this.nombredeusuario).subscribe
        ((data) => {
          console.log(data);
          const formData = {
            nombrecompleto: this.nombrecompleto,
            nombredeusuario: this.nombredeusuario,
            email: this.email,
            pass: this.pass
          }
    
          const url = 'https://apimantenimientovehicularv2.onrender.com/api/usuario';
    
          axios.post(url, formData)
            .then(response => {
              console.log('Respuesta del servidor:', response.data);
              Swal.fire("Éxito", "Usuario Registrado", "success");
              setTimeout(function () {
                window.location.href = '/login';
              }, 3000);
            })
            .catch(error => {
              console.error('Error al enviar la solicitud POST:', error);
              Swal.fire("Error", "Usuario no Registrado", "error");
            });
        }, 
        (error) => {
          Swal.fire("Error", "Ya existe un usuario igual a este!", "error");
        } 
      )
      }, 
      (error) => {
        Swal.fire("Error", "Ya existe un usuario con este correo!", "error");
      } 
    )
    } else {
      Swal.fire("Error", "Por favor, complete todos los campos", "error");
    }
  }
}
