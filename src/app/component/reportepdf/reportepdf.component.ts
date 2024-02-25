import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuariosService } from 'src/app/service/usuarios.service';

@Component({
  selector: 'app-reportepdf',
  templateUrl: './reportepdf.component.html',
  styleUrls: ['./reportepdf.component.css']
})
export class ReportepdfComponent implements OnInit{

  mant: string | null;
  vehi: string | null;
  mantenimiento: any[] = [];
  rol: string = '';
  nombrecompleto: string = '';
  email: string = '';
  infousuario: any[] = [];

  constructor(private arouter:ActivatedRoute, private mantenimientoscmds:UsuariosService){
    this.mant = this.arouter.snapshot.paramMap.get('mant');
    this.vehi = this.arouter.snapshot.paramMap.get('vehi');
  }
  ngOnInit(): void {
    if(this.mant != null) {
      this.obtenerMantenimiento();  
    }
    if(this.vehi != null) {
      this.obtenerMantenimientosVehiculo();
    }
    const rolFromLocalStorage1 = localStorage.getItem('rol');
    this.rol = rolFromLocalStorage1 !== null ? rolFromLocalStorage1 : 'valor1';
    const rolFromLocalStorage2 = localStorage.getItem('nombrecompleto');
    this.nombrecompleto = rolFromLocalStorage2 !== null ? rolFromLocalStorage2 : 'valor2';
    const rolFromLocalStorage3 = localStorage.getItem('email');
    this.email = rolFromLocalStorage3 !== null ? rolFromLocalStorage3 : 'valor3';
    this.definirInfoUsuario();
  }

  obtenerMantenimiento() {
    this.mantenimientoscmds.obtenerMantenimientoPorID(this.mant).subscribe(
      data => this.mantenimiento = data,
      error => console.log(error)
    )
  }

  obtenerMantenimientosVehiculo() {
    this.mantenimientoscmds.obtenerMantenimientosVehiculo(this.vehi).subscribe(
      data => this.mantenimiento = data,
      error => console.log(error)
    )
  }

  definirInfoUsuario() {
    const usuario = {
      rol: this.rol,
      nombrecompleto: this.nombrecompleto,
      email: this.email
    };

    this.infousuario.push(usuario);
  }

  imprimirPDF() {
    window.print();
  }

}
